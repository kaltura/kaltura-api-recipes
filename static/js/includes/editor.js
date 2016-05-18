if (window.location.pathname.match(/\/edit$/)) {
  $(document).ready(function() {
    $('#KalturaGitHubModal').modal('show');
  });
}

window.hideGitHubModal = function() {
  $('#KalturaGitHubModal').modal('hide');
}

var GitHub = function (opts) {
  this.o = opts;
}
GitHub.prototype.req = function(method, path, query, data, innerCb) {
  var self = this;
  if (!innerCb) {
    innerCb = data;
    data = null;
  }
  query = query || {};
  headers = {'Content-Type': 'application/json'};
  if (self.o.token) query.access_token = self.o.token;
  $.ajax({
    method: method,
    url: 'https://api.github.com' + path + '?' + $.param(query),
    data: data ? JSON.stringify(data) : undefined,
    headers: headers,
  }).success(innerCb).fail(function(xhr) {
    if (xhr.responseJSON && xhr.responseJSON.errors && xhr.responseJSON.errors[0]) {
      var err = xhr.responseJSON.errors[0];
      if (err && err.message.indexOf('A pull request already exists') === 0) return innerCb({});
    }
    if (self.o.errBack) self.o.errBack(xhr.responseText);
    else innerCb(null);
  });
}

function runGitHubOAuth(callback) {
  if (window.GITHUB_TOKEN) return callback(null, window.GITHUB_TOKEN);
  window.onOAuthComplete = function(qs) {
    if (qs.error) return callback(qs);
    $.ajax({
      method: 'POST',
      url: '/github/access_token?code=' + qs.code,
      headers: {'Content-Type': 'application/json'},
    }).success(function(data) {
      window.GITHUB_TOKEN = data.access_token;
      callback(null, data.access_token);
    }).fail(function(xhr) {
      callback(xhr.responseText);
    });
  };
  var params = {
    client_id: ENV.github_client_id,
    redirect_uri: ENV.github_callback_url,
    scope: 'public_repo',
  }
  window.open('https://github.com/login/oauth/authorize?' + $.param(params), '_blank');
}

window.loadRecipe = function(name, callback) {
  runGitHubOAuth(function(err, tok) {
    if (err) return callback(err);
    var github = new GitHub({errBack: callback, token: tok});
    github.req('GET', '/user', {}, function(user) {
      var path = '/repos/' + user.login + '/kaltura-api-recipes';
      path += '/contents/recipes-v2/' + name + '.json';
      github.req('GET', path, {}, function(file) {
        var recipe = JSON.parse(atob(file.content));
        recipe.defaults = recipe.defaults || {};
        recipe.defaults.recipeName = recipe.name;
        recipe.defaults.format = 1;
        callback(null, recipe);
      });
    });
  })
}

window.saveRecipe = function(recipe, callback) {
  if (recipe.name === 'new_recipe') return callback("Please specify a unique ID for your recipe.")
  var repoPath = '/repos/kaltura/kaltura-api-recipes';
  var filePath = '/contents/recipes-v2/' + recipe.name + '.json';
  var descLoc = (recipe.description || '').indexOf('This recipe uses the following operations');
  if (descLoc === 0) delete recipe.description;
  else if (descLoc !== -1) recipe.description = recipe.description.substring(0, descLoc).split('\n\n');
  if (recipe.defaults) {
    delete recipe.defaults.serviceURL;
    delete recipe.defaults.format;
    delete recipe.defaults.recipeName;
    if (!Object.keys(recipe.defaults).length) delete recipe.defaults;
  }
  recipe.steps.forEach(function(s) {
    s.description = s.description || '';
    if (!s.description.length) delete s.description;
    else s.description = s.description.split('\n\n');
  });

  runGitHubOAuth(function(err, tok) {
    if (err) return callback(err);
    var github = new GitHub({errBack: callback, token: tok});
    github.req('POST', repoPath + '/forks', {}, function(repo) {
      var theirRepoPath = '/repos/' + repo.full_name;
      github.o.errBack = null;
      github.req('GET', theirRepoPath + filePath, {}, function(file) {
        github.o.errBack = callback;
        github.req('PUT', theirRepoPath + filePath, {}, {
          message: "Update recipe: " + recipe.name,
          content: btoa(unescape(encodeURIComponent(JSON.stringify(recipe, null, 2)))),
          sha: file ? file.sha : undefined,
        }, function(msg) {
          github.req('POST', repoPath + '/pulls', {}, {
            title: 'Update recipe: ' + recipe.name,
            base: 'development',
            head: repo.owner.login + ':development',
          }, function(pr) {
            callback(null, 'Successfully opened a Pull Request at ' + (pr.html_url || 'https://github.com/kaltura/kaltura-api-recipes'))
          })
        });
      });
    });
  });
}
