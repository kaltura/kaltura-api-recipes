uiconf = KalturaUiConf.new();
uiconf.config=params[:config];
id = <%- Lucy.code.variable('answers.id') %>;
result = @@client.ui_conf_service.update(id,uiconf);
<%- Lucy.returnCode('result') %>
