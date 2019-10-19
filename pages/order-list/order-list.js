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
  onLoad: function(option) {
    this.setData({
      currentTab: option.id
    })
    var self = this
    new app.WeToast()
    tools.mta.Page.init()
    // 获取系统信息
    wx.getSystemInfo( {
      success: function( res ) {
        self.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        })
      }
    })
  },
  onShow: function(){
    var self = this
    //清除缓存中优惠券
    wx.removeStorageSync('chooseCoupons');
    self.searchOrderByMemNo()
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
  // 根据用户卡号查询订单列表
  searchOrderByMemNo: function(){
    var self = this
    wx.showLoading({
      title:'加载中',
      mask:true,
    })
    var data = {
      memberId: wx.getStorageSync('memberId'),
      pageIndex: 1,
      pageSize: 20,
    }

    // 新全部订单
    tools.saveJAVA({
      url:API.queryOrderList,
      data:{
        memberId:app.globalData.memberId
      },
      success(res){
        wx.hideLoading()
        let list=res.data.data;
        // 测试 删
        // list=list.slice(4,7)
        // 删 end
        let data=self.getDays(list);
        self.setData({
          searchOrderByMemNo1: data
        })
      },
      fail: function(err) {
        console.log(err)
        wx.hideLoading()
        wx.showModal({
          title:'提示',
          content:'系统错误，请稍后再试！',
          showCancel:false
        })
      }
    })
    // 新待评价
    tools.saveJAVA({
      url:API.queryOrderList,
      data:{
        pay_status:2,
        // comment_status:0,
        memberId:app.globalData.memberId,
      },
      success(res){
        console.log(res)
        let list=res.data.data;
        // 测试 删
        // list=list.slice(4,7)
        // 删 end
        let data=self.getDays(list);
        self.setData({
          searchOrderByMemNo3: data
        })
      },
      fail: function(err) {
        console.log(err)
        wx.hideLoading()
        wx.showModal({
          title:'提示',
          content:'系统错误，请稍后再试！',
          showCancel:false
        })
      }
    })
    // 新待付款
    tools.saveJAVA({
      url:API.queryOrderList,
      data:{
        pay_status:1,
        memberId:app.globalData.memberId,
      },
      success(res){
        console.log(res)
        let list=res.data.data;
        // 测试 删
        // list=list.slice(4,7)
        // 删 end
        let data=self.getDays(list);
        self.setData({
          searchOrderByMemNo2: data
        })
      },
      fail: function(err) {
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

  /**
   * 计算间夜数
   * @param {list} arr 订单列表数组 
   */
  getDays(list){
    let dayMS = 24*60*60*1000;
    for (const i in list) {
      if(!list[i].openType){
        list[i].openType=1;
      }
      // 测试 删
      // if(list[i].begin_time=="0000-00-00" || !list[i].begin_time){
      //   list[i].begin_time='2019-03-11'
      //   list[i].end_time='2019-03-12'
      // }
      // 删 end
      // 全日房
      if(list[i].openType==1){
        // begin_time 入住
        let begin=new Date(list[i].begin_time.replace(/-/g, "/")).getTime();
        // end_time 退房
        let end=new Date(list[i].end_time.replace(/-/g, "/")).getTime();
        let day=(end-begin)/dayMS;
        day=Math.floor(day);
        list[i].days=day;
      }else{
        list[i].days=0;
      }
    }
    return list
  },

  // 打开订单详情页面
  openOrderDetail: function(e){
    // 新埋点
    let position ='订单列表-';
    if (this.data.currentTab==0){
      position = '订单列表-全部订单';
    } else if (this.data.currentTab == 1){
      position = '订单列表-待付款订单';
    } else if (this.data.currentTab == 2){
      position = '订单列表-待评价订单';
    }
    wx.reportAnalytics('to_hotel_detail', {
      to_hotel_detail_hid: app.globalData.AAid,
      to_hotel_detail_position: '订单列表',
    });
    wx.navigateTo({
      url: `../order-details/order-details?tradeId=${e.currentTarget.dataset.id}&cid=${e.currentTarget.dataset.cid}&pay=${e.currentTarget.dataset.pay}&hid=${e.currentTarget.dataset.hid}`
    })
  },
  // 打开支付页面
  payBtn: function(e){
    var self = this
    wx.navigateTo({
      // url: '../payment/payment?trade_id='+e.currentTarget.dataset.id
      // url: `../payment/payment?trade_id=${e.currentTarget.dataset.id}&cid=${e.currentTarget.dataset.cid}&price=${e.currentTarget.dataset.price}`
      url: `../payment/payment?trade_id=${e.currentTarget.dataset.id}&cid=${e.currentTarget.dataset.cid}&price=${e.currentTarget.dataset.price}`
      // url: `../payment/payment?trade_id=${e.currentTarget.dataset.cid}&price=${e.currentTarget.dataset.price}`
    })
  },
  // 打开评价页面
  openCommentDetail: function(e){
    var self = this
    console.log(e);
    var url = '../lchotel-comment/lchotel-comment?trade_id='+e.currentTarget.dataset.id+'&store_title='
        +e.currentTarget.dataset.hotelname+'&store_id='+e.currentTarget.dataset.hotelid+'&address='+e.currentTarget.dataset.address+'&typeName='
        +e.currentTarget.dataset.typename;
    url = encodeURI(url)
    wx.navigateTo({
      url: url
    })
  },
  // 打开取消订单页面
  openCancelDetail: function(e){
    wx.navigateTo({
      // url: `../cancel-order/cancel-order?tradeId=${e.currentTarget.dataset.id}&cid=${e.currentTarget.dataset.cid}&hid=${e.currentTarget.dataset.hid}`
      url: `../cancel-order/cancel-order?tradeId=${e.currentTarget.dataset.id}&cid=${e.currentTarget.dataset.cid}&hid=${e.currentTarget.dataset.hid}`
      // url: `../cancel-order/cancel-order?tradeId=${e.currentTarget.dataset.cid}&hid=${e.currentTarget.dataset.hid}`
    })
  },
})