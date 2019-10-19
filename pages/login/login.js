var tools = require('../../tools.js')
var config = require('../../config.js')
// var API = require('../../API')
var app = getApp()
// pages/kangkang/praces.js
Page({
  data: {
    memberId: '',
    memberPwd: '',
    // 下个页面名称
    toPage: null,
    hid: null,
    name: null,
  },

  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    new app.WeToast()
    tools.mta.Page.init()
    console.log(options)
    let toPage = null;
    let hid = null;
    let name = null;
    if (options.to) {
      toPage = options.to;
    }
    if (options.hid) {
      hid = options.hid;
    }
    if (options.name) {
      name = options.name;
    }
    this.setData({
      toPage,
      hid,
      name
    })
  },
  // 绑定手机填写事件
  bindphone: function (e) {
    var self = this
    self.setData({
      memberId: e.detail.value
    })
  },
  // 绑定密码填写事件
  bindpwd: function (e) {
    var self = this
    self.setData({
      memberPwd: e.detail.value
    })
  },
  // 登陆按钮
  submitBtn: function (e) {
    var self = this
    if (!self.checkData()) {
      return false
    }
    // 先获取 code 再请求登录
    tools.getCode(self, function () {
      self.wetoast.toast({
        title: '正在登录...',
        duration: 10000
      })
      if (!self.data.code) {
        // console.log('No code')
        self.wetoast.toast()
        return false
      }
      var data = {
        memberId: self.data.memberId,
        memberLoginType: 2,
        memberPwd: tools.md5(self.data.memberPwd),
        code: self.data.code
      }
      tools.save({
        url: '/memberResource/v1.1/memberLogin',
        data: data,
        success: function (res) {
          // console.log(res);
          wx.reportAnalytics('login_pwd_ok', {
            login_pwd_ok_hid: app.globalData.AAid,
            login_pwd_ok_rid: app.globalData.AARid,
          });
          if (res.data.retCode == 200) {
            self.wetoast.toast({
              title: '登录成功！',
            })
            console.log('登陆成功，返回res', res)
            wx.setStorageSync('memberId', res.data.retValue)
            // 跳往下个页面
            if (self.data.toPage) {
              let url = ``;
              let hid = this.data.hid;
              let name = this.data.name;
              switch (self.data.toPage) {
                // case '会员权益':
                //   let brandUrl = config.H5url.equityUrl;
                //   let openId = wx.getStorageSync("openId");
                //   url = `../goToEquity/goToEquity?url=${brandUrl}&openId=${openId}`
                //   break;
                // case '推荐酒店':
                //   url = `../../vipPackage/pages/suggestionList/suggestionList`
                //   break;
                case '房间质检':
                  url = `../../vipPackage/pages/suggestionList/suggestionList`;
                  break;
                case '我的收藏':
                  url = `../my-hotel/my-hotel?id=1`;
                  break;
                case '我的订单':
                  url = `../order-list/order-list?id=0`;
                  break;
                case '我要住店':
                  hid = this.data.hid;
                  url = `../hotel-detail/hotel-detail?id=${hid}`;
                  break;
                case '酒店贴士':
                  hid = this.data.hid;
                  name = this.data.name;
                  url = `../../vipPackage/pages/tips/tips?hid=${hid}&name=${name}`;
                  break;
                case '我要吐槽':
                  hid = this.data.hid;
                  name = this.data.name;
                  url = `../../vipPackage/pages/feedback/feedback?hid=${hid}&name=${name}`;
                  break;
                case '会员权益(扫码)':
                  hid = this.data.hid;
                  name = this.data.name;
                  url = `../../vipPackage/pages/vipEquity/vipEquity?hid=${hid}&name=${name}`;
                  break;
              }
              wx.redirectTo({
                url: url,
              })
            } else {
              setTimeout(function () {
                wx.navigateBack()
              }, 1000)
            }
          } else {
            self.wetoast.toast({
              title: res.data.retMsg,
            })
          }
        }
      })
    })
  },

  // 表单验证
  checkData: function () {
    var self = this
    var data = self.data
    if (data.memberId == '') {
      self.wetoast.toast({
        title: '请输入账号',
        duration: 500
      })
      return false
    } else if (data.memberId.length < 11) {
      self.wetoast.toast({
        title: '请输入正确的手机号',
        duration: 500
      })
      return false
    } else if (data.memberPwd == '') {
      self.wetoast.toast({
        title: '请输入密码',
        duration: 500
      })
      return false
    }
    return true
  },
  // 通过短信验证码登录
  openLoginWidthVcode: function () {
    let toPage = this.data.toPage;
    if (toPage) {
      wx.redirectTo({
        url: `../login-width-sms/login-width-sms?to=${toPage}`
      })
    } else {
      wx.redirectTo({
        url: `../login-width-sms/login-width-sms`
      })
    }
  },
  // 忘记密码
  loginwangji: function () {
    wx.navigateTo({
      url: '../forgetpassword/forgetpassword'
    })
  },
  // 立即注册
  loginpromptly: function () {
    wx.navigateTo({
      url: '../pormptly/pormptly'
    })
  }
})