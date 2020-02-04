var config = {
  bbsUrl: "http://127.0.0.1:8082/api/"
  // bbsUrl: "http://sparrow.com/api/"
}

var topicID2str = {
  1: "二手",
  2: "拼车",
}

var str2TopicID = {
  "二手": 1,
  "拼车": 2,
}

function userCreate(userInfo){
  wx.request({
    url: config.bbsUrl + "user/create"
  })
}

function userSignIn({userSignInCallBack}){
  wx.request({
    url: config.bbsUrl + "login/signin",
    method: "POST",
    header: {
      'content-type': 'application/x-www-form-urlencoded' // 默认值
    },
    data: {
      "username": "sparrow3",
      "password": "123123",
      "ref": "ref"
    },
    success: res => {
      var userToken = res.data.data.token
      if(userSignInCallBack){
        userSignInCallBack(userToken)
      }
    },
    fail: res=> {
      console.log("userSignin fail", res)
    }
  })
}


function requestTopicTagByPage ({tagID, pageID, requestTopicTagByPageCallBack}) {
  wx.request({
    url: config.bbsUrl + "admin/topic/lists",
    method: "GET",
    header: {
      'content-type': 'application/x-www-form-urlencoded' // 默认值
    },
    data: {
      "tagid": tagID,
      "page": pageID,
    },
    success: res => {
      if(res.statusCode == 200){
        if(requestTopicTagByPageCallBack){
          requestTopicTagByPageCallBack(res.data.data.results)
        }
      } else {
        console.log("requestTopicTagByPage success but statusCode == ", res.statusCode)
      }
    },
    fail: res=> {
      console.log("requestTopicTagByPage fail", res)
    }
  })
}

function postTopic ({tagID, userToken, title, content, postTopicCallBack}) {
  wx.request({
    url: config.bbsUrl + "topic/create",
    method: "POST",
    header: {
      'content-type': 'application/x-www-form-urlencoded' // 默认值
    },
    data: {
      "userToken": userToken,
      "tags": topicID2str[tagID],
      "title": title,
      "content": content,
    },
    success: res => {
      if(res.statusCode == 200){
        if(postTopicCallBack){
          postTopicCallBack(res)
        }
      } else {
        console.log("postTopicCallBack success but statusCode == ", res.statusCode)
      }
    },
    fail: res=> {
      console.log("postTopicCallBack fail", res)
    }
  })
}

module.exports = {
  config: config,
  userSignIn: userSignIn,
  requestTopicTagByPage: requestTopicTagByPage,
  postTopic: postTopic,
}