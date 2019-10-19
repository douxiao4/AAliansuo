var tools = require('../../tools.js')
var API=require('../../API')
var app = getApp()
// pages/kangkang/praces.js
Page({
  data: {
    openId: ''
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    new app.WeToast()
    tools.mta.Page.init()
    
    // wx.login({
    //   success: function (res) {
    //     if (res.code) {
    //       var code = res.code
    //       wx.request({
    //         url: 'https://aaroom.ihotels.cc/wechat/code2all?code=' + code + '&source=aaroom',
    //         method: 'get',
    //         header: {
    //           'content-type': 'application/json' //默认值
    //         },
    //          data: {
    //            code: res.code
    //         },

    //         success: function (result) {
    //           wx.setStorageSync('openId',result.data.openid)
    //         }
    //       })
    //     } else {
    //       console.log('获取用户登录态失败！' + res.errMsg)
    //     }
    //   }
    // });
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
    this.getMemberInfo()
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  },

  /**
   * 获取用户信息
   */
  getMemberInfo(){
    wx.showLoading({
      title: '加载中',
    })
    let that=this;
    tools.saveJAVA({
      url:API.getMemberInfo,
      data:{
        memberId:app.globalData.memberId,
      },
      method:'GET',
      success: function(res) {
        wx.hideLoading()
        // console.log(res)
        // let birthday = res.data.birthday;
        // birthday = new Date(birthday)
        
        // let y = birthday.getFullYear();
        // let m = birthday.getMonth() + 1;
        // m=m<10?'0'+m:m;
        // let d = +birthday.getDate();
        // d = d < 10 ? '0' + d : d;
        // birthday = `${y}-${m}-${d}`
        // console.log(birthday)
        let memberInfo = res.data;
        // memberInfo.birthday = birthday;
        wx.setStorageSync('memberInfo', memberInfo)
        that.setData({
          memberInfo: memberInfo
        })
      }
    })
  },

  // 退出登录
  outBtn:function(){
    var self = this
    wx.removeStorageSync('memberId')
    self.wetoast.toast({
      title: '退出成功！',
      duration: 10000
    })
    setTimeout(function(){
      wx.navigateBack()
    }, 1000)
  },
  /* toEquity: function () {
    console.log('跳转外部链接-会员权益')
    var brandUrl = 'https://memberweb.ethank.com.cn/index.html';
    var openId = wx.getStorageSync("openId");
    wx.navigateTo({
      url: '../goToEquity/goToEquity?url='+brandUrl+'&openId='+openId
    })
  }, */
  /**
   * 跳会员权益
   */
  toEquity: function () {
    console.log('跳转外部链接-会员权益')
    var brandUrl = 'https://memberweb.ethank.com.cn/index.html';
    var openId = wx.getStorageSync("openId");
    wx.reportAnalytics('to_vip_equity', {
      to_vip_equity_hid: app.globalData.AAid,
      to_vip_equity_position: `个人资料-详情-会员权益`,
    });
    wx.navigateTo({
      url: '../../vipPackage/pages/vipEquity/vipEquity'
    })
  },
  /**
   * 修改个人信息
   */
  toEdit(){
    wx.navigateTo({
      url: '../../vipPackage/pages/editUserInfo/editUserInfo',
    })
  },
})