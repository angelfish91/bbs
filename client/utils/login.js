var app = getApp()
var backend = require("backend.js")


// bbs进行登陆
function loginBBS() {
  if(!app.globalData.userToken){
    backend.AutoSignIn({
      openid : app.globalData.openid,
      nickname: app.globalData.userInfo.nickName,
      avatar: app.globalData.userInfo.avatarUrl,
      succCallBack: userToken => {
        app.globalData.userToken = userToken
        console.log("[DEBUG] login userToken\t", userToken)
        // if(app.globalData.userToken){
        //   util.showSuccess("登陆Token成功")
        // } else {
        //   util.showFail("登陆Token失败")
        // }
      }
    })
  }
}

module.exports = {
  loginBBS: loginBBS,
}