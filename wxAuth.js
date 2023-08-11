
const crypto = require('crypto');
const APPID = `wxa4420aae897ee1b3`;

//档案馆appid
const APPID1=`wx80ad4f9045e63ddf`;

//档案馆appscret
const APPSECRET1=`42775b76483608811f8f09f71488f3d2`;

const APPSECRET = `d7150df45059d3687b26865b702991aa`;

class wx {

    static accessToken = null;
    static jsapiTicket = null;
    static url=`https://prod-3g8h83m1a0675dc6-1318474116.tcloudbaseapp.com/main/index.html`;

    static getAccessToken() {
        return new Promise((resolve, reject) => {
            if (this.accessToken) return resolve(this.accessToken);
            const fetchUrl = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${APPID1}&secret=${APPSECRET1}`;
            console.log(fetchUrl);
            fetch(fetchUrl).then(response => {return response.json()}).then(response => {
                let data = response;
                if (data.access_token) {
                    this.accessToken = data.access_token;
                    let t = data.expires_in;
                    setTimeout(() => {
                        this.accessToken = null;
                    }, (t - 100) * 1000);
                    resolve(this.accessToken);
                } else {
                    console.log(data);
                    //reject(data);
                }
            }).catch(err => {
                console.log(err);
                //reject(err);
            });
        })


    };

    static getJSApi() {
        return new Promise(async (resolve, reject) => {
            if (!this.accessToken) {
                this.accessToken=await this.getAccessToken();
            }
            const fetchUrl = `https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=${this.accessToken}&type=jsapi`;
            fetch(fetchUrl).then(response=>response.json()).then(response => {
                let data = response;
                if (data.ticket) {
                    this.jsapiTicket = data.ticket;
                    let t = data.expires_in;
                    setTimeout(() => {
                        this.jsapiTicket = null;
                    }, (t - 100) * 1000);
                    resolve(this.jsapiTicket);
                }else{
                    console.log(data);
                    //reject(data);
                }
            }).catch(err => { 
                console.log(err);
                //reject(err);
            });
        });

    }

    static async getSign(url){
        if(!url){
            url=wx.url;
        }
        /**
         * 签名算法
         * 签名生成规则如下：
         * 参与签名的字段包括noncestr（ 随机字符串）,
         * 有效的jsapi_ticket, timestamp（ 时间戳）,
         * url（ 当前网页的URL， 不包含# 及其后面部分）。
         * 对所有待签名参数按照字段名的ASCII 码从小到大排序（ 字典序） 后，
         *  使用URL键值对的格式（ 即key1 = value1 & key2 = value2…） 拼接成字符串string1。
         * 这里需要注意的是所有参数名均为小写字符。 对string1作sha1加密， 字段名和字段值都采用原始值， 不进行URL 转义。
         */
        if(!wx.jsapiTicket){
            try{
                wx.jsapiTicket=await wx.getJSApi();
            }catch(err){
                console.log(err);
                return {
                    err:"获取jsapi_ticket失败"
                }
            }
        }
        var ret = {
          jsapi_ticket: wx.jsapiTicket,
          //jsapi_ticket:`O3SMpm8bG7kJnF36aXbe8-BnLIxuw25tWAwPiHJwPuqWOiSkRauP91vmRkDvbvhQIoCy2tZWrjNuzPGz_zXelg`,
          nonceStr: createNonceStr(),
          timestamp: createTimestamp(),
          url: url
        };
        console.log(ret);
        var string = raw(ret)
        ret.signature = sha1(string)
        ret.appId = APPID1;
        console.log('ret', ret)
        
        return ret;
    }


}

/**
 * 获取签名
 * @returns:
 * 1. appId 必填，公众号的唯一标识
 * 2. timestamp 必填，生成签名的时间戳
 * 3. nonceStr 必填，生成签名的随机串
 * 4. signature 必填，签名
 */


// sha1加密
function sha1(str) {
  let shasum = crypto.createHash("sha1")
  shasum.update(str)
  str = shasum.digest("hex")
  return str;
}

/**
 * 生成签名的时间戳
 * @return {字符串}
 */
function createTimestamp() {
  return parseInt(new Date().getTime() / 1000) + ''
}

/**
 * 生成签名的随机串
 * @return {字符串}
 */
function createNonceStr() {
  return Math.random().toString(36).substr(2, 15)
}

/**
 * 对参数对象进行字典排序
 * @param  {对象} args 签名所需参数对象
 * @return {字符串}    排序后生成字符串
 */
function raw(args) {
  var keys = Object.keys(args)
  keys = keys.sort()
  var newArgs = {}
  keys.forEach(function (key) {
    newArgs[key.toLowerCase()] = args[key]
  })

  var string = ''
  for (var k in newArgs) {
    string += '&' + k + '=' + newArgs[k]
  }
  string = string.substr(1)
  return string
}



module.exports = wx;