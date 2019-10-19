var tools = require('../../tools.js')
var config = require('../../config.js')
var app = getApp()

Page({
	data: {
    showRoomCount: 3,
    markers: [],
    showadcontainer: true,
    hintShow:'',
    hintHide:'',
    hotelname: {},
    aroundData: {}
  },
  // 分享功能
  // onShareAppMessage: function(){
  //   var self = this
  //   return {
  //     title: self.data.getHotelInfo.hotelName+'-AA旅行',
  //     path: '/pages/hotel-detail/hotel-detail?hotelId='+self.data.getHotelInfo.hotelId
  //   }
  // },
  onLoad: function(options){
    if(!options.id){
      options.id = wx.getStorageSync('hotelId')
    }
    console.log(options);
    var id = options.id
    console.log(options.id);
    var that = this;
    wx.request({
      url: 'https://aaroom.ihotels.cc/api/getNearBusinessByHotelId?hotel_id=' + id,
      data: '',
      method: 'get',
      header: {
        'content-type': 'application/json' //默认值
      },
      success: function (res) {
        console.log(res.data);
        // that.setData({
        //   aroundData: res.data,  
        // });
        // var hintShow = "该酒店暂无周边信息推荐"
        var hintHide = ""
        if(res.data.length > 0){
          console.log(res.data);
          that.setData({
            aroundData: res.data,
          });
        }else{
          that.setData({
            showadcontainer: false
          })
          
          // console.log(res.data.length);
          // console.log(hintShow);
          // hintShow : 'hintShow'
        }
      }
    });
    
    
    if(options.source){
      wx.setStorageSync('source', options.source);
    }
    if (options.code){      
      wx.setStorageSync('code_hotel_id', options.id);
      wx.setStorageSync('regemployee_id', options.regemployee_id);
    }
    wx.showLoading({
      icon:'loading',
      title: '正在加载...',
      mask: true,
      duration: 2500
    })
    var self = this
    //如果从收藏或者常住页面进入详情页，需要更新入住天数
    if(options.page == 1) {
      wx.setStorageSync('checkIn', tools.getDateStr(0))
      wx.setStorageSync('checkOut', tools.getDateStr(1))
    }
    wx.setStorageSync('hotelId',options.id)
    // console.dir(options);
    this.setData({
      hotelId: options.id,
      // distance: options.distance,
      // areaname: options.areaname,
      // iscollection: options.iscollection
    })
    new app.WeToast()
    tools.mta.Page.init()
    if( wx.getStorageSync('checkIn') && wx.getStorageSync('checkOut') ){
      var countDay = tools.spendDateNum(wx.getStorageSync('checkIn'),wx.getStorageSync('checkOut'))
    }else{
      var countDay = 1
    }
    var selectDate = {
      checkIn: wx.getStorageSync('checkIn')?wx.getStorageSync('checkIn'):tools.getDateStr(0),
      checkOut: wx.getStorageSync('checkOut')?wx.getStorageSync('checkOut'):tools.getDateStr(1),
      countDay: countDay,
      startDay: tools.getDateStr(0),
      endDay: tools.getDateStr(config.MAX_BOOKDAY-1),
      startDay1: tools.getDateStr(1),
      endDay1: tools.getDateStr(config.MAX_BOOKDAY),
      checkInHour: wx.getStorageSync('checkInHour')?wx.getStorageSync('checkInHour'):tools.getDateStr(0),
      lcisToday: true
    }
    self.setData({
      selectDate: selectDate,
      openType: wx.getStorageSync('')?wx.getStorageSync('openType'):1
    })
  },
  //拨打周边推荐电话
  calling: function (tel) {
    console.log(tel);
    wx.makePhoneCall({
      phoneNumber: tel.currentTarget.dataset.replyPhone,
      success: function () {
        console.log("拨打电话成功！")
      },
      fail: function () {
        console.log("拨打电话失败！")
      }
    })
  },
  
  onShow: function (){    
    var self = this;
    //获取时间
    if( wx.getStorageSync('checkIn') && wx.getStorageSync('checkOut') ){
      var countDay = tools.spendDateNum(wx.getStorageSync('checkIn'),wx.getStorageSync('checkOut'))
    }else{
      var countDay = 1
    }
    var selectDate = {
      checkIn: wx.getStorageSync('checkIn')?wx.getStorageSync('checkIn'):tools.getDateStr(0),
      checkOut: wx.getStorageSync('checkOut')?wx.getStorageSync('checkOut'):tools.getDateStr(1),
      countDay: countDay,
      startDay: tools.getDateStr(0),
      endDay: tools.getDateStr(config.MAX_BOOKDAY-1),
      startDay1: tools.getDateStr(1),
      endDay1: tools.getDateStr(config.MAX_BOOKDAY),
      checkInHour: wx.getStorageSync('checkInHour')?wx.getStorageSync('checkInHour'):tools.getDateStr(0),
      lcisToday: true
    }
    self.setData({
      selectDate: selectDate,
      openType: wx.getStorageSync('openType')?wx.getStorageSync('openType'):1
    })

    //清除缓存中优惠券
    wx.removeStorageSync('chooseCoupons');
    var self = this
    if( this.checkMemberLogin() ){
      this.setData({
        loginStatus: true
      })
      self.memberLogin()
    }
    this.setData({
      requestCount: 3
    })
    this.getDetailInfo()
  },
  // 会员信息查询
  memberLogin: function(){
    var self = this
    tools.save({
      // url: '/memberResource/v1.1/memberInfo',
      url: '/memberResource/v2.0/memberInfo',
      data: {
        memberId: wx.getStorageSync('memberId')
      },
      success: function(res) {
        // console.log(res);
        self.setData({
          memberInfo: res.data.retValue,
        })
      }
    })
  },
  onHide: function(){},
  // 打开页面请求数据
  getDetailInfo: function(options){
    options = options?options:{}
    var self = this
    // self.wetoast.toast({
    //     title: '加载中...',
    // })
    wx.showToast({
      title:'正在加载...',
      icon: 'loading',
      mask: true,
      duration: 1500
    })
    // 获取酒店详情
    tools.save({
      url: '/hotelResource/v1.1/getHotelInfo',
      data: {
        hotelId: wx.getStorageSync('hotelId'),
        lat: wx.getStorageSync('lat'),
        lon: wx.getStorageSync('lon'),
        memberId: wx.getStorageSync('memberId')
      },
      success: function(res) {
        console.log(res);
        self.setData({
          hotelname: res.data.retValue.baseInfo.hotelName
        })
        if( res.data.retCode == 200 ){
          wx.setStorage({//缓存店铺信息--宿中服务
            key:'hoteldetails',
            data: res.data.retValue.baseInfo
          })
          //处理距离
          var distance = (res.data.retValue.baseInfo.distance / 1000).toFixed(1);
          //处理区域
          var areaname = (res.data.retValue.baseInfo.areaName).split('-')[(res.data.retValue.baseInfo.areaName).split('-').length-1];
          //处理是否收藏
          var isCollection = res.data.retValue.baseInfo.isCollection;
          var latLon = tools.mapBdToTeng({
            lat:res.data.retValue.baseInfo.hotelLatitude,
            lng:res.data.retValue.baseInfo.hotelLongitude,
            success: function(latLon){
              res.data.retValue.baseInfo.hotelLatitude = latLon.lat
              res.data.retValue.baseInfo.hotelLongitude = latLon.lng
              var imgsArr = [];
              //处理图片
              if(res.data.retValue.baseInfo.hotelPic.length >= 3){
                imgsArr.push(res.data.retValue.baseInfo.hotelPic[0],
                  res.data.retValue.baseInfo.hotelPic[1],
                  res.data.retValue.baseInfo.hotelPic[2])
              }else {
                imgsArr[0] = res.data.retValue.baseInfo.hotelPic[0];
                imgsArr[1] = res.data.retValue.baseInfo.hotelPic[0];
                imgsArr[2] = res.data.retValue.baseInfo.hotelPic[0];
              }
              //遍历图片处理,对‘thankyou99’这个网址下的图片无法加载的处理
              for(var i = 0; i < imgsArr.length; i++) {
                if(imgsArr[i].indexOf('www.thankyou99.com') != -1) {
                  imgsArr[i] = '/images/pic_loading@2x.png';
                }
              }
              res.data.retValue.baseInfo.imgsArr = imgsArr;
              //处理评分的星星
              var score = res.data.retValue.baseInfo.score;
              var scoreArr = tools.convertToStarsArray(score);
              res.data.retValue.baseInfo.scoreArr = scoreArr;
              self.setData({
                getHotelInfo: res.data.retValue.baseInfo,
                distance: distance,
                areaname: areaname,
                iscollection: isCollection,
                markers: [{
                  iconPath: "http://m.ihotels.cc/app/images/miniapp/map_point.png",
                  id: 0,
                  latitude: res.data.retValue.baseInfo.hotelLatitude,
                  longitude: res.data.retValue.baseInfo.hotelLongitude,
                  width: 30,
                  height: 30
                }]
              })
              console.log(self.data.getHotelInfo);
              // self.hideToast()
              // wx.hideToast();
            }
          })
        }else{
          self.wetoast.toast({
              title: res.data.retMsg,
          })
          setTimeout(function(){
            wx.navigateBack()
          },1000)
        }
      }
    })
    // 获取酒店房型
    var data2 = {
      hotelId: wx.getStorageSync('hotelId'),
      beginDate: wx.getStorageSync('checkIn')?wx.getStorageSync('checkIn'):tools.getDateStr(0),
      endDate: wx.getStorageSync('checkOut')?wx.getStorageSync('checkOut'):tools.getDateStr(1),
      openType: self.data.openType,
      memberId: wx.getStorageSync('memberId') || ''
    }
    if(self.data.openType == 2){
      data2.beginDate = self.data.selectDate.checkInHour
      data2.endDate = tools.getDayAfterNum(self.data.selectDate.checkInHour,1)
    }
    tools.save({
      url: '/roomTypeResource/v2.0/getRoomType',
      data: data2,
      success: function(res) {
        self.setData({
          getRoomType: res.data.retValue,
          allNum: res.data.retValue.length
        })
      }
    })
  },
  
  // 打电话给酒店
  callHotel: function(){
    var self = this
    wx.makePhoneCall({
      phoneNumber: self.data.getHotelInfo.hotelTel
    })
  },
  // 打开地图
  openMap:function(){
    var self = this
    wx.openLocation({
      latitude: self.data.getHotelInfo.hotelLatitude, // 纬度，范围为-90~90，负数表示南纬
      longitude: self.data.getHotelInfo.hotelLongitude, // 经度，范围为-180~180，负数表示西经
      scale: 28, // 缩放比例          
      name: self.data.getHotelInfo.hotelName, // 位置名
      address: self.data.getHotelInfo.hotelAddress, // 地址的详细说明
    })
  },
  // 选择入住时间
  setCheckIn: function(e){
    var self = this
    var data = self.data.selectDate
    data.checkIn = e.detail.value
    data.countDay = tools.spendDateNum(e.detail.value,self.data.selectDate.checkOut)
    if(data.countDay<1){
      data.checkOut = tools.getDayAfterNum(e.detail.value,1)
      data.countDay = 1
      wx.setStorageSync('checkOut',tools.getDayAfterNum(e.detail.value,1))
    }
    if(data.countDay>config.MAX_BOOKDAY_LENGTH){
      data.countDay = config.MAX_BOOKDAY_LENGTH
      data.checkOut = tools.getDayAfterNum(e.detail.value,config.MAX_BOOKDAY_LENGTH)
      wx.setStorageSync('checkOut',tools.getDayAfterNum(e.detail.value,config.MAX_BOOKDAY_LENGTH))
    }
    self.setData({
      selectDate: data
    })
    wx.setStorageSync('checkIn',e.detail.value)
    this.setData({
      requestCount: 3
    })
    this.getDetailInfo()
  },
  // 选择离店时间
  setCheckOut: function(e){
    var self = this
    var data = self.data.selectDate
    data.checkOut = e.detail.value
    data.countDay = tools.spendDateNum(self.data.selectDate.checkIn,e.detail.value)
    if(data.countDay<1){
      data.checkIn = tools.getDayAfterNum(e.detail.value,-1)
      data.countDay = 1
      wx.setStorageSync('checkIn',tools.getDayAfterNum(e.detail.value,-1))
    }
    if(data.countDay>config.MAX_BOOKDAY_LENGTH){
      data.countDay = config.MAX_BOOKDAY_LENGTH
      data.checkIn = tools.getDayAfterNum(e.detail.value,-(config.MAX_BOOKDAY_LENGTH))
      wx.setStorageSync('checkIn',tools.getDayAfterNum(e.detail.value,-(config.MAX_BOOKDAY_LENGTH)))
    }
    self.setData({
      selectDate: data
    })
    wx.setStorageSync('checkOut',e.detail.value)
    this.setData({
      requestCount: 3
    })
    this.getDetailInfo()
  },
  // 钟点房选择入住时间
  setCheckInHour: function(e){
    var self = this
    var data = self.data.selectDate
    data.checkInHour = e.detail.value
    //用来判断是否显示‘今天’
    if (e.detail.value != tools.getDateStr(0)) {
      data.lcisToday = false;
    } else {
      data.lcisToday = true;
    }
    self.setData({
      selectDate: data
    })
    wx.setStorageSync('checkInHour',e.detail.value)
    this.getDetailInfo()
  },
  // 隐藏加载toast
  hideToast: function(){
    var self = this
    self.setData({
      requestCount: self.data.requestCount-1
    })
    if( self.data.requestCount == 0 ){
      self.wetoast.toast()
    }
  },
  // 显示隐藏不同等级会员价格
  showLevelPrice: function(e){
    var self = this
    var getRoomType = self.data.getRoomType
    for(var i=0;i<getRoomType.length;i++){
      if(getRoomType[i].roomTypeID == e.currentTarget.dataset.id){
        getRoomType[i].isShow = !getRoomType[i].isShow
      }
    }
    self.setData({
      getRoomType: getRoomType
    })
  },
  // 预订按钮
  bookBtn: function(e){
    console.log(e);
    var type = e.currentTarget.dataset.type;
    var code = e.currentTarget.dataset.code || '';
    var id = e.currentTarget.dataset.id || '';
    var self = this
    if( e.currentTarget.dataset.roomnum < 1 ){
      self.wetoast.toast({
          title: '该房型已订完',
          duration: 1500
      })
      return false
    }else if( !self.checkMemberLogin() && (e.currentTarget.dataset.level!='wkj') ){
      wx.navigateTo({
        url: "../login/login"
      })
      return false
    }
    wx.setStorageSync('roomTypeID',e.currentTarget.dataset.roomid)
    wx.setStorageSync('hotelId',self.data.getHotelInfo.hotelId)
    wx.setStorageSync('hotelName',self.data.getHotelInfo.hotelName)
    wx.setStorageSync('openType',self.data.openType)
    wx.navigateTo({
      url: "../write-order/write-order?type=" + type + '&code=' + code + '&id=' + id
    })
  },
  // 查看更多房型
  showMoreBtn: function(){
    var self = this
    if( self.data.showRoomCount == self.data.getRoomType.length ){
      self.setData({
        showRoomCount: 3
      })
    }else {
      self.setData({
        showRoomCount: self.data.getRoomType.length
      })
    }
  },
  // 用户登录检测
  checkMemberLogin: function(){
    if( wx.getStorageSync('memberId') ){
      return true
    }else{
      return false
    }
  },
  // 更改房型
  changeRoomType: function(e){
    var self = this
    if(e.currentTarget.dataset.type == self.data.openType){
      return false
    }
    self.setData({
      openType: e.currentTarget.dataset.type
    })
    wx.setStorageSync('openType',self.data.openType)
    wx.showToast({
      title:'正在加载...',
      icon: 'loading',
      mask: true,
      duration: 3000
    })
    self.onShow()
  },

   // 收藏页面
   collectHotel: function(){
    var iscol = this.data.iscollection; 
    if(iscol == 1){
      // 已收藏的
      this.colDel();
    }else if(iscol== 2){
      // 未收藏
      if( wx.getStorageSync('memberId')){
        // 未收藏已登录
        this.colAdd();
      }else {
        // 调用登录
        wx.navigateTo({
          url: '../login/login'
        })
      }
    }
  },
  // 收藏
  colAdd () {
    var self = this
    var data = {
      memberId: wx.getStorageSync('memberId'),
      hotelId: this.data.hotelId
    }
    tools.save({
      url: '/colResource/v1.1/colAdd',
      data: data,
      success: function(res) {
        if(res.data.retCode == 200){
          self.wetoast.toast({
            title: '收藏成功！',
          })
          self.setData({
            iscollection: 1
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
  colDel () {
    var self = this
    var data = {
      memberId: wx.getStorageSync('memberId'),
      hotelId: this.data.hotelId
    }
    tools.save({
      url: '/colResource/v1.1/colDel',
      data:data,
      success: function(res) {
        if(res.data.retCode == 200){
          self.wetoast.toast({
            title: '取消收藏成功！',
          })
          self.setData({
            iscollection: 2
          })
        }else{
          self.wetoast.toast({
            title: res.data.retMsg,
          })
        }
      }
    })
  },
  //展示图片
  letImagesPreview:function(e){
    var src = e.currentTarget.dataset.src;
    var that = this;
    wx.previewImage({
      current: src,
      urls: that.data.getHotelInfo.hotelPic
    })
  },
  //酒店介绍
  goToIntroduce: function(e) {
    // console.log(e);
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../lchotel-introduce/lchotel-introduce?id=' + id
    })
  },

  //分享功能
  onShareAppMessage: function () {
    var id = wx.getStorageSync('hotelId');
    var hotelname = this.data.hotelname;
    return {
      title: hotelname,
      path: '/pages/hotel-detail/hotel-detail?id=' + id
    }
  },
  searchAllComment: function() {
    var id = wx.getStorageSync('hotelId');
    var hasCom = this.data.hasCom;
    if(!hasCom) {
      return;
    }
    console.log(1);
    wx.navigateTo({
      url: '../lcusercomment/lcusercomment'
    })
  },
   //事件处理函数
   bindViewTap: function () {
    wx.navigateTo({
      url: '../lccalender/index'
    })
  },
  checkHour: function() {
    wx.showToast({
      title: '钟点房仅可以预定当天',
      icon: 'none',
    })
  },
  // 仿tabBar 
  copytabBar: function (e) {     
    if (e.currentTarget.dataset.url =='../reside-service/reside-service'){
      wx.navigateTo({
        url: e.currentTarget.dataset.url
      })  
    }else{
      wx.switchTab({
        url: e.currentTarget.dataset.url
      }); 
    }         
  },








})