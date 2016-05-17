var request = require('request');
var fs = require('fs');
var cheerio = require('cheerio');

var HEADER_URL = 'https://raw.githubusercontent.com/kaltura/DeveloperPortalDocs/master/_includes/header.html';
var HEADER_FILE = __dirname + '/../static/js/generated/navbar-links.js';
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
      .replace("{{ site.time | date: '%Y' }}", '2016')
  $ = cheerio.load(body);
  $('a').each(function() {
    $(this).attr('href', getLink($(this).attr('href')));
  })
  fs.writeFileSync(FOOTER_FILE, $.html().replace(/&apos;/g, '\''));
})

function getLink(orig) {
  orig = orig || '';
  return orig.replace('https://developer.kaltura.com', '').replace('http://developer.kaltura.com', '');
}

request.get(HEADER_URL, function(err, resp, body) {
  $ = cheerio.load(body);
  var navItems = [];
  var firstLink = $('.first-nav-link');
  navItems.push({
    title: firstLink.text().trim(),
    href: getLink(firstLink.attr('href')),
  })
  $('.w-dropdown').each(function() {
    navItem = {}
    navItems.push(navItem);
    navItem.title = $(this).find('.w-dropdown-toggle').text().trim();
    navItem.items = [];
    $(this).find('.w-dropdown-list > a').each(function() {
      navItem.items.push({
        title: $(this).text().trim(),
        href: getLink($(this).attr('href')),
      })
    })
  })
  fs.writeFileSync(HEADER_FILE, 'window.KALTURA_NAVBAR_LINKS = ' + JSON.stringify(navItems))
})
