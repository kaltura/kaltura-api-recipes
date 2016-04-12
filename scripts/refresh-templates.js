var request = require('request');
var fs = require('fs');

var FOOTER_URL = 'https://raw.githubusercontent.com/kaltura/DeveloperPortalDocs/master/_includes/footer.html';
var FOOTER_FILE = __dirname + '/../views/generated/footer.html';

request.get(FOOTER_URL, function(err, resp, body) {
  body = body
      .replace(/<script.*/g, '')
      .replace(/w-row/g, 'row')
      .replace(/w-col w-col-3/g, 'col-xs-3')
      .replace(/w-col w-col-4 w-col-medium-6/g, 'col-xs-4 col-md-6')
      .replace(/w-col w-col-8 w-col-medium-6/g, 'col-xs-8 col-md-6')
      .replace(/copyright-container/, 'container copyright-container')
  fs.writeFileSync(FOOTER_FILE, body);
})
