// pages/lcexchange/lcexchange.js
var tools = require('../../tools.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShow: false,
    copnum: 1,
    isMax: false,
    exchangeFlag: 1,
    exchangeTitle:'立即兑换',
    isTrue: false,
    isGrOne: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options);
    var integral = options.integral || 0;
    this.setData({
      integral: integral
    })
    this.getInfos();
  },
  getInfos: function() {
    var that = this;
    wx.showLoading({
      title: '正在加载...'
    })
    tools.save({
      url: '/couponResource/v1.1/getCouponType',
      data: {
        memberId: wx.getStorageSync('memberId')
      },
      success: function(res) {
        wx.hideLoading();
        console.log(res);
        that.setData({
          integrals: res.data.retValue
        })
      }
    })
  },
  exchange: function(e) {
    // console.log(e)
    if(this.data.integral*1 < e.currentTarget.dataset.intergrate*1){
      this.setData({
        exchangeTitle: '积分不足'
      })
      wx.showModal({
        title: '温馨提示',
        content: '您的积分不足',
        showCancel: false,
      })
      return false; 
    }else if(Math.floor(this.data.integral*1/e.currentTarget.dataset.intergrate*1)<=1){
      this.setData({
        isGrOne: false
      })
    }else {
      this.setData({
        isGrOne: true
      })
    }
    
    var maxnum = Math.floor(this.data.integral/e.currentTarget.dataset.intergrate);
    // console.log(maxnum);
    this.setData({
      copnum: 1,
      isShow: true,
      money: e.currentTarget.dataset.money,
      intergrate: e.currentTarget.dataset.intergrate,
      maxnum: maxnum,
      id: e.currentTarget.dataset.id
    })
  },
  clmnum: function() {
    var copnum = this.data.copnum <= 1? 1:this.data.copnum-1;

    this.setData({
      copnum: copnum
    })
  },
  addnum: function() {
    // if(this.data.integral*1 - (this.data.copnum+1)*this.data.intergrate < this.data.intergrate) {
    //   this.setData({
    //     isTrue : true
    //   })
    // }
    var copnum = this.data.copnum >= this.data.maxnum? this.data.maxnum : this.data.copnum+1
    copnum =  copnum == 0? 1 : copnum;
    this.setData({
      copnum: copnum
    })
  },
  fristcancle: function() {
    this.setData({
      isShow: false
    })
  },
  exchangeConform: function() {
    if(this.data.exchangeFlag == 0 || this.data.exchangeTitle == '积分不足'){
      return false;
    }
    this.setData({
      exchangeFlag : 0
    })
    wx.showLoading({
      title: '正在兑换...',
      mask: true
    })
    var that = this;
    var couponTypeId = this.data.id;
    var memberId = wx.getStorageSync('memberId');
    var totalIntegrate = this.data.integral;
    var couponNumber = this.data.copnum;
    tools.save({
      url: '/couponResource/v1.1/exchangeCoupon',
      data:{
        couponTypeId: couponTypeId,
        memberId: memberId,
        totalIntegrate: totalIntegrate,
        couponNumber: couponNumber
      },
      success: function(res) {
        console.log(res);
        wx.hideLoading();
        if(res.data.retCode == 200){
          wx.showModal({
            // title: '兑换'+that.data.money+'元优惠券',
            // title: '您已成功兑换'+that.data.copnum+'张'+that.data.money+'元优惠券。',
            content: '您已成功兑换'+that.data.copnum+'张'+that.data.money+'元优惠券。',
            cancelText: '返回',
            confirmText: '查看',
            success: function(res) {
              that.setData({
                exchangeFlag: 1
              })
              if(res.confirm){
                wx.navigateTo({
                  url: '../lccoupons/lccoupons?page=3'
                })
              }
            }
          })
          var integral = that.data.integral*1 - that.data.copnum*that.data.intergrate;
          that.setData({
            integral: integral,
            isShow: false
          })
          wx.setStorageSync('integral', integral);
        }else {
          wx.showToast({
            title: res.data.retMsg,
            icon: 'none',
            mask: true
          })
          that.setData({
            exchangeFlag: 1
          })
        }
      }
    })
  }
})