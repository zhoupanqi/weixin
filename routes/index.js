var express = require('express');
var request = require('request');
var fs = require('fs');
var wxShare = require('../wxapi/wxShare');

// var accessTokenjson = require('../accessTokenjson.json');
var router = express.Router();
/* GET home page. */
var urls = encodeURIComponent('http://zpqsix.cn/');
var wxurls = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxd63fb9c30a5923ee&redirect_uri=' + urls + '&response_type=code&scope=snsapi_userinfo#wechat_redirect';
// console.log(wxurls);
router.get('/', function (req, res, next) {
  // console.log('query====',req.query);
  if(!req.query.code){
    res.redirect(wxurls);
    return;
  }
  var currentTime = new Date().getTime();
  console.log('code----', req.query.code);
  var tokenurl = 'https://api.weixin.qq.com/sns/oauth2/access_token?appid=wxd63fb9c30a5923ee&secret=6a7454c6e7df1948daf90b046469f570&code=' + req.query.code + '&grant_type=authorization_code';
  console.log('bbbbb');
  // console.log(accessTokenjson);
  // console.log('时间', currentTime);
  request(tokenurl, function (error, response, body) {
    var bodys = JSON.parse(body);
    console.log('tokenurl----', body);
    var userifourl = 'https://api.weixin.qq.com/sns/userinfo?access_token=' + bodys.access_token + '&openid=' + bodys.openid + '&lang=zh_CN';
    console.log('用户信息：', userifourl);
    request(userifourl, function (error, response, body) {
      var userinfo = JSON.parse(body);
      console.log('body:', userinfo); // Print the HTML for the Google homepage.
      console.log(userinfo.headimgurl);
      res.render('index', { nickname: userinfo.nickname });
    })
    // if (accessTokenjson.access_token === '' || accessTokenjson.expires_time < currentTime) {
    //   console.log('aaaaa');
    //   accessTokenjson.access_token = bodys.access_token;
    //   accessTokenjson.expires_time = new Date().getTime() + (parseInt(bodys.expires_in) - 200) * 1000;
    //   //更新本地存储
    //   fs.writeFile('../accessTokenjson.json', JSON.stringify(accessTokenjson), function (err) {
    //     if (err) {
    //       console.log(err)
    //     }
    //     console.log("save assess_token success")
    //   });
    //   var userifourl = 'https://api.weixin.qq.com/sns/userinfo?access_token=' + bodys.access_token + '&openid=' + bodys.openid + '&lang=zh_CN';
    //   console.log('用户信息：', userifourl);
    //   request(userifourl, function (error, response, body) {
    //     var userinfo = JSON.parse(body);
    //     console.log('body:', userinfo); // Print the HTML for the Google homepage.
    //     console.log(userinfo.headimgurl);
    //     res.render('index', { nickname: userinfo.nickname });
    //   })
    // }
    // else {
    //   console.log('cccccc');
    //   var userifourl = 'https://api.weixin.qq.com/sns/userinfo?access_token=' + accessTokenjson.access_token + '&openid=' + bodys.openid + '&lang=zh_CN';
    //   console.log('用户信息：', userifourl);
    //   request(userifourl, function (error, response, body) {
    //     var userinfo = JSON.parse(body);
    //     console.log('body:', userinfo); // Print the HTML for the Google homepage.
    //     console.log(userinfo.headimgurl);
    //     res.render('index', { nickname: userinfo.nickname });
    //   })
    // }
  })

});
router.post('/activityWxShaer', function (req, res, next) {
  var hrefURL = req.body.urlhref;
  wxShare.prototype.accessToken(hrefURL, function (data) {
    res.json(data);
  })
  
})
module.exports = router;
