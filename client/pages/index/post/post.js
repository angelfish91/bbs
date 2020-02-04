// pages/index/post/post.js
var util = require("../../../utils/util.js")
var backend = require("../../../utils/backend.js")

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tagID : 1,
    title : "",
    content: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    const eventChannel = this.getOpenerEventChannel()
    // 1. 子页面传送数据去父页面
    // eventChannel.emit('acceptDataFromOpenedPage', {data: 'test'});
    // 2. 父页面传送数据来子页面
    eventChannel.on('eventFromTopicToPost', function(sendData) {
      that.setData({tagID: sendData.tagID})
    })
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

  },

  bindTitleInput: function (e) {
    this.setData({
      title: e.detail.value
    })
  },

  bindContentInput: function (e) {
    this.setData({
      content: e.detail.value
    })
  },

  confirmPost: function() {
    var userToken = app.globalData.userToken
    if(!userToken){
      util.showFail("请先登陆")
      return
    }
    if(this.data.title.length==0){
      util.showFail("请输入标题")
      return
    }
    if(this.data.content.length==0){
      util.showFail("请输入正文")
      return
    }
    backend.postTopic({
      userToken: userToken,
      tagID: this.data.tagID,
      title: this.data.title,
      content: this.data.content,
      postTopicCallBack: function(res){
        console.log("postTopic success", res)
        wx.navigateBack()
      }
    })
  }
})