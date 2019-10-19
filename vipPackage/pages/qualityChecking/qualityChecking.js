// vipPackage/pages/qualityChecking/qualityChecking.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showQCBtn:true,
    trueSrc:'https://ucpic.aaroom.cc/2019-01-31_5c52b8653f63c.png',
    falseSrc:'https://ucpic.aaroom.cc/2019-01-31_5c52b8800cf91.png'
  },
  // 提示框
  alert(){
    let type=this.data.type;
    wx.reportAnalytics('quality_checking_tip', {
      quality_checking_tip_from: type,
    });
    this.setData({
      showQCBtn:false
    })
    wx.setStorageSync('showQCBtn', false)
  },

  // 拆页面参数
  setOption(e){
    let type=e.type;
    this.setData({
      type
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setOption(options);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // console.log(wx.getStorageSync('showQCBtn'))
    if(wx.getStorageSync('showQCBtn')===false){
      let showQCBtn=wx.getStorageSync('showQCBtn');
      this.setData({
        showQCBtn
      })
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})