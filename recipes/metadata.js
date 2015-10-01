var FS = require('fs');
module.exports = {
    "name": "metadata",
    "title": "Working with metadata",
    "icon": "exclamation",
    "description": "Learn to work with metadata.",
    "related_recipes": ["video_search"],
    "recipe_steps": [{
        "page": 0,
        "title": "Create metadata profile",
        "code_snippet": "addMetadataProfile",
        "tip": "This recipe will walk you through using custom metadata fields with entries. Custom metadata can also be applied to other objects, such as categories.",
        "disable_autorefresh": true,
        "inputs": [{
            "default": "",
            "type": "text",
            "label": "Profile Name",
            "name": "name"
        }, {
            "default": "",
            "type": "text",
            "label": "System Profile Name",
            "name": "systemName"
        }, {
            "default": "1",
            "type": "text",
            "name": "metadataObjectType",
            "hidden": true
        }, {
            "default": "1",
            "type": "text",
            "name": "objectType",
            "hidden": true
        }, {
            "default": "1",
            "type": "text",
            "name": "createMode",
            "hidden": true
        }, {
            "default": FS.readFileSync(__dirname + '/data/metadata_profile_sample.xsd', 'utf8'),
            "type": "text",
            "label": "XSD data",
            "name": "xsdData",
            "hidden": true
        }]
    }, {
        "page": 1,
        "title": "Add metadata to an entry",
        "code_snippet": "addMetadata",
	"tip": "To learn how to search through metadata fields, please see the [video_search recipe](https://developer.kaltura.org/recipes/video_search)",
        "disable_autorefresh": true,
        "inputs": [{
            "default": "",
            "type": "text",
            "label": "entryId",
            "name": "objectId"
        }, {
            "default": "<metadata><Somefield>LINUX RULES</Somefield></metadata>",
            "type": "text",
            "label": "XML",
            "name": "xmlData"
        }, {
            "default": "1",
            "type": "text",
            "name": "objectType",
            "hidden": true
        }, {
            "type": "select-chosen",
            "name": "metadataProfileId",
            "label": "Metadata Profile",
            "dynamic_choices": {
                "service": "metadataProfile",
                "action": "list",
                "map": {
                    "value": "id",
                    "label": "name"
                }
            }
        }]
    }, {
        "page": 2,
        "title": "Update entry metadata",
        "code_snippet": "updateMetadata",
        "tip": ".",
        "disable_autorefresh": true,
        "inputs": [{
            "default": "",
            "type": "text",
            "label": "Metadata ID",
            "name": "id"
        }, {
            "default": "<metadata><Somefield>NEW VALUE HERE</Somefield></metadata>",
            "type": "text",
            "label": "XML",
            "name": "xmlData"
        }]
    }, {
        "page": 3,
        "title": "Delete metadata",
        "tip": "Browse existing ids in the frame below and click 'Delete' to remove them.",
        "disable_autorefresh": true,
        "inputs": [{
            "default": "",
            "type": "text",
            "label": "entryId",
            "name": "objectIdEqual"
        }, {
            "type": "select-chosen",
            "name": "metadataProfileIdEqual",
            "label": "Metadata Profile",
            "dynamic_choices": {
                "service": "metadataProfile",
                "action": "list",
                "map": {
                    "value": "id",
                    "label": "name"
                }
            },
	"arguments": [{
	    "class": "KalturaMetadataFilter",
	    "parameters": {
		"metadataProfileIdEqual": {"answer": "metadataProfileIdEqual"},
		"objectIdEqual": {"answer": "objectIdEqual"}
	    }    
        }]
        }]
    }, {
        "page": 4,
        "title": "Delete metadata profiles",
        "tip": "Browse existing profiles in the frame below and click 'Delete' to remove them.",
        "inputs": [],
    }],

    "pages": [{
        "views": ["metadataProfileShow"],
        "actions": [{
          "service": "metadataProfile",
          "action": "add",
          "view": "metadataProfileShow"
        }],
        "start": {
          "view": "metadataProfileShow",
          "data": {
              "action": "addMetadataProfile"
          },
        }
    }, {
        "views": ["metadataShow"],
        "actions": [{
          "service": "metadata",
          "action": "add",
          "view": "metadataShow"
        }],
        "start": {
          "view": "metadataShow",
          "data": {
              "action": "addMetadata"
          }
        }
    }, {
        "views": ["metadataShow"],
        "actions": [{
          "service": "metadata",
          "action": "update",
          "view": "metadataShow"
        }],
        "start": {
          "view": "metadataShow",
          "data": {
              "action": "updateMetadata"
          }
        }
    }, {
        "views": ["KalturaMetadataListResponse", "metadataShow", "metadataDeleted"],
        "actions": [{
          "service": "metadata",
          "action": "listAction",
          "view": "KalturaMetadataListResponse"
        }, {
          "service": "metadata",
          "action": "deleteAction",
          "view": "metadataDeleted"
        }],
        "start": {
          "view": "KalturaMetadataListResponse",
          "data": {
              "action": "listMetadata"
          }
        }
    }, {
        "views": ["KalturaMetadataProfileListResponse", "metadataProfileShow", "metadataProfileDeleted"],
        "actions": [{
          "service": "metadataProfile",
          "action": "listAction",
          "view": "KalturaMetadataProfileListResponse"
        }, {
          "service": "metadataProfile",
          "action": "deleteAction",
          "view": "metadataProfileDeleted"
        }],
        "start": {
          "view": "KalturaMetadataProfileListResponse",
          "data": {
              "action": "listMetadataProfile"
          }
        }
    }],
}
