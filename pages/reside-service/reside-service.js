// pages/reside-service/reside-service.js
var tools = require('../../tools.js')
Page({
  data: {
    hotelname:'',
    hotelid:'',
    flexid:'',
    mainflex:[
      { flexid: '1', flexname: '保洁', flexsrc:'https://ucpic.aaroom.cc/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20190301105042.png',},      
      {flexid: '2', flexname:'充电宝',flexsrc: '/images/recharge.png',},  
      { flexid: '3', flexname:'客房服务',flexsrc: '/images/service.png',},   
    ],
    hiddenmodalput: true,//可以通过hidden是否掩藏弹出框的属性，来指定那个弹出框 
    firstinput:'',
    getroom:'',
  },
  onLoad: function (options) {
    var hotel = wx.getStorageSync('hoteldetails');
    this.setData({
      hotelname:hotel.hotelName,
      hotelid: hotel.hotelId      
    });    
  },
  //点击宿中服务
  getservice:function(e){    
    this.setData({//点击hiddenmodalput弹出框
      flexid: e.currentTarget.id,  
      hiddenmodalput: !this.data.hiddenmodalput
    });    
  }, 
  cancel: function () {//取消按钮
    this.setData({
      hiddenmodalput:true,
      firstinput: ''
    });
  },
  getroom:function(e){
    this.setData({
      getroom:e.detail.value
    })
  },
  //确认  
  confirm:function () {    
    if (this.data.getroom) {//申请成功后getroom清空
      var data = {        
        hotel_id: this.data.hotelid,
        service_type_id: this.data.flexid,        
        room_id: this.data.getroom,
      }
      console.log(data);   
      // tools.save({
      //   url: '/api/postServeApply',        
      //   data: data,
      //   success: function (res) {
      //     if (res.statusCode == '200') {
      //       wx.showToast({
      //         title: '申请成功',
      //         icon: 'success',
      //         mask: true,
      //         duration: 1500
      //       })
      //     }
      //   }
      // })   
      wx.request({
        url: 'http://localhost:8080/api/postServeApply',
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'          
        },
        method: 'POST',
        data:data,
        success: function (res) {
          // console.log(res);
          if (res.statusCode == '200') {
            wx.showToast({
              title: '申请成功',
              icon: 'success',
              mask: true,
              duration: 1500
            })
          } 
        }
      })
      this.setData({
        hiddenmodalput: true,
        firstinput:'',
        getroom:''
      })      
    }
  },
  //提示敬请期待
  getTips: function () {
    wx.showToast({
      title: '敬请期待哦！',
      icon: 'none'
    })
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