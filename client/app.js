//app.js
var util = require("./utils/util.js")
var backend = require("./utils/backend.js")

App({
  globalData: {
    debug : true,
    userCode: null,
    userInfo: null,
    userToken: null, // 后台token
  },
  onLaunch: function () {
    var that = this
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        this.globalData.userCode = res.code
        if(this.globalData.debug){
          console.log("app.js userCode\t", this.globalData.userCode)
        }
        that.getSetting()
      },
      fail: res => {
        util.showFail("微信登陆失败")
      }
    })
  },

  getSetting: function() {
    var that = this
    // 获取用户授权信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          that.getUserInfo()
        } else {
          util.showFail("用户信息未授权")
        }
      }
    })
  },

  getUserInfo: function() {
    var that = this
    wx.getUserInfo({
      withCredentials: true,
      lang:"zh_CN",
      success: res => {
        // 可以将 res 发送给后台解码出 unionId
        this.globalData.userInfo = res.userInfo
        if(this.globalData.debug){
          console.log("app.js userInfo\t", this.globalData.userInfo)
        }
        
        // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
        // 所以此处加入 callback 以防止这种情况
        if (this.userInfoReadyCallback) {
          this.userInfoReadyCallback(res)
        }
        // bbs进行登陆
        backend.userSignIn({
          userSignInCallBack: userToken => {
            that.globalData.userToken = userToken
            console.log("app.js userToken\t", this.globalData.userToken)
          }
        })
      }
    })
  },
})