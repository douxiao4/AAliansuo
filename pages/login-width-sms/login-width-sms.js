var config = require('../../config.js')
var tools = require('../../tools.js')
var app = getApp()
// pages/kangkang/praces.js
Page({
  data: {
    step: 1,
    memberId: '',
    vcode: '',
    vcodeBtnText: '获取验证码',
    vcodeBtnStatus: true,
    // 下个页面名称
    toPage: null,
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    new app.WeToast()
    tools.mta.Page.init()
    let toPage = null;
    if (options.to) {
      toPage = options.to;
    }
    this.setData({
      toPage
    })
  },
  // 绑定手机号输入事件
  bindphone: function (e) {
    var self = this
    self.setData({
      memberId: e.detail.value
    })
  },
  // 绑定验证码输入事件
  bindvcode: function (e) {
    var self = this
    self.setData({
      vcode: e.detail.value
    })
  },
  // 表单验证
  checkData: function (data) {
    var self = this
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
  // 通过手机密码登录
  openLoginWidthPwd: function () {
    wx.redirectTo({
      url: '../login/login'
    })
  },
  // 获取验证码
  getVcode: function () {
    var self = this
    self.checkUser(function () {
      self.setData({
        step: 2
      })
    })
  },
  // 检测用户是否注册
  checkUser: function (fn) {
    var self = this
    if (self.data.memberId == '') {
      self.wetoast.toast({
        title: '请输入手机号码'
      })
      return false
    }
    var data = {
      memberId: self.data.memberId,
    }
    tools.save({
      url: '/memberResource/v1.1/memberRegistCheck',
      data: data,
      success: function (res) {
        if (res.data.retCode == 200) {
          if (res.data.retValue == 1) {
            // 已注册用户发送验证码
            self.sendVcode(fn)
          } else {
            self.wetoast.toast({
              title: '该手机号未注册',
            })
          }
        } else {
          self.wetoast.toast({
            title: res.data.retMsg,
          })
        }
      },
      fail: function () {
        wx.showToast({
          title: '您的网络好像出了点问题...',
          icon: 'none'
        })
      }
    })
  },
  // 发送验证码
  sendVcode: function (callback) {
    var self = this;
    !(typeof callback == 'function') ? (callback = function () {}) : ''
    if (!self.data.vcodeBtnStatus) {
      return false
    }
    tools.save({
      url: '/memberResource/v1.1/memberSendShortMsg',
      data: {
        memberId: self.data.memberId,
        memberShortMsgType: 3
      },
      success: function (res) {
        if (res.data.retCode == 200) {
          callback()
          var timeCount = config.VCODE_TIME
          var timer = setInterval(function () {
            self.setData({
              vcodeBtnText: timeCount + '秒'
            })
            if (timeCount <= 0) {
              clearInterval(timer)
              self.setData({
                vcodeBtnStatus: true,
                vcodeBtnText: '发送验证码'
              })
            }
            timeCount--
          }, 1000)
        } else {
          self.wetoast.toast({
            title: '服务器连接出错',
          })
        }
      },
      fail: function () {
        wx.showToast({
          title: '您的网络好像出了点问题...',
          icon: 'none'
        })
      }
    })
  },
  // 登陆
  loginBtn: function () {
    var self = this
    // 先获取 code 再登录
    tools.getCode(self, function () {
      var data = {
        memberId: self.data.memberId,
        memberLoginType: 1,
        memberShortMsg: self.data.vcode,
        code: self.data.code
      }
      tools.save({
        url: '/memberResource/v1.1/memberLogin',
        data: data,
        success: function (res) {
          // console.log(res);
          if (res.data.retCode == 200) {
            wx.reportAnalytics('login_sms_ok', {
              login_sms_ok_hid: app.globalData.AAid,
              login_sms_ok_rid: app.globalData.AARid,
            });
            self.wetoast.toast({
              title: '登录成功！',
            })
            wx.setStorageSync('memberId', res.data.retValue)

            // 跳往下个页面
            if (self.data.toPage) {
              let url = ``;
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
                  url = `../../vipPackage/pages/suggestionList/suggestionList`
                  break;
                case '我的收藏':
                  url = `../my-hotel/my-hotel?id=1`
                  break;
                case '我的订单':
                  url = `../order-list/order-list?id=0`
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
            }else{
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