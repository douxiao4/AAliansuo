// pages/lctest/lctest.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    num: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  changeview: function(e) {
    var num = this.data.num;
    num = num == 2? 1:2;
    this.setData({
      num: num
    })
    console.log(this.data.num);
  }
})