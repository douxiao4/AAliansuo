// pages/minecenter/minecenter.js
var tools = require('../../tools.js');
var app = getApp();
var API = require('../../API');
// console.log(app);
Page({
  data: {
    // loginStatus: false,
    // 统一授权
    hasPhone: null,
  },

  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    new app.WeToast()
    tools.mta.Page.init()
  },
  onShow: function () {
    this.login();
    // console.log(app.globalData)
    // 页面显示
    // this.getNums();
    // if (this.checkMemberLogin()) {
    //   this.setData({
    //     loginStatus: true
    //   })
    //   this.getMemberInfo()
    // } else {
    //   this.setData({
    //     loginStatus: false,
    //     memberInfo: ''
    //   })
    // }
  },

  /**
   * 登录wx 判断是否授权
   */
  login(){
    let that=this;
    tools.getHasPhone(app,that,that.getMemberInfo);
  },

  /**
   * 获取手机号
   */
  getPhone(e) {
    let hasPhone=e.detail.hasPhone;
    let phoneNum=e.detail.phoneNum;
    let cardLevel=e.detail.cardLevel;
    let discountPrice=e.detail.discountPrice;
    this.setData({
      hasPhone,
      phoneNum,
      cardLevel,
      discountPrice
    })
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
        let memberInfo = res.data;
        // memberInfo.birthday = birthday;
        wx.setStorageSync('memberInfo', memberInfo)
        that.setData({
          memberInfo: memberInfo
        })
      }
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
  // 获取用户信息
  // getMemberInfo: function () {
  //   wx.showToast({
  //     title: '正在加载...',
  //     icon: 'loading',
  //     mask: true
  //   })
  //   var self = this
  //   tools.save({
  //     // url: '/memberResource/v1.1/memberInfo',
  //     url: '/memberResource/v2.0/memberInfo',
  //     data: {
  //       memberId: wx.getStorageSync('memberId')
  //       // memberId: '18221519347'
  //     },
  //     success: function (res) {
  //       // console.log(res);

  //       var value = res.data.retValue;
  //       var memberName = res.data.retValue.cardLevelName;
  //       value.memberHead = value.memberHead ? value.memberHead : '/images/pic_Default_red.svg';
  //       value.memberPhone = tools.changeTelNum(value.memberPhone);
  //       self.setData({
  //         memberInfo: value,
  //         memberName: memberName,
  //         modglod: res.data.retValue.modglod,
  //         integral: res.data.retValue.availableRewardsNum
  //       })
  //       //  清除加载
  //       wx.hideToast();
  //     }
  //   })
  // },

  // 用户登录检测
  // checkMemberLogin: function () {
  //   if (wx.getStorageSync('memberId')) {
  //     return true
  //   } else {
  //     return false
  //   }
  // },
  // 点击用户头像
  openUserInfo: function () {
    wx.navigateTo({
      url: '../my-info/my-info'
    })
    // if (this.data.loginStatus) {
    //   wx.navigateTo({
    //     url: '../my-info/my-info'
    //   })
    // } else {
    //   wx.navigateTo({
    //     url: '../login/login'
    //   })
    // }
  },
  // 待付款的标识符个数
  // getNums: function () {
  //   var that = this;
  //   var data = {
  //     memberId: wx.getStorageSync('memberId'),
  //     channel: 18
  //   }
  //   tools.save({
  //     url: '/orderResource/v1.5/searchOrderCountByMemNo',
  //     data: data,
  //     success: function (res) {
  //       // console.log(res.data.retValue);
  //       that.setData({
  //         nums: res.data.retValue
  //       })
  //       // console.log(that.data.nums);
  //     }
  //   })
  // },
  // 打开订单列表页
  openOrderList: function (e) {
    //获取跳转到订单页的currentTab
    var id = e.currentTarget.dataset.currenttab;
    wx.navigateTo({
      url: '../order-list/order-list?id=' + id
    })
    // if (this.data.loginStatus) {
    //   wx.navigateTo({
    //     url: '../order-list/order-list?id=' + id
    //   })
    // } else {
    //   wx.navigateTo({
    //     url: '../login/login'
    //   })
    // }
  },

  // 设置会员常用信息
  setCommonInfo: function (e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../common-info/common-info?id=' + id
    })
    // if (this.data.loginStatus) {
    //   wx.navigateTo({
    //     url: '../common-info/common-info?id=' + id
    //   })
    // } else {
    //   wx.navigateTo({
    //     url: '../login/login'
    //   })
    // }
  },

  // 会员常住和收藏信息
  openMyHotel: function (e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../my-hotel/my-hotel?id=' + id
    })
    // if (this.data.loginStatus) {
    //   wx.navigateTo({
    //     url: '../my-hotel/my-hotel?id=' + id
    //   })
    // } else {
    //   wx.navigateTo({
    //     url: '../login/login'
    //   })
    // }
  },

  //点击卡券事件
  goToCoupons: function () {
    wx.showModal({
      title:'提示',
      content:'该功能正在开发，敬请期待！',
      showCancel:false,
    })
    // if (this.data.loginStatus) {
    //   wx.navigateTo({
    //     url: '../lccoupons/lccoupons?page=1'
    //   })
    // } else {
    //   wx.navigateTo({
    //     url: '../login/login'
    //   })
    // }
  },

  //测试用：进入付款页面
  // gotosuccess: function () {
  //   wx.showToast({
  //     title: '敬请期待哦！',
  //     icon: 'none'
  //   })
  // },

  // 点击进入评论页
  goToComments: function() {
    wx.navigateTo({
      url: '../lcmycomment/lcmycomment'
    })
    // if (this.data.loginStatus) {
    //   wx.navigateTo({
    //     url: '../lcmycomment/lcmycomment'
    //   })
    // } else {
    //   wx.navigateTo({
    //     url: '../login/login'
    //   })
    // }
  },

  //打电话给客服
  callToService: function () {
    wx.makePhoneCall({
      phoneNumber: '4006-456-999'
    })
  },

  //打开时间储值页面
  // goToStorage: function () {
  //   //判断用户是否登录，否则跳转到登录页
  //   if (!wx.getStorageSync('memberId')) {
  //     wx.navigateTo({
  //       url: '../login/login'
  //     })
  //     return;
  //   }
  //   var modglod = this.data.modglod;
  //   wx.navigateTo({
  //     url: '../lctime-storage/lctime-storage?modglod=' + modglod
  //   })
  // },

  //打开积分页面
  openIntegral: function() {
    //判断用户是否登录，否则跳转到登录页
    // if (!wx.getStorageSync('memberId')) {
    //   wx.navigateTo({
    //     url: '../login/login'
    //   })
    //   return;
    // }
    // var integral = this.data.integral;
    // wx.setStorageSync('integral', integral);
    wx.navigateTo({
      url: '../lcintegral/lcintegral'
    })
  }
})