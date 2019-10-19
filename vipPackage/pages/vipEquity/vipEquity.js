// vipPackage/pages/vipEquity/vipEquity.js
var tools = require('../../../tools');
var API = require('../../../API');
var config = require('../../../config');
var app = getApp();
Page({
  data: {
    nowEquity:{},
  },
  onLoad: function (options) {
    //Do some initialize when page load.
  },
  onReady: function () {
    //Do some when page ready.

  },
  onShow: function () {
    //Do some when page show.
    // this.getMemberInfo();
    this.getNowEquity();
  },

  /**
   * 获取当前会员权益信息
   */
  getNowEquity(){
    let that=this;
    tools.saveJAVA({
      url: API.getMemberEquity,
      method: "GET",
      data:{
        memberId:app.globalData.memberId
      },
      success(res) {
        // console.log(777)
        // console.log(res)
        app.globalData.levelNum=res.data.levelNum;
        app.globalData.cardLevel=res.data.levelName;
        that.setData({
          nowEquity:res.data
        })
      }
    })
  },

  /**
   * 获取会员信息
   */
  getMemberInfo() {
    let that = this;
    tools.saveJAVA({
      url: API.getMemberInfo,
      data: {
        memberId: app.globalData.memberId,
      },
      method: 'GET',
      success: function (res) {
        console.log(res)
        wx.setStorageSync('memberInfo', res.data)
        that.setData({
          memberInfo: res.data
        })
      }
    })
  },

  /**
   * 点击购买
   */
  tapBuy() {
    let that=this;
    let levelNum = this.data.nowEquity.levelNum;
    // 埋点
    wx.reportAnalytics('tap_buy_vip_money', {
      tap_buy_vip_money_hid: app.globalData.AAid,
    });
    
    if (levelNum === 'v1') {
      tools.saveJAVA({
        url:API.getWechatPayPreId,
        method:'GET',
        data:{
          memberId:app.globalData.memberId
        },
        success(res){
          console.log(res)
          that.pay(res.data);
        }
      })
    } else {
      wx.showModal({
        title: '提示',
        content: `您已成为${this.data.nowEquity.levelName},请勿重复购买`,
        showCancel: false
      })
      return
    }
  },

  /**
   * 支付
   */
  pay(payMsg) {
    let that=this;
    console.log(payMsg)
    // return
    wx.requestPayment({
      'timeStamp': payMsg.timeStamp,
      'nonceStr': payMsg.nonceStr,
      'package': payMsg.package,
      'signType': 'MD5',
      'paySign': payMsg.paySign,

      success: function (res) {
        console.log(res)

        that.getNowEquity();
        wx.showToast({
          title: '支付成功',
          icon: 'success',
          mask: true,
          duration: 1500,
        })
      },
      'fail': function (res) {
        wx.showToast({
          title: '支付失败',
          icon: 'none',
          duration: 1500,
          mask: true,
        })
      },
      'complete': function (res) {
        console.log(res)
      }
    })
  },
})