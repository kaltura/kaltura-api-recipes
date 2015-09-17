var FS = require('fs');
module.exports = {
  "name": "metadata",
  "title": "Working with metadata",
  "icon": "exclamation",
  "description": "Learn to work with metadata.",
  "control_sets": [
    {
      "page": 0,
      "title": "Create metadata profile",
      "affects": "addMetadataProfile",
      "tip": ".",
      "disableAutorefresh": true,
      "inputs": [
        {
          "default": "",
          "type": "text",
          "label": "Profile Name",
          "name": "name"
        },
        {
          "default": "",
          "type": "text",
          "label": "System Profile Name",
          "name": "systemName"
        },
        {
          "default": "1",
          "type": "number",
          "name": "metadataObjectType",
          "hidden": true
        },
        {
          "default": 1,
          "type": "number",
          "name": "objectType",
          "hidden": true
        },
        {
          "default": 1,
          "type": "number",
          "name": "createMode",
          "hidden": true
        },
        {
          "default": FS.readFileSync(__dirname + '/data/metadata_profile_sample.xsd', 'utf8'),
          "type": "text",
          "label": "XSD data",
          "name": "xsdData",
          "hidden": true
        }
     ]  
    }, {
      "page": 1,
      "inputs": [],
    }],
    "pages": [
        {
            "view": "metadataProfileShow",
            "data": {
                "action": "addMetadataProfile"
            }
        },
        {
          "view": "KalturaMetadataProfileListResponse",
          "data": {
            "action": "listMetadataProfile"
          }
        }
    ],
    "views": [
        "metadataProfileShow",
        "KalturaMetadataProfileListResponse",
        "triggerDeleteMetadata",
    ],
    "actions": [
        {
            "service": "metadataProfile",
            "action": "add",
            "view": "metadataProfileShow"
        },
        {
            "service": "metadataProfile",
            "action": "deleteAction",
        },
        {
            "service": "metadataProfile",
            "action": "listAction",
            "view": "KalturaMetadataProfileListResponse"
        },
     ]
}
