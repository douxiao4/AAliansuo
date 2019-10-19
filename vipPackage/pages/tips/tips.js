var config = require('../../../API');
var tools=require('../../../tools');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hid:'',
    showMsg: false,
    list: [],
    tit: '',
    detailMsg: {},
  },


  /* 自己的 */
  getList() {
    // let openid = wx.getStorageSync('openid');
    // console.log(app.globalData)
    
    let hid = this.data.hid;
    let that = this;
    let openid = app.globalData.openId;
    tools.savePHP({
      url: config.bulletin,
      data: {
        id: hid,
        openid: openid,
      },
      success: function (res) {
        let list = res.data.data;
        console.log(list)
        if (list.length > 0) {
          for (let i = 0; i < list.length; i++) {
            let ctime = list[i].cTime;
            list[i].cTime = tools.getTime(ctime)
            if (list[i].status == 1) {
              list[i].color = 'yellow';
            } else {
              list[i].color = '';
            }
          }
        }
        that.setData({
          list: list,
        })
      },
      fail: function (err) {
        console.log(err)
      }
    })
  },

  openMsg(e) {
    let hid = `${this.data.hid}`;
    let rid = `${this.data.AARid}`;
    wx.reportAnalytics('tips_look', {
      tips_look_hid: hid,
      tips_look_rid: rid,
    });

    let detailMsg = e.currentTarget.dataset.item;
    let content = detailMsg.content;
    content = content.replace(/\n/g, '<br/>')
    content = content.replace(/\s/g, '&nbsp;')
    content = content.replace(/<br\/>/g, '\n')
    detailMsg.content = content;
    this.setData({
      showMsg: true,
      detailMsg: detailMsg
    })
  },

  closeMsg() {
    this.setData({
      showMsg: false,
    })
  },

  good(e) {
    let hid = this.data.hid;
    let that = this;
    let item = e.currentTarget.dataset.item;
    let post_id = item.post_id;
    // status 点完==1  没点==0
    let status = item.status;
    let openid = app.globalData.openId;
    // console.log(openid)
    let newStatus = '';
    if (status == 1) {
      newStatus = 0;
    } else {
      newStatus = '1';
    }

    tools.savePHP({
      url: config.bulletinComment,
      data: {
        id: hid,
        post_id: post_id,
        openid: openid,
        behavior: newStatus,
      },
      success: function (res) {
        // console.log(res)
        let list = res.data.data;
        if (list.length > 0) {
          for (let i = 0; i < list.length; i++) {
            let ctime = list[i].cTime;
            list[i].cTime = tools.getTime(ctime)
            if (list[i].status == 1) {
              list[i].color = 'yellow';
            } else {
              list[i].color = '';
            }
          }
        }
        that.setData({
          list: list,
        })
      },
      fail: function (err) {
        console.log(err)
      }
    })
  },

  /* 取酒店id */
  getHid(e){
    let AARid = app.globalData.AARid;
    let hid=e.hid;
    let hotel_name=e.name;
    this.setData({
      hid,
      hotel_name,
      AARid
    })
  },

  
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options)
    this.getHid(options)
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
    wx.hideShareMenu();
    // this.getHid();
    this.getList();
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
  onShareAppMessage: function (res) {
    var hid = this.data.hid;
    return {
      title: '空手到——酒店公告',
      path: `pages/tips/tips?hid=${hid}`,
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
})