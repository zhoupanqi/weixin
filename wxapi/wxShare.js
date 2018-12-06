var url = require('url');
var request = require('request');
var sha1 = require('sha1');

var config = {
    appID: 'wxd63fb9c30a5923ee',
    appSecret: '6a7454c6e7df1948daf90b046469f570'
},
configEnd = {
    appID: '',
    access_token: '',
    ticket: '',
    timestamp: '', // 必填，生成签名的时间戳
    nonceStr: '', // 必填，生成签名的随机串
    signature: '', // 必填，签名，见附录1
};

class wxShare {
    /**
     * 请求获取access_token 方法入口
     * @param {* URL链接} hrefURL 
     * @param {* 回调请求方法} callback 
     */
    accessToken(hrefURL, callback) { // 获取access_token
        let _this = this;
        var tokenUrl = 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=' + config.appID + '&secret=' + config.appSecret;
        request(tokenUrl, function (error, response, body) {
            if (response.statusCode && response.statusCode === 200) {
                body = JSON.parse(body);
               
                configEnd.access_token = body.access_token;
                _this.upJsapiTicket(hrefURL, body.access_token, callback)
            }
        });
    };
    /**
     * 获取Jsapi_Ticket
     * @param {* URL链接} hrefURL 
     * @param {* token} access_Ttoken 
     * @param {* 回调请求方法} callback 
     */
    upJsapiTicket(hrefURL, access_Ttoken, callback) { // Jsapi_ticket
        let _this = this;
        var ticketUrl = 'https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=' + access_Ttoken + '&type=jsapi';
        request(ticketUrl, function (err, response, content) {
            content = JSON.parse(content);
            if (content.errcode == 0) {
                configEnd.appID = config.appID;
                configEnd.ticket = content.ticket; // ticket
                configEnd.timestamp = _this.createTimestamp(); // 时间戳
                configEnd.nonceStr = _this.createNonceStr(); // 随机数
                configEnd.signature = _this.sign(hrefURL); // 签名
                callback && callback(configEnd); // 回调前端JS方法
            }
        })
    };
    /**
    * 请求获取access_token 方法入口
    * @param {* URL链接} hrefURL 
    * @param {* 回调请求方法} callback 
    */
    // userinfo(access_Ttoken,callback) {
    //     var userifourl = 'https://api.weixin.qq.com/sns/userinfo?access_token=' + configEnd.access_token + '&openid=' + bodys.openid + '&lang=zh_CN';
    //     request(userifourl, function (error, response, body) {
    //         var userinfo = JSON.parse(body);

    //     })
    // }
    /**
     * 随机字符串
     */
    createNonceStr() {
        return Math.random().toString(36).substr(2, 15);
    };
    /**
     * 时间戳
     */
    createTimestamp() {
        return parseInt(new Date().getTime() / 1000).toString();
    };
    /**
     * 拼接字符串
     * @param {*} args 
     */
    rawString(args) {
        var keys = Object.keys(args);
        keys = keys.sort()
        var newArgs = {};
        keys.forEach(function (key) {
            newArgs[key.toLowerCase()] = args[key];
        });
        var string = '';
        for (var k in newArgs) {
            string += '&' + k + '=' + newArgs[k];
        }
        string = string.substr(1);
        return string;
    };
    /**
     * 签名
     * @param {*} url 
     */
    sign(url) {
        let _this = this;
        var ret = {
            jsapi_ticket: configEnd.ticket,
            nonceStr: configEnd.nonceStr,
            timestamp: configEnd.timestamp,
            url: url
        };
        var string = _this.rawString(ret);
        var shaObjs = sha1(string);
        return shaObjs;
    };

}
module.exports = wxShare;