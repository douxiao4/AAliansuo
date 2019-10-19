var tools = require('../../tools.js')
var config = require('../../config.js')

var app = getApp()
// pages/kangkang/praces.js
Page({
  data:{
    step: 1,
    phone: '',
    vcodeBtnText: '发送验证码',
    vcode: '',
    pwd: '',
    vcodeBtnStatus: true
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    new app.WeToast()
    tools.mta.Page.init()
  },
  // 输入手机号
  bindPhone: function(e){
    this.setData({
      phone: e.detail.value
    })
  },
  // 输入验证码
  bindVcode: function(e){
    this.setData({
      vcode: e.detail.value
    })
  },
  // 输入密码
  bindPwd: function(e){
    if(e.detail.value.length > 20) {
      wx.showToast({
        title: '密码长度应不超过20个字符或数字',
        icon: 'none'
      })
    }
    this.setData({
      pwd: e.detail.value
    })
  },
  // 跳转到第二步
  nextStep2: function(e){
    var self = this
    self.checkPhone(function(res){
      self.setData({
        step: 2
      })
    })
  },
  // 验证手机号
  checkPhone: function(fn){
    var self = this
    if(self.data.phone == ''){
      self.wetoast.toast({
        title: '请填写手机号'
      })
      return false
    }
    var phoneReg = /0?(13|14|15|16|17|18)[0-9]{9}/;
    var phoneNum = self.data.phone;
    if(!phoneReg.test(phoneNum)){
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none'
      })
      return false;
    }
    var data = {
      memberId: self.data.phone
    }
    tools.save({
      url: '/memberResource/v1.1/memberRegistCheck',
      data: data,
      success: function(res) {
        if(res.data.retValue == 1){
          self.memberSendShortMsg(fn)
        }else{
          self.wetoast.toast({
            title: '该手机尚未注册'
          })
        }
      }
    })
  },
  // 获取验证码
  memberSendShortMsg: function(callback){
    var self = this
    !(typeof callback == 'function')?(callback = function(){}):''
    if(!self.data.vcodeBtnStatus){
      return false
    }
    tools.save({
      url: '/memberResource/v1.1/memberSendShortMsg',
      data: {
        memberId: self.data.phone,
        memberShortMsgType: 2
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
  },
  // 跳转到第三步
  nextStep3: function(){
    var self = this
    if(self.data.vcode == ''){
      self.wetoast.toast({
        title: '请填写验证码'
      })
      return false
    }
    self.checkVcode(function(){
      self.setData({
        step: 3
      })
    })
  },
  // 检测验证码是否正确
  checkVcode: function(fn){
    var self = this
    var data = {
      memberId: self.data.phone,
      memberShortMsg: self.data.vcode
    }
    tools.save({
      url: '/memberResource/v1.1/memberPassRt2',
      data: data,
      success: function(res) {
        if(res.data.retCode == 200){
          fn()
        }else{
          self.wetoast.toast({
            title: res.data.retMsg
          })
        }
      }
    })
  },
  // 确认重置密码
  nextStep4: function(){
    var self = this
    var pwdReg = /^\w{4,20}$/;

    if(self.data.pwd == '' || !pwdReg.test(self.data.pwd)){
      wx.showToast({
        title: '密码长度为4-20位的数字、字母和字符',
        icon: 'none'
      })
      return false
    }
    var data = {
      memberId: self.data.phone,
      memberShortMsg: self.data.vcode
    }
    tools.save({
      url: '/memberResource/v1.1/memberPassRt2',
      data: data,
      success: function(res) {
        if(res.data.retCode == 200){
          memberPassRt3()
        }else{
          self.wetoast.toast({
            title: res.data.retMsg
          })
        }
      }
    })
    function memberPassRt3(){
      var data = {
        memberId: self.data.phone,
        memberPwd: tools.md5(self.data.pwd)
      }
      tools.save({
        url: '/memberResource/v1.1/memberPassRt3',
        data: data,
        success: function(res) {
          if(res.data.retCode == 200){
            self.wetoast.toast({
              title: '重置成功'
            })
            setTimeout(function(){
              wx.navigateBack()
            },1000)
          }else{
            self.wetoast.toast({
              title: res.data.retMsg
            })
          }
        }
      })
    }
  },
  // 

})