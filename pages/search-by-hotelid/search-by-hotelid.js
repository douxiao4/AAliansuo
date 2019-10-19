var config = require('../../config.js')
var tools = require('../../tools.js')
var app = getApp()

Page({
  data: {
    hotelId: ''
  },
  onLoad: function(){},
  onShow: function(){
    new app.WeToast()
    tools.mta.Page.init()
  },
  // 通过酒店ID进入酒店详情页面
  openHotelById: function(){
    var self = this
    if(self.data.hotelId == ''){
      self.wetoast.toast({
        title: '请填写酒店编号',
      })
      return false
    }
    wx.navigateTo({
      url: "../hotel-detail/hotel-detail?hotelId="+self.data.hotelId
    })
  }
})