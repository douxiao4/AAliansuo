var tools = require('../../tools.js')
var config = require('../../config.js')
var app = getApp()
Page( {
  data: {},
  onLoad: function() {
    var self = this
    new app.WeToast()
    tools.mta.Page.init()
  },
  onShow: function(){
    var self = this
    self.getHotelList()
  },
  // 获取常住/收藏
  getHotelList: function(){
    var self = this
    // self.wetoast.toast({
    //     title: '请稍后...',
    //     duration: 20000
    // })
    wx.showLoading({
      title: '正在加载...',
      icon: 'loading'
    })
    var data = {
      lat: wx.getStorageSync('lat'),
      lon: wx.getStorageSync('lon'),
      memberId: wx.getStorageSync('memberId'),
      pageIndex: 1,
      pageSize: 50,
    }
    tools.save({
      url: '/commentResource/v1.1/commentListMebGet',
      data: data,
      success: function(res) {
        // self.wetoast.toast()
        self.setData({
          commentListMebGet: res.data.retValue
        })
        wx.hideLoading();
      }
    })
  },
  // 打开酒店详情页面
  openHotelDetail: function(e){
    wx.navigateTo({
      url: "../hotel-detail/hotel-detail?hotelId="+e.currentTarget.dataset.id
    })
  },
})
