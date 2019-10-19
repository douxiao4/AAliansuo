var config = require('./config.js')
var tools = require('./tools.js')
var API = require('./API.js')
let {
  WeToast
} = require('./wetoast/wetoast.js')
var mta = require('./utils/mta_analysis.js')
var gio = require("./utils/gio-minp.js");

// version 是你的小程序的版本号
// gio('init', 'bb70d6eca4f0e32d', 'wx4a68a5b1b2d89fea', { version: '2.0',debug: 'true' });
//app.js
App({
  WeToast,
  onLaunch: function (option) {
    // 隐藏tabbar
    wx.hideTabBar();
    var that = this;
    mta.App.init(config.MTA);
    wx.request({
      url: 'https://sjz.ihotels.cc/ethank-sjz-web/rest/memberResource/v2.0/memberLevelInfo',
      data: {
        channel: 18,
        deviceType: '5',
        tagVersion: '5.0.0'
      },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function (res) {
        // console.log(res);
        var memberLevelInfo = res.data.retValue;
        that.globdata.memberLevelInfo = memberLevelInfo;
      },
    })

    // 登录
    // this.login();
    this.getAAid(option);

  },

  // 登陆
  // login() {
  //   let that = this;
  //   let session_key=that.globalData.session_key;
  //   let option = {
  //     session_key:session_key,
  //     success: function (result) {
  //       that.globalData.openId = result.data.openid;
  //       that.globalData.session_key = result.data.session_key;
  //       wx.setStorageSync('openId', result.data.openid);
  //     }
  //   }
  //   tools.loginWx(option);
  // },

  /**
   * 拆酒店id
   * 用于显示酒店详情页信息
   * @param {haveHid} false：vipIndex不显示酒店详情，true：显示
   * @param {AAid} AA酒店id
   * @param {AARid} AA酒店房间id 前台无AARid
   * @param {expire} haveId周期 默认1天 单位天
   * @param {haveHidTime} haveId 到期时间 13位时间戳
   */
  getAAid(option) {
    // console.log(option)
    let that = this;
    let haveHid = false;
    let AAid = null;
    let now = new Date().getTime();
    let AARid = null;
    if (option.query.q) {
      let link = decodeURIComponent(option.query.q);
      let parms = link.split('?')[1];
      parms = parms.split('&');
      for (let i = 0; i < parms.length; i++) {
        let key = parms[i].split('=')[0];
        if (key === 'AAid') {
          AAid = parms[i].split('=')[1];
        } else if (key === 'AARid') {
          AARid = parms[i].split('=')[1];
        }

        let expire = 1 * 24 * 60 * 60 * 1000;
        let loseTime = now + expire;
        wx.setStorageSync('loseTime', loseTime);
      }
      haveHid = true;
    } else if (wx.getStorageSync('haveHid') && wx.getStorageSync('AAid')) {
      haveHid = wx.getStorageSync('haveHid');
      AAid = wx.getStorageSync('AAid');
      AARid = wx.getStorageSync('AARid');
    }
    that.globalData.haveHid = haveHid;
    that.globalData.AAid = AAid;
    that.globalData.AARid = AARid;
    wx.setStorageSync('haveHid', haveHid);
    wx.setStorageSync('AAid', AAid);
    wx.setStorageSync('AARid', AARid);

    // 计算havehid
    this.setHaveHid(+now)

  },

  /**
   *  计算扫码是否过期
   *  @param {expire} 有效期 Number 单位：天，默认1天
   *  @param {openTime} 扫码打开时间 13位时间戳
   */
  setHaveHid(now) {
    // console.log(now)
    let loseTime = +wx.getStorageSync('loseTime')
    if (!loseTime || loseTime < now) {
      wx.setStorageSync('haveHid', false);
    } else {
      wx.setStorageSync('haveHid', true);
    }
  },


  globdata: {

  },

  globalData: {
    openId: null,
    AAid: null,
    AARid: null,
    session_key:null,
    // 是否授权手机号
    hasPhone:null,
    // 会员id
    memberId:null,
    // 会员手机
    phoneNum:null,
    // 会员等级
    cardLevel:null,
    // 会员等级代码
    levelNum:'v1',
  }

})