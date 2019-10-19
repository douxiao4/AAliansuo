var tools = require('../../tools.js')
var config = require('../../config.js')
var API = require('../../API')

var app = getApp()
Page({
  data: {},
  onLoad: function (option) {
    tools.mta.Page.init()
    // new app.WeToast()
    // this.setData({
    //   orderNo: option.tradeId,
    //   payStatus: option.paystatus
    // })
    this.setData({
      hotel_id: option.hid,
      // order_no: option.tradeId,
      channel_order_no: option.cid,
    })
  },
  
  /**
   * 取消订单
   */
  cancelBtn() {
    let that = this;
    wx.showLoading({
      title:'加载中',
      mask:true
    })
    tools.saveJAVA({
      url: API.cancelOrder,
      data: {
        hotel_id: that.data.hotel_id,
        // order_no: that.data.order_no,
        channel_order_no: that.data.channel_order_no,
      },
      success: function(res) {
        console.log(res)
        wx.hideLoading();
        if(res.data.error_code!=0){
          wx.showModal({
            title:'提示',
            content:res.data.error_msg,
            showCancel:false,
            success(){
              wx.navigateBack({
                delta: 1, // 回退前 delta(默认为1) 页面
              })
            }
          })
        }else{
          wx.navigateBack({
            delta: 1, // 回退前 delta(默认为1) 页面
            success: function(res){
              // success
              wx.showToast({
                title:'取消成功',
                icon:'success'
              })
            }
          })
        }
      },
      fail: function(err) {
        console.log(err)
        wx.hideLoading();
      }
    })
  }
})