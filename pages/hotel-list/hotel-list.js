var config = require('../../config.js')
var tools = require('../../tools.js')
var app = getApp()

Page({
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
    index: wx.getStorageSync('index')?wx.getStorageSync('index'):0,
    openType: 1,
  },
  onLoad: function(option){

  },
  onShow: function(){
    var self = this
    new app.WeToast()
    tools.mta.Page.init()
    self.setData({
      pageIndex: 1,
      keyword: wx.getStorageSync('keyword'),
      openType: wx.getStorageSync('openType')
    })
    self.queryHotelList()
    self.getFilterData()
    // 获取系统宽高
    wx.getSystemInfo( {
      success: function( res ) {
        self.setData( {
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        })
      }
    })
  },
  getFilterData: function(){
    var self = this
    tools.save({
      url: '/hotelResource/v1.1/hotelsearchType',
      data: '',
      success: function(res) {
        self.setData({
          hotelsearchType: res.data.retValue
        })
      }
    })
    tools.save({
      url: '/commonResource/v1.1/getCountyByCity',
      data: {
        cityName: wx.getStorageSync('cityName')
      },
      success: function(res) {
        var county = ['不限']
        for(let i=0;i<res.data.retValue.length;i++){
          county.push(res.data.retValue[i].name)
        }
        self.setData({
          getCountyByCity: res.data.retValue,
          county: county
        })
      }
    })
    tools.save({
      url: '/commonResource/v1.1/getQuerySortType',
      data: '',
      success: function(res) {
        self.setData({
          getQuerySortType: res.data.retValue
        })
      }
    })
  },
  // 下拉刷新
  onPullDownRefresh: function(){
    setTimeout(function(){
      wx.stopPullDownRefresh()
    },2000)
  },
  // 上拉加载
  onReachBottom: function(){
    this.queryMoreHotelList()
  },
  // 设置页面标题
  setNavigationBarTitle: function(title){
    wx.setNavigationBarTitle({
      title: title
    })
  },
  // 加载第一页
  queryHotelList: function(){
    var self = this
    self.wetoast.toast({
      title: '加载中...',
      duration: 60000
    })
    self.getQueryHotelList(function(res){
      if(res.data.retValue.hotelList.length>0){
        self.setData({
          hasHotelList: true
        })
      }else{
        self.setData({
          hasHotelList: false
        })
      }
      for(var i=0;i<res.data.retValue.hotelList.length;i++){
        res.data.retValue.hotelList[i].serviceNames = res.data.retValue.hotelList[i].serviceName?res.data.retValue.hotelList[i].serviceName.split(','):[]
      }
      self.setData({
        hotelCount: res.data.retValue.hotelCount,
        hotelList: res.data.retValue.hotelList
      })
      self.setNavigationBarTitle((wx.getStorageSync('cityName')?wx.getStorageSync('cityName'):config.DEFAULT_CITY)+'('+res.data.retValue.hotelCount+'家)')
      self.wetoast.toast()
      self.setData({
        pageIndex: 2
      })
    })
  },
  // 分页加载
  queryMoreHotelList: function(){
    var self = this
    if( Math.ceil(this.data.hotelCount/config.PAGE_SIZE) < this.data.pageIndex ){
      self.wetoast.toast({
        title: '已全部加载完毕',
      })
      return false
    }
    self.wetoast.toast({
      title: '加载中...',
    })
    self.getQueryHotelList(function(res){
      for(var i=0;i<res.data.retValue.hotelList.length;i++){
        res.data.retValue.hotelList[i].serviceNames = res.data.retValue.hotelList[i].serviceName?res.data.retValue.hotelList[i].serviceName.split(','):[]
      }
      self.setData({
        hotelList: self.data.hotelList.concat(res.data.retValue.hotelList)
      })
      self.wetoast.toast()
      if(res.data.retValue.hotelList.length != 0){
        self.setData({
          pageIndex: self.data.pageIndex + 1
        })
      }
    })
  },
  // 获取数据
  getQueryHotelList: function(fn){
    var self = this
    var data = {
      brandNameList: self.data.brandNameList,
      serviceNameList: self.data.serviceNameList,
      distance: self.data.distance,
      commentLeave: self.data.commentLeave,
      beginDate: wx.getStorageSync('checkIn')?wx.getStorageSync('checkIn'):tools.getDateStr(0),
      endDate: wx.getStorageSync('checkOut')?wx.getStorageSync('checkOut'):tools.getDateStr(1),
      cityName: wx.getStorageSync('cityName')?wx.getStorageSync('cityName'):config.DEFAULT_CITY,
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

    tools.save({
      url: '/hotelResource/v1.1/queryHotelList',
      data: data,
      success: function(res) {
        cosole.log(res);
        fn(res)
      }
    })
  },
  // 打开酒店详情
  openHotelDetail: function(e){
    return
    wx.navigateTo({
      url: "../hotel-detail/hotel-detail?hotelId="+e.currentTarget.dataset.id
      // url: "../hotel-detail/hotel-detail?hotelId=00650"
    })
  },
  // 收藏页面
  collectHotel: function(e){
    var self = this
    var dataset = e.currentTarget.dataset
    if(dataset.iscollect == 1){
      // 已收藏的
      self.colDel(dataset)
    }else if(dataset.iscollect == 2){
      // 未收藏
      if( wx.getStorageSync('memberId') ){
        // 未收藏已登录
        self.colAdd(dataset)
      }else {
        // 调用登录
        wx.navigateTo({
          url: '../login/login'
        })
      }
    }
  },
  // 收藏
  colAdd (obj) {
    var self = this
    var data = {
      memberId: wx.getStorageSync('memberId'),
      hotelId: obj.id
    }
    tools.save({
      url: '/colResource/v1.1/colAdd',
      data: data,
      success: function(res) {
        if(res.data.retCode == 200){
          self.wetoast.toast({
            title: '收藏成功！',
          })
          var hotelList = self.data.hotelList
          hotelList[obj.index].isCollection = 1
          self.setData({
            hotelList: hotelList
          })
        }else{
          self.wetoast.toast({
            title: res.data.retMsg,
          })
        }
      }
    })
  },
  // 取消收藏
  colDel (obj) {
    var self = this
    var data = {
      memberId: wx.getStorageSync('memberId'),
      hotelId: obj.id
    }
    tools.save({
      url: '/colResource/v1.1/colDel',
      data: data,
      success: function(res) {
        if(res.data.retCode == 200){
          self.wetoast.toast({
            title: '取消收藏成功！',
          })
          var hotelList = self.data.hotelList
          hotelList[obj.index].isCollection = 2
          self.setData({
            hotelList: hotelList
          })
        }else{
          self.wetoast.toast({
            title: res.data.retMsg,
          })
        }
      }
    })
  },
  // 打开筛选面板
  showHotelsearchType: function(){
    var self = this
    self.setData({
      showHotelsearchType: !self.data.showHotelsearchType
    })
  },
  // 筛选面板确定键
  selectHotelSearchType: function(){
    var self = this
    self.setData({
      showHotelsearchType: !self.data.showHotelsearchType
    })
    self.resetSearchList()
  },
  // 选择字段
  selectField: function(e){
    var dataset = e.currentTarget.dataset
    var self = this
    if(dataset.indexc == '-1'){
      // return false
    }
    switch (dataset.field) {
      // 品牌
      case 'brand':
        var hotelsearchType = self.data.hotelsearchType
        if(dataset.indexc == '-1'){
          for(let i=0;i<hotelsearchType[dataset.indexp].data.length;i++){
            hotelsearchType[dataset.indexp].data[i].isSelected = false
          }
          self.setData({
            hotelsearchType: hotelsearchType,
            brandNameList: []
          })
          return false
        }
        hotelsearchType[dataset.indexp].data[dataset.indexc].isSelected = !hotelsearchType[dataset.indexp].data[dataset.indexc].isSelected
        self.setData({
          hotelsearchType: hotelsearchType
        })
        var arr = []
        for(let i=0;i<hotelsearchType[dataset.indexp].data.length;i++){
          if( hotelsearchType[dataset.indexp].data[i].isSelected ){
            arr.push(hotelsearchType[dataset.indexp].data[i].name)
          }
        }
        self.setData({
          brandNameList: arr
        })
        break
      // 距离
      case 'distance':
        var hotelsearchType = self.data.hotelsearchType
        for(let i=0;i<hotelsearchType[dataset.indexp].data.length;i++){
          hotelsearchType[dataset.indexp].data[i].isSelected = false
        }
        if(dataset.indexc == '-1'){
          self.setData({
            hotelsearchType: hotelsearchType,
            distance: ''
          })
          return false
        }
        hotelsearchType[dataset.indexp].data[dataset.indexc].isSelected = !hotelsearchType[dataset.indexp].data[dataset.indexc].isSelected
        var jl = (dataset.name.substring(0,dataset.name.length-2))*1000
        self.setData({
          hotelsearchType: hotelsearchType,
          distance: jl==0?('0-*'):('0-'+jl)
        })
        break
      // 服务
      case 'service':
        var hotelsearchType = self.data.hotelsearchType
        if(dataset.indexc == '-1'){
          for(let i=0;i<hotelsearchType[dataset.indexp].data.length;i++){
            hotelsearchType[dataset.indexp].data[i].isSelected = false
          }
          self.setData({
            hotelsearchType: hotelsearchType,
            serviceNameList: []
          })
          return false
        }
        hotelsearchType[dataset.indexp].data[dataset.indexc].isSelected = !hotelsearchType[dataset.indexp].data[dataset.indexc].isSelected
        self.setData({
          hotelsearchType: hotelsearchType
        })
        var arr = []
        for(let i=0;i<hotelsearchType[dataset.indexp].data.length;i++){
          if( hotelsearchType[dataset.indexp].data[i].isSelected ){
            arr.push(hotelsearchType[dataset.indexp].data[i].name)
          }
        }
        self.setData({
          serviceNameList: arr
        })
        break
      // 点评
      case 'score':
        var hotelsearchType = self.data.hotelsearchType
        for(let i=0;i<hotelsearchType[dataset.indexp].data.length;i++){
          hotelsearchType[dataset.indexp].data[i].isSelected = false
        }
        if(dataset.indexc == '-1'){
          self.setData({
            hotelsearchType: hotelsearchType,
            commentLeave: ''
          })
          return false
        }
        hotelsearchType[dataset.indexp].data[dataset.indexc].isSelected = !hotelsearchType[dataset.indexp].data[dataset.indexc].isSelected
        self.setData({
          hotelsearchType: hotelsearchType
        })
        var leaveNum = ''
        if(dataset.name=='好评'){
          leaveNum = 3
        }else if(dataset.name=='中评'){
          leaveNum = 2
        }else if(dataset.name=='差评'){
          leaveNum = 1
        }else {
          leaveNum = ''
        }
        self.setData({
          commentLeave: leaveNum
        })
        break
    }
  },
  // 打开位置区域面板
  showGetCountyByCity: function(e){
    var self = this
    this.setData({
      index: e.detail.value,
      keyword: e.detail.value==0?'':self.data.county[e.detail.value]
    })
    wx.setStorageSync('index',e.detail.value)
    wx.setStorageSync('keyword',e.detail.value==0?'':self.data.county[e.detail.value])
    self.resetSearchList()
  },
  // 打开排序面板
  showGetQuerySortType: function(){
    var self = this
    this.setData({
      showSortWrap: !self.data.showSortWrap
    })
  },
  // 选择排序-事件
  selectQuerySortType: function(e){
    var self = this
    self.showGetQuerySortType()
    self.setData({
      sortOpt: e.currentTarget.dataset.opt,
      sortType: e.currentTarget.dataset.type
    })

    self.resetSearchList()
  },
  // 筛选条件改变后重置搜索列表
  resetSearchList: function(){
    var self = this
    self.setData({
      pageIndex: 1
    })
    self.queryHotelList()
  },
})