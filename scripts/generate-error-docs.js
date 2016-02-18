var request = require('request');
var fs = require('fs');

var URL = 'https://raw.githubusercontent.com/kaltura/server/Kajam-11.8.0/api_v3/lib/KalturaErrors.php';

request.get(URL, function(err, resp, body) {
  if (err) throw err;
  var lines = body.split('\n');
  var errors = [];
  lines.forEach(function(line) {
    var matches = line.match(/const (\w+) = ".*;([^;]+)";/)
    if (!matches) return;
    errors.push({
      name: matches[1],
      description: matches[2],
    })
  })
  errors = '# Error Codes\n\n' + errors.map(function(error) {
    return '* `' + error.name + '` - ' + error.description;
  }).join('\n');
  fs.writeFileSync(__dirname + '/../static/errors.md', errors);
})
