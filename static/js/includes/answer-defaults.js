var getAnswerDefaults = function() {
  var defaults = {};
  var today = new Date();
  var lastMonth = new Date(today.getTime() - MS_IN_MONTH);
  var getDayStr = function(d) {
    var year = d.getFullYear().toString();
    var month = (d.getMonth() + 1).toString();
    if (month.length < 2) month = '0' + month;
    var day = d.getDate().toString();
    if (day.length < 2) day = '0' + day;
    return year + month + day;
  }
  defaults.toDay = getDayStr(today);
  defaults.fromDay = getDayStr(lastMonth);
  return defaults;
}
