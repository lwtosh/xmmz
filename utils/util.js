// const formatTime = date => {
//   const year = date.getFullYear()
//   const month = date.getMonth() + 1
//   const day = date.getDate()
//   const hour = date.getHours()
//   const minute = date.getMinutes()
//   const second = date.getSeconds()

//   return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
// }

// const formatNumber = n => {
//   n = n.toString()
//   return n[1] ? n : '0' + n
// }

// module.exports = {
//   formatTime: formatTime
// }
// //数据转化
function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

// /**
//  * 时间戳转化为年 月 日 时 分 秒
//  * number: 传入时间戳
//  * format：返回格式，支持自定义，但参数必须与formateArr里保持一致
// */
function formatTime(number, format) {

  var formateArr = ['Y', 'M', 'D', 'h', 'm', 's'];
  var returnArr = [];
  var date = new Date(number);
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var day = date.getDate();
  var hour = date.getHours();
  var minute = date.getMinutes();
  var second = date.getSeconds();
  var timeSpanStr = formatNumber(year) + '-' + formatNumber(month) + '-' + formatNumber(day) + ' ' + formatNumber(hour) + ':' + formatNumber(minute) + ':' + formatNumber(second);
  return format = timeSpanStr;
}

module.exports = {
  formatTime: formatTime
}