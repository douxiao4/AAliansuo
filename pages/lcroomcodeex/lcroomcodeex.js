// pages/lcroomcodeex/lcroomcodeex.js
var tools = require('../../tools.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  onShow: function() {
    this.setData({
      roomcode: ''
    })
  },
  getroomcode: function(e) {
    this.setData({
      roomcode: e.detail.value
    })
  },
  roomcodeex: function() {
    var roomcode = this.data.roomcode;
    var memberId = wx.getStorageSync('memberId');
    if(!roomcode){
      wx.showToast({
        title: '请输入正确的房券码！',
        icon: 'none',
        mask: true
      })
      return false;
    }
    this.setData({
      roomcode: ''
    })

    tools.save({
      url: '/couponResource/v1.1/roomCoupon',
      data: {
        memberId: memberId,
        couponCode: roomcode
      },
      success: function(res) {

        if(res.data.retCode == 200) {
          wx.showModal({
            title: res.data.retMsg,
            confirmText: '查看',
            success (res) {
              if (res.confirm) {
                wx.navigateTo({
                  url: '../lccoupons/lccoupons?page=3'
                })
              } 
            }
          })
        }else {
          wx.showToast({
            title: res.data.retMsg,
            icon: 'none',
            mask: true
          })
        }
      }
    })



  }
  
})