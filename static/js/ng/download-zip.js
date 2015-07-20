app.controller('Downloader', function($scope) {
  $scope.zip = new JSZip();
  $scope.download = function() {
    var language = $('#Language').scope().language;
    var libDir = language.id === 'javascript' ? 'js' : 'lib';
    var README = [
      'README',
      '# Kaltura ' + $scope.recipe.title + ' Recipe',
      '',
      '## Description',
      $scope.recipe.description,
      '',
      '## Installation',
      'You can download the [' + language.label + ' client library here](http://www.kaltura.com/api_v3/testme/client-libs.php)',
      'To use this example, extract it to the /' + libDir + ' subfolder'
    ].join('\n');

    console.log('downloading')
    $scope.files.forEach(function(file) {
      $scope.zip.file($scope.recipe.name + '/' + file.filename, file.contents);
    });
    $scope.zip.file($scope.recipe.name + '/README.md', README);
    $scope.zip.folder($scope.recipe.name + '/' + libDir);

    var blob = $scope.zip.generate({type: "blob"});
    saveAs(blob, 'kaltura_' + $scope.recipe.name + ".zip");
  }
});
