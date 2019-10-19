var tools=require('../../../tools');
var app = getApp()
Page({
  data: {
    memberId: wx.getStorageSync('memberId'),
    // memberId: 18301590739,
    openId: '',
    url:''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('goClothDetail-options:', options);
    var memberid = wx.getStorageSync('memberId');
    var url = options.url + "?id=" + memberid + '&from=aa' + '&openId=' + options.openId;
    this.setData({
      url: encodeURI(url)
    })
  },

})