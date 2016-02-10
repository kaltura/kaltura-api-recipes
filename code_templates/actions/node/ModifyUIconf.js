var id = <%- Lucy.code.variable('answers.id') %>;
var uiConf = new KalturaUiConf();
uiConf.config=req.body.config;
client.uiConf.update(function(result) {
<%- Lucy.returnCode('result') %>
}, id, uiConf);
