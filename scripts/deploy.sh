#!/bin/sh
export DEVELOPMENT=
export ENABLE_EDITS=true

git pull && npm install
forever restart `pwd`/server.js || forever start `pwd`/server.js
