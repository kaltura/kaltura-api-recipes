window.checkResponse = function(data, status, xhr) {
  var msg = {type: 'success', message: "Success"};
  if (data === null) return msg;
  if (data instanceof Document) {
    var err = $(data).find('error').length;
    if (err) msg = {type: 'danger', message: $(data).find('error message').text()};
  } else if (typeof data === 'object') {
    var err = data.code && data.message;
    if (err) msg = {type: 'danger', message: data.code + ': ' + data.message};
  }
  if (msg.message.indexOf('SERVICE_FORBIDDEN') !== -1) {
    $('#KalturaLogin').modal('show');
  }
  return msg;
}
