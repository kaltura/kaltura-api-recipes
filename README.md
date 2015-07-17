# LucyBot recipes for the Kaltura API

## Overview

This repository contains tutorials - known as recipes - for working with Kaltura's API. The repository is structured as follows:
```recipes/``` - a set of JSON objects, each corresponding to a single tutorial.
```code_templates/``` - Kaltura-specific templates which are passed to the LucyBot code builders.
```code_templates/views/``` - HTML templates for displaying the results of the API. Views starting with ```Kaltura``` correspond to specific objects in Kaltura's API schema; e.g. ```KalturaMediaEntry.html``` is the HTML for displaying a [KalturaMediaEntry](http://www.kaltura.com/api_v3/testmeDoc/index.php?object=KalturaMediaEntry). Note that files under ```code_templates/views/html/``` are used by default, but can be overriden for a specific language by placing a view with the same filename under ```code_templates/views/language_name``` (e.g. to use the jquery-fileupload library when working in javascript).
```code_templates/actions/``` - Templates for making calls to the API in different languages. There is a subdirectory for each language.
```code_templates/generic_actions/``` - There is one template in here for each supported language. These templates are special in that they don't produce working code; rather, they produce the templates that would normally be found in ```code_templates/actions/```. These templates use Kaltura's API Schema to automatically generate action templates.
