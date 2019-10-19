var tools = require('../../tools.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    num: 0,
    scrollTop: 0
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '正在加载...',
      icon: 'loading',
      mark: true
    })
    var hotelId = options.id;
    this.setData({
      hotelId: hotelId
    })
    this.getHotelInfo();
  },
  getHotelInfo: function () {
    var that = this;
    var data = {
      hotelId: that.data.hotelId,
      lat: wx.getStorageSync('lat'),
      lon: wx.getStorageSync('lon'),
      memberId: wx.getStorageSync('memberId')
    }
    tools.save({
      url: '/hotelResource/v1.1/getHotelInfo',
      data: data,
      success: function (res) {
        console.log(res);
        that.setData({
          hotelInfo: res.data.retValue.baseInfo
        })
        wx.hideLoading();
      }
    })
  },
  //打电话
  callHotel: function () {
    var that = this
    wx.makePhoneCall({
      phoneNumber: that.data.hotelInfo.hotelTel
    })
  },
  //调取地图
  openMap: function () {
    var that = this
    wx.openLocation({
      latitude: that.data.hotelInfo.hotelLatitude, // 纬度，范围为-90~90，负数表示南纬
      longitude: that.data.hotelInfo.hotelLongitude, // 经度，范围为-180~180，负数表示西经
      scale: 28, // 缩放比例          
      name: that.data.hotelInfo.hotelName, // 位置名
      address: that.data.hotelInfo.hotelAddress, // 地址的详细说明
    })
  },
  //点击二维码
  changeview: function (e) {
    var num = this.data.num;
    num = num == 2 ? 1 : 2;
    this.setData({
      num: num
    })
    this.goTop();
  },
  onPageScroll: function (e) {
    // console.log(e);
  },
  goTop: function (e) {  // 一键回到顶部
    if (wx.pageScrollTo) {
      wx.pageScrollTo({
        scrollTop: 0
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }
  },
  //分享功能
  onShareAppMessage: function () {
    var id = wx.getStorageSync('hotelId');
    return {
      title: 'AA连锁酒店',
      path: '/pages/lchotel-introduce/lchotel-introduce?id=' + id
    }
  },

})