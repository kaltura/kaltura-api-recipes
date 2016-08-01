#!/bin/sh
git pull && npm install && bower install
cd node_modules/lucy-api-portal && bower install && cd ..
