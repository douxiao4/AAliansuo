var config = require('../../../API');
var tools=require('../../../tools');
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    hid: null,
    hotel_name:'',
    userName:'',
    typeList:[
      {txt:'商务出差',value:'商务出差',checked:'true'},
      {txt:'情侣出游',value:'情侣出游'},
      {txt:'家庭旅行',value:'家庭旅行'},
      {txt:'独自旅行',value:'独自旅行'},
      {txt:'朋友出行',value:'朋友出行'},
      {txt:'其他',value:'其他'},
    ],
  },

  /* 自己的 */
  // 获取姓名
  getName(e){
    // console.log(e)
    let name=e.detail.value;
    name=name.trim(); 
    this.setData({
      userName:name
    })
  },

  tapLabel(e){
    let index=e.target.dataset.index;
    let list=this.data.typeList;
    for(let i=0;i<list.length;i++){
      list[i].checked='';
    }
    list[index].checked='true';
    this.setData({
      typeList:list
    })
  },
  
  // 提交
  formSubmit: function(e) {
    
    let that = this;
    let name=this.data.userName;
    let formId=e.detail.formId;
    let openid = app.globalData.openId;
    // let hotel_name = wx.getStorageSync('hotelName');
    let hotel_name = this.data.hotel_name;
    let msg = e.detail.value;
    msg.name = name;
    msg.openid = openid;
    msg.formId = formId;
    msg.id = this.data.hid;
    msg.hotel_name = hotel_name;
    // 房客姓名不能为空
    if (!msg.name || msg.name == '') {
      wx.showModal({
        title: '提示',
        content: '房客姓名不能为空',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            // console.log('用户点击确定')
          } else if (res.cancel) {
            // console.log('用户点击取消')
          }
        }
      })
      return
    }
    // 房间号不能为空
    if (!msg.roomNum || msg.roomNum == '') {
      wx.showModal({
        title: '提示',
        content: '房间号不能为空',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            // console.log('用户点击确定')
          } else if (res.cancel) {
            // console.log('用户点击取消')
          }
        }
      })
      return
    }
    // 入住类型不能为空
    if (!msg.occupancyType || msg.occupancyType == '') {
      wx.showModal({
        title: '提示',
        content: '入住类型不能为空',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            // console.log('用户点击确定')
          } else if (res.cancel) {
            // console.log('用户点击取消')
          }
        }
      })
      return
    }
    // 反馈不能为空
    if (!msg.feedbackContent || msg.feedbackContent == '') {
      wx.showModal({
        title: '提示',
        content: '您的反馈不能为空',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            // console.log('用户点击确定')
          } else if (res.cancel) {
            // console.log('用户点击取消')
          }
        }
      })
      return
    } 
    let hid = `${this.data.hid}`;
    let hname = `${this.data.hotel_name}`;
    let rid = `${app.globalData.AARid}`;
    wx.reportAnalytics('feedback_submit', {
      feedback_submit_hid: hid,
      feedback_submit_rid: rid,
      feedback_submit_hname: hname,
    });
    
    tools.savePHP({
      url: config.problemFeedback, 
      data: msg,
      success: function (res) {
        wx.showToast({
          title: '提交成功',
          icon: "success",
          mask: true,
          complete:function(res){
            let t = setTimeout(() => {
              wx.hideToast();
              clearTimeout(t);
              wx.navigateBack({
                delta: 1, 
              })
            }, 2000);
          }
        });
      },
      fail: function (err) {
        console.log(err)
        wx.showModal({
          title: '提交出错',
          content: '提交失败，请稍后再试！',
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
              // console.log('用户点击确定')
            } else if (res.cancel) {
              // console.log('用户点击取消')
            }
          }
        })
      }
    })

  },

  /* 取酒店信息 */
  getHid(e){
    let hid=e.hid;
    let hotel_name=e.name;
    this.setData({
      hid,
      hotel_name,
    })
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getHid(options);
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
    var hid=this.data.hid;
    return {
      title: '空手到——出行服务',
      path: `pages/feedback/feedback?hid=${hid}`,
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
})