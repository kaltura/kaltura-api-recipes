require 'kaltura'
include Kaltura

config = KalturaConfiguration.new()
config.service_url = <%- Lucy.code.variable('answers.serviceURL') %>
@@client = KalturaClient.new(config);
@@client.ks = @@client.session_service.start(
    <%- Lucy.variable("answers.secret") %>,
    <%- Lucy.variable("answers.userId") %>,
    <%- Lucy.answer('sessionType') === 0 ? 'KalturaSessionType::USER' : 'KalturaSessionType::ADMIN' %>,
    <%- Lucy.variable('answers.partnerId') %>)
$sessionID = @@client.ks
