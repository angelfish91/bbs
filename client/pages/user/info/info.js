// pages/user/info/info.js
const app = getApp()
var util = require('../../../utils/util.js');
var login = require('../../../utils/login.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    debug: true,
    userInfo : null,
    userToken: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        userToken: app.globalData.userToken,
      })
      if(app.globalData.debug){
        util.showSuccess("信息获取成功")
      }
    } else {
      util.showFail("信息获取失败")
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    login.loginBBS()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})