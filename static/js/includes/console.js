window.checkResponse = function(data, status, xhr) {
  var msg = {type: 'success', message: "Success"};
  if (data === null) return msg;
  if (data instanceof Document) {
    var $data = $(data);
    if ($data.find('error').length) {
      var code = $data.find('code').text();
      var message = $data.find('error message').text();
      msg = {type: 'danger', message: code + ': ' + message};
    }
  } else if (typeof data === 'object') {
    var err = data.code && data.message;
    if (err) msg = {type: 'danger', message: data.code + ': ' + data.message};
    if (window.RECIPE && data.objectType === 'KalturaUiConfListResponse') {
      data.objects = data.objects.filter(function(uiConf) {
        return (uiConf.html5Url || '').indexOf('/v2') !== -1;
      });
      if (!data.objects.length) return {type: 'danger', message: 'No v2 uiConfs found.'}
    }
  }
  if (msg.message.indexOf('SERVICE_FORBIDDEN') !== -1) {
    $('#KalturaLogin').modal('show');
  }
  return msg;
}

window.saveRecipe = function(recipe, callback) {
  var token = '';
  var github = function(method, path, query, data, innerCb) {
    if (!innerCb) {
      innerCb = data;
      data = null;
    }
    query = query || {};
    headers = {'Content-Type': 'application/json'};
    if (token) query.access_token = token;
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
      callback(xhr.responseText);
    });
  }
  var repoPath = '/repos/kaltura/kaltura-api-recipes';
  var filePath = '/contents/recipes-v2/' + recipe.name + '.json';
  var params = {
    client_id: ENV.github_client_id,
    redirect_uri: ENV.github_callback_url,
    scope: 'public_repo',
  }

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

  window.onOAuthComplete = function(qs) {
    $.ajax({
      method: 'POST',
      url: '/github/access_token?code=' + qs.code,
      headers: {'Content-Type': 'application/json'},
    }).success(function(data) {
      token = data.access_token;
      github('POST', repoPath + '/forks', {}, function(repo) {
        var theirRepoPath = '/repos/' + repo.full_name;
        github('GET', theirRepoPath + filePath, {}, function(file) {
          github('PUT', theirRepoPath + filePath, {}, {
            message: "Update recipe: " + recipe.name,
            content: btoa(unescape(encodeURIComponent(JSON.stringify(recipe, null, 2)))),
            sha: file.sha,
          }, function(msg) {
            github('POST', repoPath + '/pulls', {}, {
              title: 'Update recipe: ' + recipe.name,
              base: 'development',
              head: repo.owner.login + ':development',
            }, function(pr) {
              callback(null, 'Successfully opened a Pull Request' + (pr.html_url ? ' at ' + pr.html_url : ''));
            })
          });
        });
      })
    }).fail(function(xhr) {
      callback(xhr.responseText);
    })
  }
  window.open('https://github.com/login/oauth/authorize?' + $.param(params), '_blank');
}
