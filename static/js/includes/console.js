window.checkResponse = function(data, status, xhr) {
  if (data === null) return {type: 'success', message: "Success"};
  if (data instanceof Document) {
    var err = $(data).find('error').length;
    if (err) return {type: 'danger', message: $(data).find('error message').text()};
  } else if (typeof data === 'object') {
    var err = data.code && data.message;
    if (err) return {type: 'danger', message: data.code + ': ' + data.message};
  }
  return {type: 'success', message: 'Success'}
}
