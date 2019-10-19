var tools = require('../../tools.js')
var config = require('../../config.js')
var API=require('../../API')
var app = getApp()
Page( {
  data: {
    winWidth: 0,
    winHeight: 0,
    currentTab: 0,
  },
  upper: function(e) {
  },
  lower: function(e) {
  },
  scroll: function(e) {
  },
  onLoad: function(option) {
    var id = option.id;
    this.setData({
      currentTab: id
    })
    var self = this
    new app.WeToast()
    tools.mta.Page.init()
    // 获取系统信息
    wx.getSystemInfo( {
      success: function( res ) {
        self.setData( {
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        })
      }
    })
  },
  onShow: function(){
    var self = this
    self.getHotelList()
  },
  // * 滑动切换tab
  bindChange: function( e ) {
    var self = this
    self.setData( { currentTab: e.detail.current })
  },
  // 点击tab切换
  swichNav: function( e ) {
    var self = this
    if( this.data.currentTab === e.target.dataset.current ) {
      return false
    } else {
      self.setData( {
        currentTab: e.target.dataset.current
      })
    }
  },
  // 获取常住/收藏
  getHotelList: function(){
    var self = this
    var requestSize=2;
    wx.showLoading({
      title: '正在加载...',
      icon: 'loading'
    })
    var data = {};
    if(wx.getStorageSync('lat') && wx.getStorageSync('lon')){
      data = {
        lat: wx.getStorageSync('lat'),
        lon: wx.getStorageSync('lon'),
        member_id:app.globalData.memberId,
      }
    }else{
      data={
        member_id:app.globalData.memberId,
      }
    }
    // 常住
    tools.saveJAVA({
      url:API.getUsuallyHotelInfo,
      data:data,
      success(res){
        console.log(res)
        // 请求完成数量=0 loading消失
        requestSize-=1;
        if(requestSize==0){
          wx.hideLoading()
        }
        let list=[];
        if(res.data.errorCode == 50100 || res.data.errorCode == 30101){
          list=[]
        }else {
          list=res.data;
        }
        self.setData({
          getMemUsuHotel: list
        })
      },
      fail(err) {
        console.log(err)
        wx.hideLoading()
        wx.showModal({
          title:'提示',
          content:'系统错误，请稍后再试！',
          showCancel:false
        })
      }
    })

    // 收藏
    tools.saveJAVA({
      url:API.getCollectedHotelList,
      data:data,
      success(res){
        console.log(res)
        // 请求完成数量=0 loading消失
        requestSize-=1;
        if(requestSize==0){
          wx.hideLoading()
        }
        let list=[];
        if(res.data.errorCode == 50100 || res.data.errorCode == 30101){
          list=[]
        }else {
          list=res.data;
        }
        self.setData({
          colGet: list
        })
      },
      fail(err) {
        console.log(err)
        wx.hideLoading()
        wx.showModal({
          title:'提示',
          content:'系统错误，请稍后再试！',
          showCancel:false
        })
      }
    })
  },
  // 打开酒店详情页面
  openHotelDetail: function(e){
    let position='';
    if (this.data.currentTab==0){
      position = '我的酒店-常住';
    } else if (this.data.currentTab == 1){
      position = '我的酒店-收藏';
    }
    wx.reportAnalytics('to_hotel_detail', {
      to_hotel_detail_hid: app.globalData.AAid,
      to_hotel_detail_position: position,
    });
    wx.navigateTo({
      url: "../hotel-detail/hotel-detail?id="+e.currentTarget.dataset.id+'&page=1'
    })
  },
})
