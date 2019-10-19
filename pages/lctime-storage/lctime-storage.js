// pages/lctime-storage/lctime-storage.js
var tools = require('../../tools.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    total: true,
    income: false,
    expend: false,
    recodeInfo: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var modglod = options.modglod || 0;
    // console.log(totalglod);
    this.setData({
      modglod: modglod
    })
    this.getDetailInfo();
  },

  showStorageRule1: function () {
    wx.showModal({
      title: '',
      content: '“时间储值”是A&A生活集团金卡及以上等级的会员特权，会员在AA连锁酒店小程序预订且本人入住，在最晚离店时间前离店，将剩余时间在会员账户上进行储值，如同“时间银行”。储值的时间可兑换免费房或积分商城兑换商品。',
      showCancel: false,
      confirmText: '清楚了'
    })
  },
  showStorageRule2: function () {
    wx.showModal({
      title: '',
      content: '兑换方法：选择需要预订的酒店及房型，提交订单，支付时选择“时间储值兑换。兑换比例：24小时=1间免费百元房; 12小时=1间免费50元钟点房;1小时=200积分，商城兑换商品; 注：哑结房、钟点房不参与时间储值；时间兑换房不能与优惠券同时使用。',
      showCancel: false,
      confirmText: '清楚了'
    })
  },
  //切换收支明细事件
  getTotal: function () {
    var that = this;
    var total = true;
    var income = false;
    var expend = false;
    that.setData({
      total: total,
      income: income,
      expend: expend
    })
    this.getDetailInfo();
  },
  getIncome: function () {
    var that = this;
    var total = false;
    var income = true;
    var expend = false;
    that.setData({
      total: total,
      income: income,
      expend: expend
    })
    this.getDetailInfo();
  },
  getExpend: function () {
    var that = this;
    var total = false;
    var income = false;
    var expend = true;
    that.setData({
      total: total,
      income: income,
      expend: expend
    })
    this.getDetailInfo();
  },
  //获取明细数据
  getDetailInfo: function () {
    var status = '';
    var that = this;
    if (this.data.total) {
      status = ''
    } else if (this.data.income) {
      status = '1'
    } else if (this.data.expend) {
      status = '-1'
    }
    // console.log(status)
    //发送请求
    wx.showLoading({
      title: '正在加载...',
      icon: 'loading'
    })
    tools.save({
      url: '/storageTimeResource/v1.1/storageTimeQuery',
      data: {
        memberId: wx.getStorageSync('memberId'),
        status: status
      },
      success: function (res) {
        // console.log(res);
        if(res.data.retCode == 200) {
          wx.hideLoading();
          var recodeInfo = res.data.retValue.recordList || [];
          recodeInfo.forEach(element => {
            element.createTime = element.createTime.split(' ')[0];
            element.updateTime = element.updateTime.split(' ')[0];
          });
          that.setData({
            recodeInfo: recodeInfo
          })
        }
        // console.log(that.data.recodeInfo);
      }
    })
  }

})