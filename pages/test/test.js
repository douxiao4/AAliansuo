// pages/test/test.js
var app = getApp();
var tools = require('../../tools');
var API = require('../../API');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hasPhone: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.login()
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
   * 登录wx 判断是否授权
   */
  login() {
    let that = this;
    tools.getHasPhone(app, that);
  },

  /**
   * 获取手机号
   */
  getPhone(e) {
    let hasPhone = e.detail.hasPhone;
    this.setData({
      hasPhone
    })
  },

  /**
   * 支付
   */
  toPay() {
    let that = this;
    tools.saveJAVA({
      url: API.getWechatPayPreId,
      method: 'GET',
      data:{
        memberId:app.globalData.memberId
      },
      success: function (res) {
        console.log(res.data)
        let payMsg = res.data;
        that.pay(payMsg);
      },
      fail(err) {
        console.log(err)
      }
    })
  },
  pay(payMsg) {
    // return
    wx.requestPayment({
      'timeStamp': payMsg.timeStamp,
      'nonceStr': payMsg.nonceStr,
      'package': payMsg.package,
      'signType': 'MD5',
      'paySign': payMsg.paySign,

      success: function (res) {
        console.log(res)
        wx.showToast({
          title: '支付成功',
          icon: 'success',
          mask: true,
          duration: 1500,
          success() {}
        })
      },
      'fail': function (res) {
        console.log(res)
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

  /**
   * 会员权益 
   * */
  getMemberEquity() {
    tools.saveJAVA({
      url: API.getMemberEquity,
      method: "GET",
      data:{
        memberId:app.globalData.memberId
      },
      success(res) {
        console.log(res)
      }
    })
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