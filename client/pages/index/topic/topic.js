// pages/topic/topic.js
var util = require("../../../utils/util.js")
var backend = require("../../../utils/backend.js")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tagID: 1,
    topicInfo: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    const eventChannel = this.getOpenerEventChannel()
    eventChannel.on('eventFromIndexToTopic', function(sendData) {
      that.setData({tagID: sendData.tagID})
    })
    // 请求页面帖子数据
    backend.requestTopicTagByPage({
      tagID: this.data.tagID, 
      pageID: 1,
      requestTopicTagByPageCallBack: function(res){
        that.setData({
          topicInfo: res
        })
        console.log("requestTopicTagByPage success", that.data.topicInfo)
      }
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

  onPostClick:function(){
    var that = this
    wx.navigateTo({
      url: "../post/post",
      success: function(res) {
        res.eventChannel.emit('eventFromTopicToPost', 
        { 
          tagID: that.data.tagID
        })
      },
      fail: function(res) {
        console.log("click icon post fail")
      }
    })
  },
})