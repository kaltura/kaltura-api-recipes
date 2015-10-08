var clientLibLink = 'https://www.kaltura.com/api_v3/testme/client-libs.php';

window.getDownloadInfo =  function(language, recipe) {
  var libDir = language.id === 'javascript' ? '/js' : '/lib';
  var message =
    '  You\'ll need to download the ' + language.label + ' Kaltura Client Library</p>'
  + '  <p class="small">'
  + '    Visit <a href="' + clientLibLink + '" target="_blank">' + clientLibLink + '</a>'
  + '    to download the library, and extract it to the ' + libDir + ' directory inside this zip.'
  + '  </p>';
  return message;
}

window.getDownloadFiles = function(language, recipe, callback) {
  console.log('get dlf');
  var libDir = language.id === 'javascript' ? 'js' : 'lib';
  var readme = [
    '# Kaltura ' + recipe.title + ' Sample App',
    '',
    '## Description',
    recipe.description,
    '',
    '## Installation',
    'You can download the [' + language.label + ' client library here](' + clientLibLink + ')',
    '',
    'To use this example, extract it to the /' + libDir + ' subfolder'
  ].join('\n');

  var files = [{
    filename: 'README.md',
    contents: readme,
  }, {
    filename: libDir,
    directory: true,
  }];

  if (language.id === 'javascript' && 
      (recipe.name === 'upload' || recipe.name === 'captions')) {
    /*
    var fileupload = '/js/jquery.fileupload-ui.js';
    $.ajax({
      url: fileupload
    })
    .done(function(data) {
      files.push({
        filename: fileupload,
        contents: data,
      });
      callback(null, files);
    })
    .fail(function() {
      console.log(arguments)
      callback("Error getting " + fileupload)
    })
    */
    callback(null, files);
  } else {
    callback(null, files);
  }
}
