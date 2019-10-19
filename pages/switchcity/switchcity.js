var config = require('../../config.js');
var city = require('../../utils/city.js');
var tools = require('../../tools.js');
var app = getApp()
Page({
  data: {
    searchLetter: [],
    showLetter: "",
    winHeight: 0,
    // tHeight: 0,
    // bHeight: 0,
    cityList: [],
    isShowLetter: false,
    scrollTop: 0,//置顶高度
    scrollTopId: '',//置顶id
    city: "上海",
    hotcityList: [{city:"北京"},{city:"青岛"},{city:"武汉"},{city:"广州"},{city:"深圳"},{city:"成都"},{city:"西安"},{city:"沈阳"},{city:"上海"},{city:"南京"},{city:"苏州"},{city:"杭州"}]
  },
  onLoad: function () {
    tools.mta.Page.init()
    var localCity = wx.getStorageSync('cityName')
    if(!localCity){
      //设置本地缓存中cityname为默认北京
      wx.setStorageSync('cityName', config.DEFAULT_CITY);
      localCity = config.DEFAULT_CITY
    }
    this.setData({
      city: localCity
    })
    // 生命周期函数--监听页面加载
    var searchLetter = city.searchLetter;
    var cityList = city.cityList();
    var sysInfo = wx.getSystemInfoSync();
    var winHeight = sysInfo.windowHeight;
    var itemH = winHeight / searchLetter.length;
    var tempObj = [];
    for (var i = 0; i < searchLetter.length; i++) {
      var temp = {};
      temp.name = searchLetter[i];
      temp.tHeight = i * itemH;
      temp.bHeight = (i + 1) * itemH;
      tempObj.push(temp)
    }
    this.setData({
      winHeight: winHeight,
      itemH: itemH,
      searchLetter: tempObj,
      cityList: cityList
    })

  },
  clickLetter: function (e) {
    var showLetter = e.currentTarget.dataset.letter;
    this.setData({
      showLetter: showLetter,
      isShowLetter: true,
      scrollTopId: showLetter,
    })
    var that = this;
    setTimeout(function () {
      that.setData({
        isShowLetter: false
      })
    }, 1000)
  },
  //选择城市
  bindCity: function (e) {
    this.setData({ city: e.currentTarget.dataset.city })
    wx.setStorageSync('cityName',e.currentTarget.dataset.city)
    wx.setStorageSync('keyword','')
    wx.navigateBack()
  },
  //选择热门城市
  bindHotCity: function (e) {
    this.setData({
      city: e.currentTarget.dataset.city
    })
    wx.setStorageSync('cityName',e.currentTarget.dataset.city)
    wx.setStorageSync('keyword','')
    wx.navigateBack()
  },
  //点击热门城市回到顶部
  hotCity: function () {
    this.setData({
      scrollTop: 0,
    })
  },
  //获取搜索的城市名称
  getCityName: function(e) {
    var city = e.detail.value;
    this.setData({
      searchCity: city
    })
  },
  //点击搜索按钮的逻辑
  formReset: function() {
    var city = this.data.searchCity;
    var that = this;
    var data = {
      brandNameList: [],
      serviceNameList: [],
      beginDate: wx.getStorageSync('checkIn'),
      endDate: wx.getStorageSync('checkOut'),
      cityName: city,
      openType: '1',
      pageIndex: '1',
      pageSize: 5,
      sortOpt: 1,
      sortType: 1
    }
    wx.showLoading({
      title: '正在查询...',
      icon: 'loading'
    })
    tools.save({
      url: '/hotelResource/v1.1/queryHotelList',
      data: data,
      success: function(res){
        wx.hideLoading();
        console.log(res);
        if(res.data.retCode == 200 && res.data.retValue.hotelList.length>0){
          that.setData({ city: city })
          wx.setStorageSync('cityName',city)
          wx.setStorageSync('keyword','')
          wx.navigateBack()
        }else if(res.data.retCode == 200 && res.data.retValue.hotelList.length == 0) {
          wx.showToast({
            title: '该城市暂无酒店',
            icon: 'none',
            duration: 2500,
            image: '/images/noInfo.png'
          })
        }else {
          wx.showToast({
            title: '请输入二级城市或直辖市',
            icon: 'none',
            duration: 2500
          })
        }
      }
    })

  }
})