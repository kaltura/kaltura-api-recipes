var fs = require('fs');

var VAST_URLS = [{
  "label": "DoubleClick IMA - VAST Overlay",
  "value": "https://pubads.g.doubleclick.net/gampad/ads?sz=480x70&iu=/124319096/external/single_ad_samples&ciu_szs=300x250&impl=s&gdfp_req=1&env=vp&output=vast&unviewed_position_start=1&cust_params=deployment%3Ddevsite%26sample_ct%3Dnonlinear&correlator="
}, {
  "label": "Sizmek - VAST Linear",
  "value": "http://bs.serving-sys.com/BurstingPipe/adServer.bs?cn=is&c=23&pl=VAST&pli=10724976&PluID=0&pos=113&ord=%5btimestamp%5d&cim=1&t=1&ai=23227072"
}, {
  "label": "Liverail - VAST Linear",
  "value": "http://ad3.liverail.com/?LR_PUBLISHER_ID=1331&LR_CAMPAIGN_ID=229&LR_SCHEMA=vast2"
}, {
  "label": "Liverail - VAST Overlay",
  "value": "http://ad3.liverail.com/?LR_PUBLISHER_ID=1331&LR_CAMPAIGN_ID=228&LR_SCHEMA=vast2"
}, {
  "label": "LoopMe - VAST Linear",
  "value": "http://loopme.me/api/vast/ads?appId=e18c19fa43&vast=2&campid=6029"
}, {
  "label": "Innovid - VPAID Linear with Overlay takeover",
  "value": "http://rtr.innovid.com/r1.55428f380f6ec7.80913641;cb=[timestamp]"
}, {
  "label": "AdSpeed - VAST Linear",
  "value": "http://g.adspeed.net/ad.php?do=vast&aid=115727&cb=1322853066&evtv=single"
}, {
  "label": "SpotXchange - VPAID Linear",
  "value": "http://search.spotxchange.com/vast/2.00/85394?VPAID=js&content_page_url=www.testing123.com&cb=__random-number__&device[devicetype]=1&device[dnt]=0",
}];

module.exports = function(recipe) {
  var mediaParam = recipe.steps[0].parameters[1];
  require('./crud')(recipe, {
    name: 'Ad Cue Point',
    service: 'cuePoint',
    serviceName: 'cuepoint_cuepoint',
  });
  recipe.steps[0].parameters = [mediaParam];
  recipe.steps[0].parameters.push({
    name: 'filter[objectType]',
    value: 'KalturaAdCuePointBaseFilter',
    hidden: true,
  });
  recipe.steps[0].description += '\n\nUse a `KalturaAdCuePointBaseFilter` to retrieve only Ad cue points.';

  recipe.steps[1].description = "Use the controls below to add a new cue point to one of your videos";
  recipe.steps[1].parameters = [
    {name: 'cuePoint[entryId]'},
    {
      name: 'cuePoint[sourceUrl]',
      enum: VAST_URLS.map(u => u.value),
      enumLabels: VAST_URLS.map(u => u.label),
      'x-inputType': 'text'
    },
    {name: 'cuePoint[startTime]'},
    {name: 'cuePoint[objectType]', default: 'KalturaAdCuePoint', hidden: true},
  ]
  recipe.steps[1].parameters[0].dynamicEnum = recipe.steps[0].parameters[0].dynamicEnum;
  recipe.steps[1].parameters[0].dynamicValue = {fromStep: 0, answer: 'filter[entryIdEqual]'};

  recipe.steps.splice(3, 0, {
    title: 'Viewing your Advertisement',
    description: "Now you can see your new Cue Point wherever you embed your video.",
    apiCall: {
      path: '/service/media/action/get',
      method: 'get',
    },
    parameters: [{
      name: 'entryId',
      dynamicValue: {fromStep: 0, answer: 'filter[entryIdEqual]'},
      dynamicEnum: require('./enum')('media')
    }, {
      name: 'uiConf',
      type: 'string',
      dynamicEnum: require('./enum')('uiconf')
    }],
  });

  recipe.steps.splice(4, 0, {
    title: 'Listening for Cue Points',
    description: "You can use kWidget to listen for when your Cue Points are triggered",
    codeSnippet: {javascript: fs.readFileSync(__dirname + '/html/CuePointListener.js', 'utf8')},
    demoHTML: fs.readFileSync(__dirname + '/html/CuePointDemo.html', 'utf8'),
    parameters: recipe.steps[3].parameters,
  })

  return recipe;
}
