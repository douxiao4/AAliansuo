// vipPackage/pages/suggestionList/suggestionList.js
var tools = require('../../../tools');
var API = require('../../../API');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 头图
    // topImg:'',
    // 背景图
    // pageBg: '',
    // 酒店列表
    list: [],
    myAdd:{
      lat:'undefined',
      lon:'undefined',
    },
    tapName:null,
  },

  /* 自己的 */
  /* 跳订房 */
  toBuyRoom(e){
    let aHid=e.currentTarget.dataset.item.aHid;
    // 埋点
    let tapName=e.currentTarget.dataset.item.name;
    let hid = app.globalData.AAid;
    let AARid = app.globalData.AARid;
    console.log(hid)
    console.log(AARid)
    // this.setData({
    //   tapName
    // })
    
    wx.reportAnalytics('suggestion_list_taphotel', {
      suggestion_list_hname: tapName,
      suggestion_list_hid: hid,
      suggestion_list_rid: AARid,
    });
    // 埋点end
    wx.navigateTo({
      url: `../../../pages/hotel-detail/hotel-detail?id=${aHid}`
    })
  },

  /* 获取客户位置 */
  getAdd() {
    let that=this;
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.userLocation']) {
          wx.authorize({
            scope: 'scope.userLocation',
            success() {
              that.getLocation();
            },
            fail(err) {
              console.log(err)
              that.getList();
            }
          })
        } else {
          that.getLocation();
        }
      }
    })
  },


  /* 获得授权后 获取坐标 */
  getLocation(){
    let that=this;
    wx.getLocation({
      type: 'wgs84',
      success(res) {
        let myAdd={};
        myAdd.lat = res.latitude;
        myAdd.lon = res.longitude;
        wx.setStorageSync('lon', myAdd.lon)
        wx.setStorageSync('lat', myAdd.lat)
        that.getList(myAdd.lat,myAdd.lon);
      }
    })
  },

  /* 获取酒店列表 */
  getList(lat='undefined',lon='undefined') {
    wx.showLoading({
      title: '加载中',
      mask: true,
    })
    let that = this;
    tools.savePHP({
      url: API.recommendedHotel,
      data:{
        lat,
        lon
      },
      success: function(res) {
        wx.hideLoading()
        let msg=res.data.data[0];
        let list=msg.recommendedHotel;
        for(let i=0;i<list.length;i++){
          // 标签
          let tagList=list[i].labels;
          tagList=that.getItemTag(4,tagList);
          list[i].labels=tagList;
          // 距离
          let distance=list[i].distance;
          distance=that.getDistance(distance);
          list[i].distance=distance;
          // 评分
          let recommend = list[i].recommend;
          list[i].scoreArr = tools.convertToStarsArray(recommend);
          list[i].score = '推荐指数：';
          
        }
        that.setData({
          list
        })
      }
    })
  },

  /**
   * 拆距离
   * @param {weight} num 距离 单位：米
   */
    getDistance(distance=0){
      if (distance == 0 || +distance == -1) {
        return 0
      } else {
        distance = (distance/1000).toFixed(1);
        if(distance>=10000){
          distance=`大于1万`
        }
      }
      return distance
    },

  /**
   * 拆tag
   * @param {num} number，显示几个tag 
   * @param {tagList} arr,原始tag列表
   */
  getItemTag(num = 5, tagList = []) {
    let tags = tagList;
    if (tagList.length > num) {
      tags = tagList.splice(0, num);
      tags.push({label:'··'});
    }
    return tags
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getAdd();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    // 页面回到顶端
    if (wx.pageScrollTo) {
      wx.pageScrollTo({
        scrollTop: 0
      })
    }
    // this.getAdd()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})