var tools = require('../../tools.js')
var config = require('../../config.js')
var API = require('../../API')
var app = getApp()

// pages/pormptly/pormptly.js
Page({
  data:{
    step: 1,
    phone: '',
    name: '',
    vcodeBtnText: '获取验证码',
    vcodeBtnStatus: true,
    vcode: '',
    pwd: '',
    AAid: null,
    AARid:null,
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    new app.WeToast()
    tools.mta.Page.init()
    console.log(app.globalData)
    let AARid = app.globalData.AARid;
    let AAid = app.globalData.AAid;
    this.setData({
      AAid,
      AARid
    })
  },
  // 绑定手机号输入
  bindphone (e){
    var self = this
    self.setData({
      phone: e.detail.value
    })
  },
  // 绑定用户名
  bindname (e) {
    var self = this
    self.setData({
      name: e.detail.value
    })
  },
  // 绑定验证码
  bindvcode (e) {
    var self = this
    self.setData({
      vcode: e.detail.value
    })
  },
  // 绑定密码
  bindpwd: function(e){
    var self = this
    self.setData({
      pwd: e.detail.value
    })
  },
  // 跳转到第二部
  nextStep2 () {
    var self = this
    var phoneReg = /^1\d{10}$/;
    if(self.data.phone == ''||!phoneReg.test(self.data.phone)){
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none'
      })
      return false
    }
    // var phoneReg = /^1\d{10}$/;
    // var phoneNum = self.data.phone;
    // if(!phoneReg.test(phoneNum)){
    //   wx.showToast({
    //     title: '请输入正确的手机号',
    //     icon: 'none'
    //   })
    //   return false;
    // }
    if(self.data.name == ''){
      wx.showToast({
        title: '请填写姓名',
        icon: 'none'
      })
      return false
    }
    self.checkphone(function(){
      // console.log(123)
      self.setData({
        step: 2
      })
    })
  },
  // 检测手机号是否已注册
  checkphone (fn) {
    var self = this
    var data = {
      memberId: self.data.phone,
    }
    tools.save({
      url: '/memberResource/v1.1/memberRegistCheck',
      data: data,
      success: function(res) {
        if(res.data.retValue == 2){
          // 尚未注册用户
          fn()
          // self.sendVcode()
        }else if(res.data.retValue == 1){
          wx.showToast({
            title: '该手机号已注册',
            icon: 'none'
          })
        }else {
          wx.showToast({
            title: res.data.retMsg,
            icon: 'none'
          })
        }
      }
    })
  },
  // 发送验证码
  /* sendVcode: function(callback){
    var self = this
    !(typeof callback == 'function')?(callback = function(){}):''
    if(!self.data.vcodeBtnStatus){
      return false
    }
    self.setData({
      vcodeBtnStatus: false
    })
    tools.save({
      url: '/memberResource/v1.1/memberSendShortMsg',
      data: {
        memberId: self.data.phone,
        memberShortMsgType: 1
      },
      success: function(res) {
        if( res.data.retCode == 200 ){
          callback()
          var timeCount = config.VCODE_TIME
          var timer = setInterval(function(){
            self.setData({
              vcodeBtnText: timeCount+'秒'
            })
            if(timeCount <= 0){
              clearInterval(timer)
              self.setData({
                vcodeBtnStatus: true,
                vcodeBtnText: '发送验证码'
              })
            }
            timeCount--
          },1000)
        }
      }
    })
  }, */
  // 发送验证码 0219改
  sendVcode: function(){
    console.log(23423)
    var self = this
    if(!self.data.vcodeBtnStatus){
      return false
    }
    self.setData({
      vcodeBtnStatus: false
    })
    tools.save({
      url: '/memberResource/v1.1/memberSendShortMsg',
      data: {
        memberId: self.data.phone,
        memberShortMsgType: 1
      },
      success: function(res) {
        if( res.data.retCode == 200 ){
          var timeCount = config.VCODE_TIME
          var timer = setInterval(function(){
            self.setData({
              vcodeBtnText: timeCount+'秒'
            })
            if(timeCount <= 0){
              clearInterval(timer)
              self.setData({
                vcodeBtnStatus: true,
                vcodeBtnText: '获取验证码'
              })
            }
            timeCount--
          },1000)
        }else if(res.data.retCode == 500){
          wx.showToast({
            title: res.data.retMsg,
            icon: 'none',
            duration: 2000
          })
          self.setData({
            vcodeBtnStatus: true,
            vcodeBtnText: '获取验证码'
          })
        }
      }
    })
  },
  // 第三步
  nextStep3: function(){
    var self = this
    if(self.data.vcode == ''){
      wx.showToast({
        title: '请填写验证码',
        icon: 'none'
      })
      return false
    }
    self.setData({
      step: 3
    })
  },
  // 注册按钮
  registerBtn(){
    var self = this;
    var pwdReg = /^\w{4,20}$/;
    if(self.data.pwd == '' || !pwdReg.test(self.data.pwd)){
      wx.showToast({
        title: '密码长度为4-20位的数字、字母和字符',
        icon: 'none'
      })
      return false
    }
    var data = {
      reghotel_id: wx.getStorageSync('code_hotel_id'),//若二维码酒店详情的酒店id
      regemployee_id: wx.getStorageSync('regemployee_id'),//若二维码酒店详情的酒店推广员码
      memberId: self.data.phone,
      memberName:self.data.name,
      memberPwd: tools.md5(self.data.pwd),
      memberShortMsg: self.data.vcode,
      openid:app.globalData.openId,
      AAid: self.data.AAid,
      AARid: self.data.AARid,
    }
    // PHP
    tools.savePHP({
      url: API.register,
      data: data,
      success: function(res) {
        if(res.data.retCode == 200){
          
          wx.reportAnalytics('register_ok', {
            register_ok_tel: self.data.phone,
            register_ok_hid: self.data.AAid,
            register_ok_rid: self.data.AARid,
          });
          wx.showToast({
            title: '注册成功！',
            icon: 'success',
            mask:true
          })
          setTimeout(function(){
            wx.navigateBack()
          },1000)
        }else{
          wx.showToast({
            title: res.data.retMsg,
            icon: 'none'
          })
        }
      }
    })
  },
})