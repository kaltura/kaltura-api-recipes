var authBase = {
  "page": -1,
  "title": "Starting a KalturaSession",
  "tip": "Start a KalturaSession (ks) by supplying your Partner ID and Admin Secret.\n\nYou can find your info in the [Kaltura Management Console](http:\/\/kmc.kaltura.com\/index.php\/kmc\/kmc4#account|integration)",
  "affects": "setup",
  "inputs": [
    {
      "type": "number",
      "label": "Partner ID",
      "name": "partnerId"
    },
    {
      "type": "text",
      "label": "User ID",
      "name": "userId",
      "default": "lucybot@example.com"
    },
    {
      "type": "text",
      "label": "Secret",
      "name": "adminSecret"
    },
    {
      "type": "select",
      "label": "Session Type",
      "name": "sessionType",
      "hidden": true,
      "default": 2,
      "choices": [
        {"label": "Admin", "value": 2},
        {"label": "User", "value": 0}
      ]
    }
  ]
};

var authSessionSelect = JSON.parse(JSON.stringify(authBase));
authSessionSelect.inputs[3].hidden = false;

module.exports = {
  admin: authBase,
  sessionSelect: authSessionSelect,
}
