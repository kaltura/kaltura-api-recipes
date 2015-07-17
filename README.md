# LucyBot recipes for the Kaltura API

## Overview

This repository contains tutorials - known as recipes - for working with Kaltura's API. The repository is structured as follows:
* ```recipes/``` - a set of JSON objects, each corresponding to a single tutorial.
* ```code_templates/``` - Kaltura-specific templates which are passed to the LucyBot code builders.
* ```code_templates/views/``` - HTML templates for displaying the results of the API. Views starting with ```Kaltura``` correspond to specific objects in Kaltura's API schema; e.g. ```KalturaMediaEntry.html``` is the HTML for displaying a [KalturaMediaEntry](http://www.kaltura.com/api_v3/testmeDoc/index.php?object=KalturaMediaEntry). Note that files under ```code_templates/views/html/``` are used by default, but can be overriden for a specific language by placing a view with the same filename under ```code_templates/views/language_name``` (e.g. to use the jquery-fileupload library when working in javascript).
* ```code_templates/actions/``` - Templates for making calls to the API in different languages. There is a subdirectory for each language.
* ```code_templates/generic_actions/``` - There is one template in here for each supported language. These templates are special in that they don't produce working code; rather, they produce the templates that would normally be found in ```code_templates/actions/```. These templates use Kaltura's API Schema to automatically generate action templates.

Other directories control the webserver:
* ```routes/``` contains a set of Express routers, which control what paths are served by the webserver
* ```views/``` is a set of Jade templates for displaying recipes to the user
* ```static/``` contains CSS, JavaScript, and images, and are served without processing
* ```less/``` contains LESS files for generating CSS
* ```scripts/``` contains helpful scripts for doing things like compiling LESS to CSS
* ```test/``` contains the test files, along with golden files for tracking changes to the generated code.
 
Finally, the LucyBot code buildier libraries are contained in the Git Submodule ```lucy-langs```. To update to the latest version, simply enter the directory and run ```git pull```.

## Adding a New Recipe

Recipes are controlled by the JSON files under ```recipes/```. To add a new recipe, simply create a new JSON file in that directory. JSON is structured as follows:

```json
{
  "name": "the name of this file",
  "title": "the title of the recipe",
  "icon": "the name of a fontawesome icon",
  "description": "A short description of the recipe",
  
  // control_sets is an array of steps for the recipe, structured as below
  "control_sets": [
    {
      "title": "A title for this step"
      "tip": "The body of text for this recipe. Markdown is supported here so you can [create links](www.google.com) or call out ```snippetsOf.code()```",
      "affects": "The name of a view or action pertinent to this step. This controls what snippet of sample code is displayed to the user",
      // inputs is an array of HTML inputs to display to the user. Fields entered here can be used in your recipes or embedded in the sample code
      "inputs": [
        {
          "name": "The programmatic name of the input. Should match propery names in Kaltura's API schema where applicable"
          "default": "The default value to use (optional)",
          "type": "text|number|radio|select|select-chosen",
          "label": "A human-readable label for the input",
        }
      ],
      
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
```
