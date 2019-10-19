// pages/lchotel-list/lchotel-list.js
var config = require('../../config.js')
var tools = require('../../tools.js')
var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    hotelCount: 0,
    hotelList: [],
    hasHotelList: true,
    // 筛选参数
    brandNameList: [],
    distance: '',
    serviceNameList: [],
    commentLeave: '',
    keyword: '',
    lat: wx.getStorageSync('lat'),
    lng: wx.getStorageSync('lon'),
    sortOpt: '',
    sortType: '',
    // 界面显示
    showContainerWrap: true,
    showHotelsearchType: false,
    showSortWrap: false,
    // 筛选条件
    hotelsearchType: '',
    getCountyByCity: [],
    county: [],
    index: wx.getStorageSync('index') ? wx.getStorageSync('index') : 0,
    openType: 1,
    CapacityOrder: true,
    DistanceOrder: false,
    PriceOrder: false,
    AllOrder: false,
    footerText: '上拉加载更多',
    isChoose: false
  },

  onShow: function () {
    var self = this;
    new app.WeToast()
    tools.mta.Page.init()
    wx.showLoading({
      title:'正在加载...'
    })
    self.setData({
      pageIndex: 1,
      keyword: wx.getStorageSync('keyword')? wx.getStorageSync('keyword'):'',
      openType: wx.getStorageSync('openType'),
      brandNameList: wx.getStorageSync('brandNameList')? wx.getStorageSync('brandNameList'):[],
      // brandNameList: ['AA ROOM'],
      serviceNameList: wx.getStorageSync('serviceNameList')? wx.getStorageSync('serviceNameList'):[],
      distance: wx.getStorageSync('distance')? wx.getStorageSync('distance'):'',
      commentLeave: wx.getStorageSync('commentLeave')? wx.getStorageSync('commentLeave'):'',
      areaList: wx.getStorageSync('area')? wx.getStorageSync('area'):[]
    })
    // self.getBrands();
    self.queryHotelList();
  },

  onHide: function() {
    // wx.removeStorageSync('keyword');
    // wx.removeStorageSync('brandNameList');
    // wx.removeStorageSync('serviceNameList');
    // wx.removeStorageSync('distance');
    // wx.removeStorageSync('commentLeave');
  },
  // 加载第一页酒店数据
  queryHotelList: function () {
    var self = this
    // this.goTop();
    self.getQueryHotelList(function (res) {
      // console.log(res);
      //判断是否获取到查询酒店
      if (res.data.retValue.hotelList.length > 0) {
        self.setData({
          hasHotelList: true
        })
      } else {
        self.setData({
          hasHotelList: false
        })
      }
      self.setData({
        hotelCount: res.data.retValue.hotelCount,
        hotelList: res.data.retValue.hotelList
      })
      self.setData({
        pageIndex: 2
      })
      wx.hideLoading();
    })
  },
  // 获取酒店列表数据
  getQueryHotelList: function (fn) {
    var self = this;
    //将数据缓存到本地
    var data = {
      brandNameList: self.data.brandNameList,
      serviceNameList: self.data.serviceNameList,
      distance: self.data.distance,
      commentLeave: self.data.commentLeave,
      beginDate: wx.getStorageSync('checkIn') ? wx.getStorageSync('checkIn') : tools.getDateStr(0),
      endDate: wx.getStorageSync('checkOut') ? wx.getStorageSync('checkOut') : tools.getDateStr(1),
      cityName: wx.getStorageSync('cityName') ? wx.getStorageSync('cityName') : config.DEFAULT_CITY,
      areaList: self.data.areaList,
      keyword: self.data.keyword,
      openType: self.data.openType,
      pageIndex: self.data.pageIndex,
      pageSize: config.PAGE_SIZE,
      sortOpt: self.data.sortOpt,
      sortType: self.data.sortType,
      lat: wx.getStorageSync('lat'),
      lon: wx.getStorageSync('lon'),
      memberId: wx.getStorageSync('memberId')
    }
    wx.showToast({
      title:'正在加载...',
      icon: 'loading',
      mask: true
    })
    // console.log(data);
    tools.save({
      url: '/hotelResource/v1.3/queryHotelList',
      data: data,
      success: function (res) {
        console.log(res);
        if(res.data.retCode == 200) {
          wx.hideToast();
          for (var i = 0; i < res.data.retValue.hotelList.length; i++) {
            //将服务转化成数组
            res.data.retValue.hotelList[i].serviceNames =
                res.data.retValue.hotelList[i].serviceName ?
                    res.data.retValue.hotelList[i].serviceName.split(',') : [];
            if (res.data.retValue.hotelList[i].serviceNames.length > 5) {
              var serviceNames = res.data.retValue.hotelList[i].serviceNames.splice(0, 5);
              serviceNames.push('··');
              res.data.retValue.hotelList[i].serviceNames = serviceNames;
            }
            //默认的酒店图片
            res.data.retValue.hotelList[i].logo? res.data.retValue.hotelList[i].logo : '/images/pic_loading@2x.png';
            if(res.data.retValue.hotelList[i].logo.indexOf('www.thankyou99.com') != -1) {
              res.data.retValue.hotelList[i].logo = '/images/pic_loading@2x.png';
            }
            //将areaName截取最后的区域
            var areaName = res.data.retValue.hotelList[i].areaName;
            areaName = areaName.split('-');
            areaName = areaName[areaName.length - 1];
            res.data.retValue.hotelList[i].areaName = areaName;
            //将距离保留一位小数
            var distance = res.data.retValue.hotelList[i].distance;
            res.data.retValue.hotelList[i].distance = (distance / 1000).toFixed(1);
            wx.hideToast();
          }
          // console.log(res);
          // console.log(res);
          fn(res)
        }else {
          // var text = res.data.retMsg;
          // wx.showToast({
          //   title: text,
          //   icon: 'none',
          // })
          wx.hideLoading();
          self.setData({
            hasHotelList: false
          })

        }
      }
    })
  },
  // 获取更多数据
  queryMoreHotelList: function () {
    var self = this
    if (Math.ceil(self.data.hotelCount / config.PAGE_SIZE) < self.data.pageIndex) {
      self.setData({
        footerText: '我也是有底线的'
      })
      return false
    }
    self.setData({
      footerText:'正在加载...',
    })
    self.getQueryHotelList(function (res) {
      self.setData({
        hotelList: self.data.hotelList.concat(res.data.retValue.hotelList),
        pageIndex: self.data.pageIndex + 1
      })
      // console.log(self.data.hotelList);
    })
  },
  // 智能排序点击事件
  getCapacityHotels: function () {
    wx.showToast({
      title:'正在加载...',
      icon: 'loading'
    })
    this.setData({
      CapacityOrder: true,
      DistanceOrder: false,
      PriceOrder: false,
      AllOrder: false,
      sortType:'',
      sortOpt: '',
      pageIndex: 1
    })
    this.queryHotelList();
  },
  // 距离排序点击事件
  getDistanceHotels: function () {
    wx.showToast({
      title:'正在加载...',
      icon: 'loading'
    })
    var sortOpt = this.data.sortOpt;
    sortOpt = sortOpt == 2 ? 1 : 2;
    this.setData({
      CapacityOrder: false,
      DistanceOrder: true,
      PriceOrder: false,
      AllOrder: false,
      sortType: 3,
      sortOpt: sortOpt,
      pageIndex: 1
    })
    this.queryHotelList();
  },
  // 价格排序点击事件
  getPriceHotels: function () {
    wx.showToast({
      title:'正在加载...',
      icon: 'loading'
    })
    var sortOpt = this.data.sortOpt;
    sortOpt = sortOpt == 2 ? 1 : 2;
    this.setData({
      CapacityOrder: false,
      DistanceOrder: false,
      PriceOrder: true,
      AllOrder: false,
      sortType: 2,
      sortOpt: sortOpt,
      pageIndex: 1
    })
    this.queryHotelList();
  },
  // 综合排序点击事件
  getAllHotels: function () {
    this.setData({
      CapacityOrder: false,
      DistanceOrder: false,
      PriceOrder: false,
      AllOrder: true
    })
    // wx.removeStorageSync('keyword');
    // wx.removeStorageSync('brandNameList');
    // wx.removeStorageSync('serviceNameList');
    // wx.removeStorageSync('distance');
    // wx.removeStorageSync('commentLeave');
    //跳转到综合排序页面
    wx.navigateTo({
      url: '/pages/lchotel-searchType1/lchotel-searchType1'
    })
  },
  //跳转到详情页面
  goToHotelDetail: function(e) {
    // console.log(e);
    var areaname = e.currentTarget.dataset.areaname;
    var distance = e.currentTarget.dataset.distance;
    var iscollection = e.currentTarget.dataset.iscollection;
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      // url: "/pages/hotel-detail/hotel-detail?areaname="+areaname+'&distance='+distance+'&iscollection='+iscollection+'&id='+id
      // url: `/pages/hotel-detail/hotel-detail?id=${id}&iscollection=${iscollection}`
      url: "/pages/hotel-detail/hotel-detail?id="+id
      // url: "/pages/hotel-detail/hotel-detail?id=00650"
      // url: "/pages/hotel-detail/hotel-detail?id=66667"
      // url: "/pages/hotel-detail/hotel-detail?id=10366"
    })
  },
  onReachBottom: function() {
    var self = this
    if (Math.ceil(self.data.hotelCount / config.PAGE_SIZE) < self.data.pageIndex) {
      self.setData({
        footerText: '我也是有底线的'
      })
      return false
    }
    self.setData({
      footerText:'正在加载...',
    })
    self.getQueryHotelList(function (res) {
      self.setData({
        hotelList: self.data.hotelList.concat(res.data.retValue.hotelList),
        pageIndex: self.data.pageIndex + 1
      })
      // console.log(self.data.hotelList);
    })
  },
  //选择品牌
  chooseBrand: function(e) {
    // console.log(e);
    var index = e.currentTarget.dataset.index;
    var brandNameList = this.data.brandNameList;
    this.data.brands[index].isChoose = !this.data.brands[index].isChoose;
    // console.log(this.data.brands);
    if(this.data.brands[index].isChoose) {
      brandNameList.push(this.data.brands[index].name);
    }else {
      tools.remove(brandNameList,this.data.brands[index].name);
    }
    this.setData({
      brands: this.data.brands,
      brandNameList: brandNameList,
      keyword:'',
      pageIndex: 1
    })
    // console.log(this.data.brandNameList);
    wx.setStorageSync('brandNameList', this.data.brandNameList);
    this.queryHotelList();
  },
  // 获取品牌信息
  getBrands: function() {
    var that = this;
    tools.save({
      url: '/hotelResource/v1.1/hotelsearchType',
      // url: '/hotelResource/v2.0/hotelsearchType',
      data: '',
      success: function (res) {
        // console.log(res);
        var brands = res.data.retValue[0].data;
        var brandNameList = that.data.brandNameList;
        // console.log(brandNameList);
        var word = '';
        if(wx.getStorageSync('keyword')){
          word = wx.getStorageSync('keyword');
        }
        brands.forEach(e => {
          if(e.name.indexOf(word) != -1 && word != '') {
            e.isChoose = true;
            brandNameList.push(e.name);
          }else if(brandNameList.indexOf(e.name) != -1 && brandNameList != []){
            e.isChoose = true;
          }else {
            e.isChoose = false;
          }
        });
        // console.log(brands);
        that.setData({
          brands: brands,
          brandNameList: brandNameList
        })
        // console.log(this.data.brandNameList);
        wx.setStorageSync('brandNameList', that.data.brandNameList);
      }
    })
  },
  onPageScroll: function (e) {
    // console.log(e);
  },
  goTop: function (e) {  // 一键回到顶部
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

})