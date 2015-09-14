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
          "type": "numeric",
          "name": "metadataObjectType",
          "hidden": true
        },
        {
          "default": 1,
          "type": "numeric",
          "name": "objectType",
          "hidden": true
        },
        {
          "default": 1,
          "type": "numeric",
          "name": "createMode",
          "hidden": true
        },
        {
          "default": "<xsd:schema></xsd:schema>",
          "type": "text",
          "label": "XSD data",
          "name": "xsdData",
          "hidden": true
        }
     ]  
    }
    ],
    "pages": [
        {
            "view": "metadataProfileShow",
            "data": {
                "action": "addMetadataProfile"
            }
        }
    ],
    "views": [
        "metadataProfileShow",
    ],
    "actions": [
        {
            "service": "metadataProfile",
            "action": "add",
            "view": "metadataProfileShow"
        },
     ]
}
