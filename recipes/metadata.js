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
          "default": 1,
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
    }, 
    {
      "page": 1,
      "title": "Add value",
      "affects": "addMetadata",
      "tip": ".",
      "disableAutorefresh": true,
      "inputs": [
        {
          "default": "",
          "type": "text",
          "label": "entryId",
          "name": "objectId"
        },
        {
          "default": "",
          "type": "text",
          "label": "XML",
          "name": "xmlData"
        },
        {
          "default": 1,
          "type": "number",
          "name": "objectType",
          "hidden": true
        },
	{
	 "type": "select-chosen",
	 "name": "Metadata Profile",
	 "dynamicChoices": {
	    "service": "metadataProfile",
	    "action": "list",
		"map": {
		    "value": "id",
		    "label": "name"
		}
	    }
	}
     ]  
    },
    {
      "page": 2,
      "inputs": [],
    }],
    "pages": [
        {
            "view": "metadataProfileShow",
            "data": {
                "action": "addMetadataProfile"
            },
            "view": "metadataShow",
            "data": {
                "action": "addMetadata"
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
        "metadataShow",
        "KalturaMetadataProfileListResponse",
        "metadataProfileDeleted",
    ],
    "actions": [
        {
            "service": "metadataProfile",
            "action": "add",
            "view": "metadataProfileShow"
        },
        {
            "service": "metadata",
            "action": "add",
            "view": "metadataShow"
        },
        {
            "service": "metadataProfile",
            "action": "deleteAction",
            "view": "metadataProfileDeleted"
        },
        {
            "service": "metadataProfile",
            "action": "listAction",
            "view": "KalturaMetadataProfileListResponse"
        },
     ]
}
