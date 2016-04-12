export KALTURA_RECIPES_PORT=3005
export DEVELOPMENT=
export ENABLE_EDITS=true

git pull && npm install && forever restart `pwd`/server.js 
