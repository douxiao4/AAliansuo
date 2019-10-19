// pages/lcusercomment/lcusercomment.js
var tools = require('../../tools.js');
var API = require('../../API.js')
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    getHotelInfo: {},
    leave: '0',
    score:5,
    tap: {
      all: true,
      good: false,
      mid: false,
      bad: false
    },
    footText: '上拉加载更多',
    index: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    var leave = this.data.leave;
    // this.getCommentsInfo();
    this.getComments(leave, 1, 10, function(res) {
      that.setData(res)
    });
  },
  /* getCommentsInfo: function() {
    var that = this;
    tools.save({
      url: '/hotelResource/v1.1/getHotelInfo',
      data: {
        hotelId: wx.getStorageSync('hotelId'),
        lat: wx.getStorageSync('lat'),
        lon: wx.getStorageSync('lon'),
        memberId: wx.getStorageSync('memberId')
      },
      success: function(res) {
        // console.log(res);
        //处理评分的星星
        var score = res.data.retValue.baseInfo.score;
        var scoreArr = tools.convertToStarsArray(score);
        res.data.retValue.baseInfo.scoreArr = scoreArr;
        var getHotelInfo = res.data.retValue.baseInfo;
        that.setData({
          getHotelInfo: getHotelInfo
        })
        console.log(that.data.getHotelInfo);
      }
    })
  },*/
  changeTap: function(e) {
    // this.goTop();
    var that = this;
    var id = e.currentTarget.dataset.id;
    var tap = this.data.tap;
    var leave = this.data.leave;
    switch (id) {
      case '1':
        leave = '0';
        tap = {
          all: true,
          good: false,
          mid: false,
          bad: false
        }
        break;
      case '2':
        leave = '1';
        tap = {
          all: false,
          good: true,
          mid: false,
          bad: false
        }
        break;
      case '3':
        leave = '2';
        tap = {
          all: false,
          good: false,
          mid: true,
          bad: false
        }
        break;
      case '4':
        leave = '3';
        tap = {
          all: false,
          good: false,
          mid: false,
          bad: true
        }
        break;
    }
    this.setData({
      tap: tap,
      leave: leave
    })
    this.getComments(leave, 1, 10, function (res) {
      that.setData(res)
    });
  },
  getComments: function(leave, index, size, fn) {
    wx.showToast({
      title: '正在加载...',
      icon: 'loading',
      mask: true
    })
    var that = this;
    // 获取评论
    // tools.save({
    //   url: '/commentResource/v1.1/commentListHotelGet',
    //   data: {
    //     hotelId: wx.getStorageSync('hotelId'),
    //     pageIndex: index,
    //     pageSize: size,
    //     commentLeave: leave
    //   },
    //   success: function (res) {
    //     // console.log(res);
    //     //处理是否有评论
    //     var hasCom = true;
    //     if (res.data.retValue.commentCount == 0) {
    //       hasCom = false;
    //     }
    //     var list = res.data.retValue.commentList;
    //     //处理数据格式
    //     if (hasCom) {
    //       list.forEach(e => {
    //         e.commentTime = e.commentTime.split(' ')[0];
    //         e.memberId = e.memberId ? tools.changeTelNum(e.memberId) : '';
    //       });
    //     }
    //     var re = {
    //       commentCount: res.data.retValue.commentCount,
    //       // commentListHotelGet: res.data.retValue.commentList,
    //       commentlist: res.data.retValue.commentList,
    //       hasCom: hasCom
    //     }
    //     fn(re)
    //     wx.hideToast();
    //   }
    // })

    // 新获取列表
    tools.saveJAVA({
      url: API.selectMemberCommentList,
      data: {
        hotel_id: wx.getStorageSync('hotelId'),
        star_level: leave,
        pageIndex: index,
        pageSize: size,
      },
      success(res) {
        console.log(res)
        if (res.data.errorCode == 50100) {
          // "暂无数据"
          that.setData({
            hasCom: false,
            commentlist: [],
            score: 5,
          })
        } else {
          let list = res.data.data.dataList;
          list.forEach(e => {
            e.memberCardNum = e.memberCardNum ? tools.changeTelNum(e.memberCardNum) : '';
          });
          that.setData({
            commentCount: res.data.data.count,
            commentlist: list,
            hasCom: true,
            score: res.data.avg_star
          })
        }
        var re = {
          commentCount: res.data.data.count,
          commentlist: that.data.commentlist,
          hasCom: that.data.hasCom
        }
        fn(re)
        that.getStar();
        wx.hideToast();
      }
    })
    // 新获取列表end



  },
  onReachBottom: function() {
    var that = this;
    var text = '正在加载...';
    this.setData({
      footText: text
    })
    var index = this.data.index;
    
    if (Math.ceil(this.data.commentCount / 10) <= index) {
      this.setData({
        footText: '我也是有底线的'
      })
      return;
    } else {
      var commentlist = this.data.commentlist;
      var leave = this.data.leave;
      
      this.getComments(leave, ++index, 10, function(res) {
        that.setData({
          commentCount: res.commentCount,
          commentlist: commentlist.concat(res.commentlist),
          index: index
        })
      })
    }
  },
  goTop: function(e) { // 一键回到顶部
    if (wx.pageScrollTo) {
      wx.pageScrollTo({
        scrollTop: 0
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }
  },

  /**
   * 处理星星
   */
  getStar() {
    var score = this.data.score;
    var scoreArr = tools.convertToStarsArray(score);
    this.setData({
      starMsg: {
        score,
        scoreArr
      }
    })
  },

})