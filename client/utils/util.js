const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  // return [year, month, day].map(formatNumber).join('.') + ' ' + [hour, minute, second].map(formatNumber).join(':')
  return year + "年" + month + "月" + day + "日" 
}

const formatTime2 = date2 => {
  var a = new Array("日", "一", "二", "三", "四", "五", "六");  
  var week = new Date().getDay();  
  var str = "星期"+ a[week];        
  return str
} 

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}


const showSuccess = str => {
  str = str.toString()
  if(str.length == 0){
    str = '成功'
  }
  wx.showToast({
    title: str,
    icon: 'success',
    duration: 2000
  })
}

const showFail = str => {
  str = str.toString()
  if(str.length == 0){
    str = '失败'
  }
  wx.showToast({
    title: str,
    icon: 'none',
    duration: 2000
  })
}


module.exports = {
  formatTime: formatTime,
  formatTime2: formatTime2,
  showFail: showFail,
  showSuccess: showSuccess
}

