var config = {
  bbsUrl: "http://127.0.0.1:8082/api/"
  // bbsUrl: "http://sparrow.com/api/"
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

module.exports = {
  config: config,
  userSignIn: userSignIn,
  requestTopicTagByPage: requestTopicTagByPage,
}