app.controller('Downloader', function($scope) {
  $scope.zip = new JSZip();
  $scope.download = function() {
    console.log('downloading')
    $scope.files.forEach(function(file) {
      $scope.zip.file($scope.recipe.name + '/' + file.filename, file.contents);
    });
    var blob = $scope.zip.generate({type: "blob"});
    saveAs(blob, $scope.recipe.name + ".zip");
  }
});
