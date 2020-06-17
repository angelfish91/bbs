var config = {
  // bbsUrl: "http://127.0.0.1:8082/api/",
  bbsUrl: "http://sparrowsong.xyz:8082/api/",
  defaultEmail: "xxx@xxx.com",
  defaultPassword: "123456",
}

var topicID2str = {
  1: "拼车",
  2: "二手",
}

var str2TopicID = {
  "拼车": 1,
  "二手": 2,
}

function makeRandomID(length) {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
     result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

function userIdentity({jscode, userIdentityCallback}) {
  wx.request({
    url: config.bbsUrl + "admin/user/identity",
    method: "GET",
    header: {
      'content-type': 'application/x-www-form-urlencoded' // 默认值
    },
    data: {
      "jscode": jscode
    },
    success: res => {
      if(userIdentityCallback){
        userIdentityCallback(res)
      }
    },
    fail: res => {
      console.log("[ERROR] get user identity fail!")
    }
  })
}


function userCreate({username, email, password, nickname, avatar, succCallBack, failCallBack}){
  console.log("username", username)
  wx.request({
    url: config.bbsUrl + "admin/user/create",
    method: "POST",
    header: {
      'content-type': 'application/x-www-form-urlencoded' // 默认值
    },
    data: {
      username: username,
      email: email,
      password: password,
      nickname: nickname,
      avatar: avatar,
    },
    success: res => {
       if(res.data.success == true){
         console.log("[DEBUG] create a user success!")
         succCallBack()
       } else {
         console.log("[DEBUG] create a user fail!", res)
         failCallBack()
       }
    }
  })
}

function userCreateDefault({openid, nickname, avatar, succCallBack, failCallBack}){
  userCreate({
    username: openid,
    email: makeRandomID(16) + config.defaultEmail,
    password: config.defaultPassword,
    nickname: nickname,
    avatar, avatar,
    succCallBack: succCallBack,
    failCallBack: failCallBack,
  })
}

function userSignIn({openid, password, succCallBack, failCallBack}){
  wx.request({
    url: config.bbsUrl + "login/signin",
    method: "POST",
    header: {
      'content-type': 'application/x-www-form-urlencoded' // 默认值
    },
    data: {
      "username": openid,
      "password": password,
    },
    success: res => {
      if(res.data.success==true){
        var userToken = res.data.data.token
        succCallBack(userToken)
      } else {
        failCallBack()
      }
    }
  })
}

function AutoSignIn({openid, nickname, avatar, succCallBack}){
  userSignIn({
    openid: openid,
    password: config.defaultPassword,
    succCallBack: succCallBack,
    failCallBack: function(){
      userCreateDefault({
        openid: openid,
        nickname: nickname,
        avatar: avatar,
        succCallBack: function(){
          userSignIn({
            openid: openid,
            password: config.defaultPassword,
            succCallBack: succCallBack,
          })
        }
      })
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
  userIdentity: userIdentity,
  AutoSignIn: AutoSignIn,
  requestTopicTagByPage: requestTopicTagByPage,
  postTopic: postTopic,
}