app.controller('Downloader', function($scope) {
  $scope.clientLibLink = 'https://www.kaltura.com/api_v3/testme/client-libs.php';
  $scope.zip = new JSZip();
  $scope.showDownload = function() {
    $('#DownloadModal').modal('show')
  }
  $scope.$watch('language', function() {
    if (!$scope.language) return;
    $scope.libDir = $scope.language.id === 'javascript' ? 'js' : 'lib';
  });

  $scope.download = function() {
    var readme = [
      '# Kaltura ' + $scope.recipe.title + ' Sample App',
      '',
      '## Description',
      $scope.recipe.description,
      '',
      '## Installation',
      'You can download the [' + $scope.language.label + ' client library here](' + $scope.clientLibLink + ')',
      '',
      'To use this example, extract it to the /' + $scope.libDir + ' subfolder'
    ].join('\n');
    $scope.files.forEach(function(file) {
      $scope.zip.file($scope.recipe.name + '/' + file.filename, file.contents);
    });
    $scope.zip.file($scope.recipe.name + '/README.md', readme);
    $scope.zip.folder($scope.recipe.name + '/' + $scope.libDir);

    var blob = $scope.zip.generate({type: "blob"});
    saveAs(blob, 'kaltura_' + $scope.recipe.name + ".zip");
  }
});
