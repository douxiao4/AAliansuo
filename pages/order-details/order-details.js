var tools = require('../../tools.js')
var API = require('../../API')
var app = getApp()

Page({
  data: {
    order_no: '',
    openType: 1,
  },
  onLoad: function(option) {
    // new app.WeToast()
    tools.mta.Page.init()
    /**
     * 新增
     */
    let that = this;
    if (option.tradeId || option.cid) {
      that.setData({
        order_no: option.tradeId,
        channel_order_no: option.cid,
        payStatus: option.pay,
        hotel_id: option.hid,
      })
      this.getOrderMsg();
      this.getInvoiceInfo();
    } else {
      wx.showModal({
        title: '提示',
        content: '缺少参数，请重新打开页面！',
        showCancel: false,
        success() {
          wx.navigateBack({
            delta: 1, // 回退前 delta(默认为1) 页面
          })
        }
      })
      return
    }
    /**
     * 新增end
     */

    // var self = this
    // if (option.tradeId) {
    //   self.setData({
    //     orderNo: option.tradeId
    //   })
    //   self.searcOrderByOrdNo()
    // } else {}
  },

  onShow: function() {
    // var self = this
    //清除缓存中的优惠券
    // wx.removeStorageSync('chooseCoupons');
    // self.searcOrderByOrdNo()
  },


  /**
   * 查询订单详情 新
   */
  getOrderMsg() {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    let that = this;
    tools.saveJAVA({
      url: API.selectOrder,
      data: {
        memberId: app.globalData.memberId,
        order_no: that.data.order_no,
        channel_order_no: that.data.channel_order_no,
      },
      success(res) {
        console.log(res)
        wx.hideLoading();
        if (res.data.error_msg == "success") {
          let msg = res.data.entity;
          console.log(1111111)
          console.log(msg)
          that.setData({
            searcOrderByOrdNo: msg
          })
        } else if (res.data.error_msg == "订单不存在") {
          wx.showModal({
            title: '提示',
            content: '订单不存在!',
            showCancel: false,
            success() {
              wx.navigateBack({
                delta: 1, // 回退前 delta(默认为1) 页面
              })
            }
          })
        }
      },
      fail(err) {
        console.log(err);
        wx.hideLoading();
      }
    })
  },

  /**
   * 订单号查发票信息
   */
  getInvoiceInfo() {
    let that = this;
    tools.saveJAVA({
      url: API.queryInvoiceInfoByOrderNo,
      data: {
        memberId: app.globalData.memberId,
        order_no: that.data.order_no,
        channel_order_no: that.data.channel_order_no,
      },
      success(res) {
        // console.log(1111111)
        // console.log(res)
        if (res.data.errorCode == '0') {
          // 无发票
          if (!res.data.data || !res.data.data.company_name) {
            that.setData({
              invoiceHead: '无'
            })
          } else {
            // 有值
            that.setData({
              invoiceHead: res.data.data.company_name,
            })
          }
        }

      }
    })
  },

  // 打开支付页面
  payBtn: function() {
    var self = this
    // console.log(self.data.page);
    wx.navigateTo({
      // url: '../payment/payment?trade_id=' + this.data.order_no
      url: `../payment/payment?trade_id=${this.data.order_no}&cid=${self.data.channel_order_no}&price=${self.data.searcOrderByOrdNo.price_total}`
      // url: `../payment/payment?trade_id=${this.data.channel_order_no}&price=${self.data.searcOrderByOrdNo.price_total}`
    })
  },
  // 取消订单页面
  openCancelDetail: function(e) {
    wx.navigateTo({
      // url: '../cancel-order/cancel-order?tradeId=' + this.data.orderNo
      // url: `../cancel-order/cancel-order?tradeId=${this.data.order_no}&cid=${this.data.channel_order_no}&hid=${this.data.hotel_id}`
      // url: `../cancel-order/cancel-order?tradeId=${this.data.order_no}&cid=${this.data.channel_order_no}&hid=${this.data.hotel_id}`
      url: `../cancel-order/cancel-order?cid=${this.data.channel_order_no}&trade_id=${this.data.order_no}&hid=${this.data.hotel_id}`
    })
  },
  // 评价页面
  openCommentDetail: function(e) {
    wx.navigateTo({
      // url: '../hotel-comment/hotel-comment?trade_id='+e.currentTarget.dataset.id+'&store_title='+e.currentTarget.dataset.hotelname+'&store_id='+e.currentTarget.dataset.hotelid
      url: '../lchotel-comment/lchotel-comment?trade_id=' + e.currentTarget.dataset.id + '&store_title=' +
        e.currentTarget.dataset.hotelname + '&store_id=' + e.currentTarget.dataset.hotelid + '&address=' + e.currentTarget.dataset.address + '&typeName=' +
        e.currentTarget.dataset.typename
    })
  },
  // 打开酒店详情页面
  openHotelDetail: function(e) {
    wx.reportAnalytics('to_hotel_detail', {
      to_hotel_detail_hid: app.globalData.AAid,
      to_hotel_detail_position: '订单详情',
    });
    wx.navigateTo({
      url: '../hotel-detail/hotel-detail?id=' + e.currentTarget.dataset.hotelid
    })
  },
})