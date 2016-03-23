window.checkResponse = function(data, status, xhr) {
  var msg = {type: 'success', message: "Success"};
  if (data === null) return msg;
  if (data instanceof Document) {
    var $data = $(data);
    if ($data.find('error').length) {
      var code = $data.find('code').text();
      var message = $data.find('error message').text();
      msg = {type: 'danger', message: code + ': ' + message};
    }
  } else if (typeof data === 'object') {
    var err = data.code && data.message;
    if (err) msg = {type: 'danger', message: data.code + ': ' + data.message};
  }
  if (msg.message.indexOf('SERVICE_FORBIDDEN') !== -1) {
    $('#KalturaLogin').modal('show');
  }
  return msg;
}
