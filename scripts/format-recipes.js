var FS =require('fs');
FS.readdirSync(__dirname + '/../recipes').forEach(function(file) {
  if (file.indexOf('.json') === -1) return;
  file = __dirname + '/../recipes/' + file;
  var recipe = JSON.parse(FS.readFileSync(file, 'utf8'));
  FS.writeFileSync(file, JSON.stringify(recipe, null, 2));
})
