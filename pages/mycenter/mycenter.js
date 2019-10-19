var tools = require('../../tools.js')
var app = getApp()
// pages/kangkang/praces.js
Page({
  data:{
    loginStatus: false,
  },
  onLaunch: function () {
    wx.login({
      success: function (res) {
        if (res.code) {
          //发起网络请求
          console.log('小程序获取code:', res.code)
          wx.request({
            url: 'https://test.com/onLogin',
            data: {
              code: res.code
            }
          })
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      }
    });
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    new app.WeToast()
    tools.mta.Page.init()
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
    if( this.checkMemberLogin() ){
      this.setData({
        loginStatus: true
      })
      this.getMemberInfo()
    }else{
      this.setData({
        loginStatus: false,
        memberInfo: ''
      })
    }
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  },
  // 获取用户信息
  getMemberInfo: function(){
    var self = this
    tools.save({
      // url: '/memberResource/v1.1/memberInfo',
      url: '/memberResource/v2.0/memberInfo',
      data: {
        memberId: wx.getStorageSync('memberId')
      },
      success: function(res) {
        self.setData({
          memberInfo: res.data.retValue
        })
      }
    })
  },
  // 用户登录检测
  checkMemberLogin: function(){
    if( wx.getStorageSync('memberId') ){
      return true
    }else{
      return false
    }
  },
  // 点击用户头像
  openUserInfo: function(){
    if( this.data.loginStatus ){
      wx.navigateTo({
        url: '../my-info/my-info'
      })
    }else{
      wx.navigateTo({
        url: '../login/login'
      })
    }
  },
  // 酒店订单
  openHotelList: function(){
    if( this.data.loginStatus ){
      wx.navigateTo({
        url: '../order-list/order-list'
      })
    }else{
      wx.navigateTo({
        url: '../login/login'
      })
    }
  },
  // 我的酒店
  openMyHotel () {
    if( this.data.loginStatus ){
      wx.navigateTo({
        url: '../my-hotel/my-hotel'
      })
    }else{
      wx.navigateTo({
        url: '../login/login'
      })
    }
  },
  // 我的评价
  openMyComment () {
    if( this.data.loginStatus ){
      wx.navigateTo({
        url: '../my-assess/my-assess'
      })
    }else{
      wx.navigateTo({
        url: '../login/login'
      })
    }
  },
  // 常用信息
  openCommonInfo () {
    if( this.data.loginStatus ){
      wx.navigateTo({
        url: '../common-info/common-info'
      })
    }else{
      wx.navigateTo({
        url: '../login/login'
      })
    }
  },
})