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
    currentPage: 1,
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
    this.setData({
      currentPage: 1
    })
    this.refreshTopic(1)
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
    this.setData({
      currentPage: 1
    })
    this.refreshTopic(1)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.setData({
      currentPage: this.data.currentPage + 1
    })
    this.refreshTopic(this.data.currentPage)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  // 刷新页面帖子数据
  refreshTopic: function(pageID) {
    var that = this
    if(this.data.currentPage < 0){
      return
    }
    backend.requestTopicTagByPage({
      tagID: this.data.tagID, 
      pageID: pageID,
      requestTopicTagByPageCallBack: function(res){
        if(!res) {
          // 帖子数据加载到底
          that.setData({
            currentPage: -1
          })
          return
        }
        if(pageID==1){
          that.setData({
            topicInfo: res
          })
        } else {
          var tmp = that.data.topicInfo.concat(
            res
          )
          that.setData({
            topicInfo: tmp
          })
        }
        console.log("requestTopicTagByPage success, pageid:", pageID)
      }
    })
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