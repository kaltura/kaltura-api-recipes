module.exports = {
  "name": "video_search",
  "title": "Video Search",
  "icon": "search",
  "description": "Learn how to search through your video library using Kaltura's API",
  "related_recipes": ["captions", "metadata"],
  "recipe_steps": [
    {
      "inputs": [
        {
          "default": "",
          "type": "text",
          "label": "Query",
          "name": "freeText"
        },
       {
        "type": "datetime",
        "name": "createdAtGreaterThanOrEqual",
        "label": "From Date"
       },
        {
          "name": "advancedSearch",
          "hidden": true,
          "default": "KalturaMetadataSearchItem"
        },
        {
          "name": "orderBy",
          "type": "select-chosen",
          "label": "Order By",
          "default": "-createdAt",
          "choices": [
            {"label": "CREATED_AT_ASC", "value": "+createdAt"},
            {"label": "DURATION_ASC", "value": "+duration"},
            {"label": "LAST_PLAYED_AT_ASC", "value": "+lastPlayedAt"},
            {"label": "NAME_ASC", "value": "+name"},
            {"label": "PLAYS_ASC", "value": "+plays"},
            {"label": "RECENT_ASC", "value": "+recent"},
            {"label": "START_DATE_ASC", "value": "+startDate"},
            {"label": "UPDATED_AT_ASC", "value": "+updatedAt"},
            {"label": "VIEWS_ASC", "value": "+views"},
            {"label": "CREATED_AT_DESC", "value": "-createdAt"},
            {"label": "DURATION_DESC", "value": "-duration"},
            {"label": "LAST_PLAYED_AT_DESC", "value": "-lastPlayedAt"},
            {"label": "NAME_DESC", "value": "-name"},
            {"label": "PLAYS_DESC", "value": "-plays"},
            {"label": "RECENT_DESC", "value": "-recent"},
            {"label": "START_DATE_DESC", "value": "-startDate"},
            {"label": "UPDATED_AT_DESC", "value": "-updatedAt"},
            {"label": "VIEWS_DESC", "value": "-views"}
          ]
        }
      ],
	"arguments": [{
	    "class": "KalturaMediaEntryFilter",
	    "parameters": {
		"createdAtGreaterThanOrEqual": {"answer": "createdAtGreaterThanOrEqual"}
	    }    
	}],   
      "code_snippet": "listMedia",
      "tip": "This is how to retrieve an array of all your videos. Use Media Entry Filters to select which content you want to show.",
      "title": "Filtering Results"
    },
    {
      "inputs": [
        {
          "dynamic_choices": {
            "service": "uiConf",
            "action": "list",
            "arguments": [{
              "class": "KalturaUiConfFilter",
              "parameters": {
                "orderBy": "-updatedAt",
                "objTypeEqual": {"enum": "KalturaUiConfObjType", "value": "PLAYER"}
              }
            }],
            "map": {
              "value": "id",
              "label": "name"
            }
          },
          "type": "select-chosen",
          "label": "UI Configuration ID",
          "name": "uiConf",
          "required": true
        }
      ],
      "code_snippet": "KalturaMediaEntry",
      "tip": "Here's how to embed the results in HTML. You can select a skin by setting uiconf_id.",
      "title": "Video Player"
    }
  ],
  "pages": [
    {
      "view": "KalturaMediaListResponse",
      "data": {
        "action": "listMedia"
      }
    }
  ],
  "views": [
    "KalturaMediaListResponse",
    "KalturaMediaEntry"
  ],
  "actions": [
    {"service": "media", "action": "listAction", "view": "KalturaMediaListResponse"}
  ]
}


