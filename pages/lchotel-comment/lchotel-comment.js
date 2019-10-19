// pages/lchotel-comment/lchotel-comment.js
var tools = require('../../tools.js')
var API = require('../../API')
var app = getApp()
var config = require('../../config.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    face: '',
    red: [0, 0, 0, 0, 0, 0, 0],
    commentHyg: '',
    face: [0, 0, 0],
    text: '请评价入住满意度'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    wx.removeStorageSync('faces');
    wx.removeStorageSync('comments');
    wx.removeStorageSync('value');
    wx.removeStorageSync('star');
    console.log(options);
    this.setData({
      info: [decodeURI(options.store_title), decodeURI(options.typeName), decodeURI(options.address)],
      hotelId: options.store_id,
      orderNo: options.trade_id
    })

  },
  changeRed: function (e) {
    console.log(e.currentTarget.dataset.id);
    var id = e.currentTarget.dataset.id;
    var values = ['干净卫生', '服务态度好', '免费早餐', '出行方便', '安静', '环境好', '设施齐全', '入住快'];
    var red = this.data.red;
    var comments = [];
    red[id * 1] = red[id * 1] == 0 ? 1 : 0;
    console.log(red);
    red.forEach((el, i) => {
      if (el == 1) {
        comments.push(values[i]);
      }
    });
    wx.setStorageSync('comments', comments);
    this.setData({
      red: red
    })
    this.getConformText();
  },
  tapStar: function (e) {
    var commentHyg = e.currentTarget.dataset.id
    this.setData({
      commentHyg: commentHyg
    })
    wx.setStorageSync('star', commentHyg);
    this.getConformText();
  },
  goTop: function (e) {
    if (wx.pageScrollTo) {
      wx.pageScrollTo({
        scrollTop: 300
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }
  },
  getFace: function (e) {
    console.log(e);
    var id = e.currentTarget.dataset.id;
    var face = this.data.face;
    var faces = ['吐槽', '满意', '超赞'];
    face[id] = face[id] == 0 ? 1 : 1;
    if (face[id] == 1) {
      face.forEach((el, i) => {
        face[i] = 0;
      })
      face[id] = 1;
    }
    this.setData({
      face: face
    })
    wx.setStorageSync('faces', faces[id]);
    this.getConformText();
  },
  bindInput: function (e) {
    console.log(e.detail.value);
    var value = e.detail.value;
    wx.setStorageSync('value', value);
    this.getConformText();
  },
  getConformText: function () {
    var that = this;
    if (wx.getStorageSync('faces') || wx.getStorageSync('comments') || wx.getStorageSync('value') || wx.getStorageSync('star')) {
      that.setData({
        text: '提交'
      })
    }
  },
  commentConform: function () {
    var that = this;
    if (this.data.text != '提交') {
      wx.showToast({
        title: '请选择或输入评价',
        icon: 'none',
      })
      return;
    } else {
      wx.showToast({
        title: '正在提交评论...',
        icon: 'none',
        mask: true
      })
      if (!wx.getStorageSync('value')) {
        var values = '';
        if (1 * wx.getStorageSync('star') >= 4) {
          values = wx.getStorageSync('comments') || ['干净卫生', '服务态度好'];
        } else if (1 * wx.getStorageSync('star') < 4) {
          values = wx.getStorageSync('comments') || ['再接再厉'];
        }
        var value = values.join(',');
        wx.setStorageSync('value', value);
      }
      if (!wx.getStorageSync('star')) {
        // var face = wx.getStorageSync('faces') || '满意';
        // switch (face){
        //   case '吐槽':
        //     wx.setStorageSync('star', 3);
        //     break;
        //   case '满意':
        //     wx.setStorageSync('star', 4);
        //     break;
        //   case '超赞':
        //     wx.setStorageSync('star', 5);
        //     break;
        // }
        wx.showToast({
          title: '入住满意度的星星必选哦！',
          icon: 'none',
          mask: true,
          duration: 2500
        })
        return false;
      }
      let data = {
        member_id: app.globalData.memberId,
        hotel_id: that.data.hotelId,
        order_id: that.data.orderNo,
        utility: wx.getStorageSync('star'),
        comment_text: wx.getStorageSync('value'),
      }
      tools.saveJAVAjson({
        url: API.insertMemberComment,
        data,
        success: function (res) {
          console.log(res)
          wx.hideToast();
          wx.navigateBack({
            delta: 1, // 回退前 delta(默认为1) 页面
            success: function (res) {
              // success
              wx.showToast({
                title: '评论成功',
                icon: 'success',
                mask: true,
              })
            },
          })
        },
        fail(err){
          wx.hideToast();
          console.log(err)
        }
      })
      // var data = {
      //   commentEnv: wx.getStorageSync('star'),  // 环境
      //   commentHyg: wx.getStorageSync('star'), // 卫生
      //   commentSer: wx.getStorageSync('star'), // 服务
      //   utility: wx.getStorageSync('star'), // 设施
      //   commentText: wx.getStorageSync('value'),
      //   hotelId: that.data.hotelId,
      //   memberId: wx.getStorageSync('memberId'),
      //   orderNo: that.data.orderNo,
      //   roomTypeCode: '',
      //   roomTypeName: '',
      //   tourType: '1',
      // }
      // tools.save({
      //   url: '/commentResource/v1.1/commentAdd',
      //   data: data,
      //   success: function(res) {
      //     if(res.data.retCode == 200){
      //       wx.hideToast();
      //       setTimeout(function(){
      //         wx.navigateBack()
      //       },1000)
      //     }else{
      //       wx.showToast({
      //         title: res.data.retMsg,
      //         icon: 'none'
      //       })
      //     }
      //   }
      // })
    }
  }
})