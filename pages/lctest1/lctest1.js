// pages/lctest1/lctest1.js
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

  rotate: function() {
    // console.log(this.data.num);
    var num = this.data.num;
    num = num == ''? '1':'';
    this.setData({
      num: num
    })
    console.log(num);
  }
})