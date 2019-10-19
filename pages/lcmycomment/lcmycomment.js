var tools = require('../../tools.js');
var app = getApp()
var API = require('../../API')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    hasCom: true,
    text: '全文',
    short: true,
    isbegin: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getComments();
    this.getMemberInfo()
  },

  /**
   * 获取个人信息
   */
  getMemberInfo() {
    let that = this;
    tools.saveJAVA({
      url: API.getMemberInfo,
      data: {
        memberId: app.globalData.memberId,
      },
      method: 'GET',
      success: function (res) {
        console.log(res)
        wx.setStorageSync('memberInfo', res.data)
        that.setData({
          memberInfo: res.data
        })
      }
    })
  },


  getComments() {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    let that = this;
    let data = {};
    if (wx.getStorageSync('lat') && wx.getStorageSync('lon')) {
      data = {
        member_id: app.globalData.memberId,
        lat: wx.getStorageSync('lat'),
        lon: wx.getStorageSync('lon'),
      }
    }else{
      data = {
        member_id: app.globalData.memberId,
      }
    }
    tools.saveJAVA({
      url: API.getMemberCommentByEmp,
      data,
      success: function (res) {
        wx.hideLoading()
        console.log(res)
        let list = [];
        let hasCom = false;
        if (res.data.errorCode == 50100) {
          list = [];
          hasCom = false;
        } else {
          list = res.data;
          hasCom = true;
        }
        that.setData({
          commentlist: list,
          hasCom: hasCom
        })
      },
      fail: function (err) {
        console.log(err)
        wx.hideLoading()
        wx.showModal({
          title: '提示',
          content: '系统错误，请稍后再试！',
          showCancel: false
        })
      }
    })
  },

  changeshort: function (e) {
    // console.log(e);
    var id = e.currentTarget.dataset.id;
    var short = this.data.short;
    var text = this.data.text;
    text = text == '全文' ? '收起' : '全文';
    short = !short;
    this.setData({
      short: short,
      text: text,
      id: id,
      isbegin: false
    })
  },
  goToHotel: function (e) {
    console.log(e.currentTarget.dataset.id);
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/hotel-detail/hotel-detail?id=' + id
    })
  }
})