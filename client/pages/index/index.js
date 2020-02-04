// pages/index/index.js
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },


  loadtopic:function(events){
    console.log("click icon", events);
    wx.navigateTo({
      url: "./topic/topic",
      events: {
        // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
        // acceptDataFromOpenedPage: function(data) {
        //   console.log(data)
        // },
      },
      success: function(res) {
        console.log("click icon success")
        var tagID = 0
        if(events.currentTarget.id == "car"){
          tagID = 2
        } else if (events.currentTarget.id == "buy") {
          tagID = 1
        }
        res.eventChannel.emit('acceptDataFromOpenerPage', 
        { 
          tagID: tagID
        })
      },
      fail: function(res) {
        console.log("click icon fail")
      }
    })
  },

  loaddev:function(){
    console.log("click icon");
    wx.navigateTo({
      url: "./dev/dev",
      success: function(res) {
        console.log("click icon success")
      },
      fail: function(res) {
        console.log("click icon fail")
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var time = util.formatTime(new Date());
    var time2 = util.formatTime2(new Date());
    this.setData({
      time: time,
      time2: time2,
    });
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

  }
})