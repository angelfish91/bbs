var config = {
  bbsUrl: "http://127.0.0.1:8082/api/"
  // bbsUrl: "http://sparrow.com/api/"
}

function userSignin(userInfo){
  wx.request({
    url: config.bbsUrl + "login/signin"
  })
}

function userCreate(userInfo){
  wx.request({
    url: config.bbsUrl + "user/create"
  })
}

module.exports = {
  config: config,
}