var tools = require('../../tools.js')
var config = require('../../config.js')
var API = require('../../API.js')
var app = getApp()
Page({
  data: {
    showRoomCount: 3,
    markers: [],
    hotelname: '',
    hotelData: {},
    storage: '',
    timedata: '',
    scene_id: '',
    // myModule:{
    //   p1: '1011',
    //   p2: '1022'
    // }
  },

  // 分享功能
  // onShareAppMessage: function(){
  //   var self = this
  //   return {
  //     title: self.data.getHotelInfo.hotelName+'-AA旅行',
  //     path: '/pages/hotel-detail/hotel-detail?hotelId='+self.data.getHotelInfo.hotelId
  //   }
  // },
  onLoad: function (options) {
    // console.log(options);
    if (options.scene) {
      // console.log(options.scene)
      // if (wx.getStorageSync('scene_id')) {
      //获取当前时间戳
      var timestamp = Date.parse(new Date());
      // console.log("当前时间戳为：" + timestamp);
      wx.setStorageSync('timkey', timestamp)
      //this.setData({ scene_id: scene_id });
      //wx.getStorageSync('timkey');
    } else {
      wx.getStorageSync('timkey');
      var newtimetp = Date.parse(new Date());
      // console.log(newtimetp);
      if (newtimetp - wx.getStorageSync('timkey') >= 86400000) {
        // console.log(newtimetp - wx.getStorageSync('timkey'));
        this.setData({
          scene_id: ''
        })
      }
    }
    //console.log(wx.getStorageSync('timkey'));

    var id = options.id
    // console.log(options);

    /**
     * 插入新增
     */
    let that = this;
    this.setData({
      hotelId: id
    })
    this.getHotelInfo()
    /**
     * 插入新增end
     */




    // var that = this;
    // wx.request({
    //   url: 'https://aaroom.ihotels.cc/api/getNearBusinessByHotelId?hotel_id=' + id,
    //   data: '',
    //   method: 'get',
    //   header: {
    //     'content-type': 'application/json' //默认值
    //   },
    //   success: function (res) {
    //     console.log(res.data);
    //     // that.setData({
    //     //   hotelData: res.data
    //     // })
    //   }
    // });

    // this.setData({
    //   //['myModule.p1']:'1011',
    //   //['myModule.p2']: '1012',
    // });
    if (options.source) {
      wx.setStorageSync('source', options.source);
    }
    if (options.code) {
      wx.setStorageSync('code_hotel_id', options.id);
      wx.setStorageSync('regemployee_id', options.regemployee_id);
      wx.setStorageSync('scene_id', options.scene);
    }
    wx.showLoading({
      icon: 'loading',
      title: '正在加载...',
      mask: true,
      duration: 2500
    })
    var self = this
    //如果从收藏或者常住页面进入详情页，需要更新入住天数
    if (options.page == 1) {
      wx.setStorageSync('checkIn', tools.getDateStr(0))
      wx.setStorageSync('checkOut', tools.getDateStr(1))
    }
    wx.setStorageSync('hotelId', options.id)
    // console.dir(options);
    this.setData({
      hotelId: options.id,
      // distance: options.distance,
      // areaname: options.areaname,
      // iscollection: options.iscollection || null
    })
    new app.WeToast()
    tools.mta.Page.init()
    if (wx.getStorageSync('checkIn') && wx.getStorageSync('checkOut')) {
      var countDay = tools.spendDateNum(wx.getStorageSync('checkIn'), wx.getStorageSync('checkOut'))
    } else {
      var countDay = 1
    }
    var selectDate = {
      checkIn: wx.getStorageSync('checkIn') ? wx.getStorageSync('checkIn') : tools.getDateStr(0),
      checkOut: wx.getStorageSync('checkOut') ? wx.getStorageSync('checkOut') : tools.getDateStr(1),
      countDay: countDay,
      startDay: tools.getDateStr(0),
      endDay: tools.getDateStr(config.MAX_BOOKDAY - 1),
      startDay1: tools.getDateStr(1),
      endDay1: tools.getDateStr(config.MAX_BOOKDAY),
      checkInHour: wx.getStorageSync('checkInHour') ? wx.getStorageSync('checkInHour') : tools.getDateStr(0),
      lcisToday: true
    }
    self.setData({
      selectDate: selectDate,
      openType: wx.getStorageSync('openType') ? wx.getStorageSync('openType') : 1
    })
  },

  onShow: function (options) {
    // 新增 0318
    this.getUserInfo()
    // 新增 0318end

    // console.log(options);
    var scene_id = wx.getStorageSync('scene_id');
    // console.log(scene_id);
    this.setData({
      scene_id: scene_id
    })

    var self = this;
    //获取时间
    if (wx.getStorageSync('checkIn') && wx.getStorageSync('checkOut')) {
      var countDay = tools.spendDateNum(wx.getStorageSync('checkIn'), wx.getStorageSync('checkOut'))
    } else {
      var countDay = 1
    }
    var selectDate = {
      checkIn: wx.getStorageSync('checkIn') ? wx.getStorageSync('checkIn') : tools.getDateStr(0),
      checkOut: wx.getStorageSync('checkOut') ? wx.getStorageSync('checkOut') : tools.getDateStr(1),
      countDay: countDay,
      startDay: tools.getDateStr(0),
      endDay: tools.getDateStr(config.MAX_BOOKDAY - 1),
      startDay1: tools.getDateStr(1),
      endDay1: tools.getDateStr(config.MAX_BOOKDAY),
      checkInHour: wx.getStorageSync('checkInHour') ? wx.getStorageSync('checkInHour') : tools.getDateStr(0),
      lcisToday: true
    }
    self.setData({
      selectDate: selectDate,
      openType: wx.getStorageSync('openType') ? wx.getStorageSync('openType') : 1
    })

    //清除缓存中优惠券
    wx.removeStorageSync('chooseCoupons');
    var self = this
    // if (this.checkMemberLogin()) {
    //   this.setData({
    //     loginStatus: true
    //   })
    //   self.memberLogin()
    // }
    this.setData({
      requestCount: 3
    })
    this.getDetailInfo()
  },
  
  onHide: function () {},
  // 打开页面请求数据
  getDetailInfo: function (options) {
    options = options ? options : {}
    var self = this
    // self.wetoast.toast({
    //     title: '加载中...',
    // })
    wx.showToast({
      title: '正在加载...',
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
      success: function (res) {
        // console.log('获取酒店详情:', res);
        self.setData({
          hotelname: res.data.retValue.baseInfo.hotelName
        })
        if (res.data.retCode == 200) {
          wx.setStorage({ //缓存店铺信息--宿中服务
            key: 'hoteldetails',
            data: res.data.retValue.baseInfo
          })
          //处理距离
          var distance = (res.data.retValue.baseInfo.distance / 1000).toFixed(1);
          //处理区域
          var areaname = (res.data.retValue.baseInfo.areaName).split('-')[(res.data.retValue.baseInfo.areaName).split('-').length - 1];
          //处理是否收藏
          var isCollection = res.data.retValue.baseInfo.isCollection;
          var latLon = tools.mapBdToTeng({
            lat: res.data.retValue.baseInfo.hotelLatitude,
            lng: res.data.retValue.baseInfo.hotelLongitude,
            success: function (latLon) {
              // console.log(1111111)
              // console.log(latLon)
              res.data.retValue.baseInfo.hotelLatitude = latLon.lat
              res.data.retValue.baseInfo.hotelLongitude = latLon.lng
              var imgsArr = [];
              //处理图片
              if (res.data.retValue.baseInfo.hotelPic.length >= 3) {
                imgsArr.push(res.data.retValue.baseInfo.hotelPic[0],
                  res.data.retValue.baseInfo.hotelPic[1],
                  res.data.retValue.baseInfo.hotelPic[2])
              } else {
                imgsArr[0] = res.data.retValue.baseInfo.hotelPic[0];
                imgsArr[1] = res.data.retValue.baseInfo.hotelPic[0];
                imgsArr[2] = res.data.retValue.baseInfo.hotelPic[0];
              }
              //遍历图片处理,对‘thankyou99’这个网址下的图片无法加载的处理
              for (var i = 0; i < imgsArr.length; i++) {
                if (imgsArr[i].indexOf('www.thankyou99.com') != -1) {
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
                hotelId: res.data.retValue.baseInfo.hotelId,
                distance: distance,
                areaname: areaname,
                // iscollection: isCollection,
                markers: [{
                  iconPath: "http://m.ihotels.cc/app/images/miniapp/map_point.png",
                  id: 0,
                  latitude: res.data.retValue.baseInfo.hotelLatitude,
                  longitude: res.data.retValue.baseInfo.hotelLongitude,
                  width: 30,
                  height: 30
                }]
              })
              // console.log(self.data.getHotelInfo);
              // self.hideToast()
              // wx.hideToast();
            }
          })
        } else {
          self.wetoast.toast({
            title: res.data.retMsg,
          })
          setTimeout(function () {
            wx.navigateBack()
          }, 1000)
        }
      }
    })
    

    // 新 获取房型
    this.getRoomType();
    // 新 获取房型end

    var that = this
    wx.getStorage({
      key: 'timkey',
      success: function (res) {
        that.setData({
          timedata: res.data
        })
      },
    })

    // 新 获取评论 处理星星
    this.getCommentList();
    // 新 获取评论end
  },

  // 打电话给酒店
  callHotel: function () {
    var self = this
    wx.makePhoneCall({
      phoneNumber: self.data.getHotelInfo.hotelTel
    })
  },
  // 打开地图
  openMap: function () {
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
  setCheckIn: function (e) {
    var self = this
    var data = self.data.selectDate
    data.checkIn = e.detail.value
    data.countDay = tools.spendDateNum(e.detail.value, self.data.selectDate.checkOut)
    if (data.countDay < 1) {
      data.checkOut = tools.getDayAfterNum(e.detail.value, 1)
      data.countDay = 1
      wx.setStorageSync('checkOut', tools.getDayAfterNum(e.detail.value, 1))
    }
    if (data.countDay > config.MAX_BOOKDAY_LENGTH) {
      data.countDay = config.MAX_BOOKDAY_LENGTH
      data.checkOut = tools.getDayAfterNum(e.detail.value, config.MAX_BOOKDAY_LENGTH)
      wx.setStorageSync('checkOut', tools.getDayAfterNum(e.detail.value, config.MAX_BOOKDAY_LENGTH))
    }
    self.setData({
      selectDate: data
    })
    wx.setStorageSync('checkIn', e.detail.value)
    this.setData({
      requestCount: 3
    })
    this.getDetailInfo()
  },
  // 选择离店时间
  setCheckOut: function (e) {
    var self = this
    var data = self.data.selectDate
    data.checkOut = e.detail.value
    data.countDay = tools.spendDateNum(self.data.selectDate.checkIn, e.detail.value)
    if (data.countDay < 1) {
      data.checkIn = tools.getDayAfterNum(e.detail.value, -1)
      data.countDay = 1
      wx.setStorageSync('checkIn', tools.getDayAfterNum(e.detail.value, -1))
    }
    if (data.countDay > config.MAX_BOOKDAY_LENGTH) {
      data.countDay = config.MAX_BOOKDAY_LENGTH
      data.checkIn = tools.getDayAfterNum(e.detail.value, -(config.MAX_BOOKDAY_LENGTH))
      wx.setStorageSync('checkIn', tools.getDayAfterNum(e.detail.value, -(config.MAX_BOOKDAY_LENGTH)))
    }
    self.setData({
      selectDate: data
    })
    wx.setStorageSync('checkOut', e.detail.value)
    this.setData({
      requestCount: 3
    })
    this.getDetailInfo()
  },
  // 钟点房选择入住时间
  setCheckInHour: function (e) {
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
    wx.setStorageSync('checkInHour', e.detail.value)
    this.getDetailInfo()
  },
  // 隐藏加载toast
  hideToast: function () {
    var self = this
    self.setData({
      requestCount: self.data.requestCount - 1
    })
    if (self.data.requestCount == 0) {
      self.wetoast.toast()
    }
  },
  // 显示隐藏不同等级会员价格
  // showLevelPrice: function (e) {
  //   var self = this;
  //   var getRoomType = self.data.getRoomType;
  //   for (let i = 0; i < getRoomType.length; i++) {
  //     if (getRoomType[i].roomTypeID == e.currentTarget.dataset.id) {
  //       getRoomType[i].isShow = !getRoomType[i].isShow;
  //     }
  //   }
  //   self.setData({
  //     getRoomType: getRoomType
  //   })
  // },
  showLevelPrice: function (e) {
    var self = this;
    var getRoomType = self.data.getRoomType;
    for (let i = 0; i < getRoomType.length; i++) {
      if (getRoomType[i].room_type_code == e.currentTarget.dataset.id) {
        getRoomType[i].isShow = !getRoomType[i].isShow;
      }
    }
    self.setData({
      getRoomType: getRoomType
    })
  },
  // 预订按钮
  bookBtn: function (e) {
    // console.log(e);
    // return
    var type = e.currentTarget.dataset.type;
    var code = e.currentTarget.dataset.code || '';
    var id = e.currentTarget.dataset.roomid || '';
    var index = e.currentTarget.dataset.index;
    var self = this
    if (e.currentTarget.dataset.roomnum < 1) {
      self.wetoast.toast({
        title: '该房型已订完',
        duration: 1500
      })
      return false
    } 
    // else if (!self.checkMemberLogin() && (e.currentTarget.dataset.level != 'wkj')) {
    //   wx.navigateTo({
    //     url: "../login/login"
    //   })
    //   return false
    // }
    wx.setStorageSync('roomTypeID', e.currentTarget.dataset.roomid)
    wx.setStorageSync('hotelId', self.data.hotelId)
    wx.setStorageSync('roomName', e.currentTarget.dataset.roomname)
    wx.setStorageSync('hotelName', self.data.getHotelInfo.hotelName)
    wx.setStorageSync('hotelAddress', self.data.getHotelInfo.hotelAddress)
    wx.setStorageSync('openType', self.data.openType)
    
    wx.navigateTo({
      // url: "../write-order/write-order?type=" + type + '&code=' + code + '&id=' + id
      url: `../write-order/write-order?roomid=${id}&index=${index}&openType=${type}&hotelId=${self.data.hotelId}`
    })
  },
  // 查看更多房型
  showMoreBtn: function () {
    var self = this
    if (self.data.showRoomCount == self.data.getRoomType.length) {
      self.setData({
        showRoomCount: 3
      })
    } else {
      self.setData({
        showRoomCount: self.data.getRoomType.length
      })
    }
  },
  // 用户登录检测
  checkMemberLogin: function () {
    if (wx.getStorageSync('memberId')) {
      return true
    } else {
      return false
    }
  },
  // 更改房型
  changeRoomType: function (e) {
    if (e.currentTarget.dataset.type == 2) {
      wx.showModal({
        title: '提示',
        content: '正在开发中，敬请期待！',
        showCancel: false
      })
      return
    }
    var self = this
    if (e.currentTarget.dataset.type == self.data.openType) {
      return false
    }
    self.setData({
      openType: e.currentTarget.dataset.type
    })
    wx.setStorageSync('openType', self.data.openType)
    wx.showToast({
      title: '正在加载...',
      icon: 'loading',
      mask: true,
      duration: 3000
    })
    self.onShow()
  },

  // 收藏页面
  collectHotel: function () {
    // var iscol = this.data.iscollection;
    // if(iscol == 1){
    //   // 已收藏的
    //   this.colDel();
    // }else if(iscol== 2){
    //   // 未收藏
    //   if( wx.getStorageSync('memberId')){
    //     // 未收藏已登录
    //     this.colAdd();
    //   }else {
    //     // 调用登录
    //     wx.navigateTo({
    //       url: '../login/login'
    //     })
    //   }
    // }
    var iscol = this.data.iscollection;
    if (iscol == 1) {
      // 已收藏的
      this.colDel();
    } else if (iscol == 2 || !iscollection) {
      // 未收藏
      this.colAdd();
    }
  },

  /**
   * 收藏
   */
  colAdd() {
    let that = this;
    let data = {
      member_id: app.globalData.memberId,
      hotel_id: that.data.hotelId
    }
    tools.saveJAVA({
      url: API.collectHotel,
      data: data,
      success(res) {
        console.log(res);
        if (res.data.errorDesc == "success") {
          that.setData({
            iscollection: 1
          })
          wx.showToast({
            title: '收藏成功',
            icon: 'success',
            duration: 2000
          })
        } else if (res.data.errorDesc == "您已经收藏过了！") {
          wx.showToast({
            title: '已收藏！',
            icon: 'none',
            duration: 2000
          })
        } else {
          wx.showToast({
            title: '收藏失败',
            icon: 'none',
            duration: 2000
          })
        }
      },
      fail(err) {
        console.log(err)
        wx.showToast({
          title: '收藏失败',
          icon: 'none',
          duration: 2000
        })
      }
    })
  },

  /* colAdd () {
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
  }, */

  /**
   * 取消收藏
   */
  colDel() {
    let that = this;
    let data = {
      member_id: app.globalData.memberId,
      hotel_id: that.data.hotelId
    }
    tools.saveJAVA({
      url: API.collectHotelDel,
      data: data,
      success(res) {
        console.log(res);
        if (res.data.errorDesc == "success") {
          that.setData({
            iscollection: 2
          })
          wx.showToast({
            title: '取消成功',
            icon: 'success',
            duration: 2000
          })
        } else if (res.data.errorDesc == "您尚未收藏过此酒店！") {
          wx.showToast({
            title: '已取消！',
            icon: 'none',
            duration: 2000
          })
        } else {
          wx.showToast({
            title: '取消失败',
            icon: 'none',
            duration: 2000
          })
        }
      },
      fail(err) {
        console.log(err)
        wx.showToast({
          title: '取消失败',
          icon: 'none',
          duration: 2000
        })
      }
    })
  },
  /* colDel () {
    var self = this
    var data = {
      memberId: wx.getStorageSync('memberId'),
      hotelId: this.data.hotelId
    }
    tools.save({
      url: '/colResource/v1.1/colDel',
      data: data,
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
  }, */


  //展示图片
  letImagesPreview: function (e) {
    var src = e.currentTarget.dataset.src;
    var that = this;
    wx.previewImage({
      current: src,
      urls: that.data.getHotelInfo.hotelPic
    })
  },
  //酒店介绍
  goToIntroduce: function (e) {
    // console.log(e);
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../lchotel-introduce/lchotel-introduce?id=' + id
    })
  },

  //分享功能
  onShareAppMessage: function () {
    // var id = wx.getStorageSync('hotelId');
    // var hotelname = this.data.hotelname;
    // return {
    //   title: 'AA连锁酒店',
    //   path: '/pages/hotel-detail/hotel-detail?id=' + id
    // }
  },
  searchAllComment: function () {
    var id = wx.getStorageSync('hotelId');
    var hasCom = this.data.hasCom;
    if (!hasCom) {
      return;
    }
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
  checkHour: function () {
    wx.showToast({
      title: '钟点房仅可以预定当天',
      icon: 'none',
    })
  },
  // 仿tabBar
  copytabBar: function (e) {
    console.log(e.currentTarget.dataset.url);
    if (e.currentTarget.dataset.url == '../reside-service/reside-service' || '../play-around/play-around') {
      wx.navigateTo({
        url: e.currentTarget.dataset.url
      })
    } else {
      wx.switchTab({
        url: e.currentTarget.dataset.url
      });
    }
  },

  // copytabBarserv: function () {
  //   wx.redirectTo({
  //     url: '../play-around/play-around'
  //   })
  // },
  copytabBarindex: function () {
    wx.switchTab({
      url: '../index/index'
    })
  },
  copytabBarmine: function () {
    wx.switchTab({
      url: '../minecenter/minecenter'
    })
  },


  /* 新增 */

  /**
   * 查询酒店信息 onshow
   */
  getHotelInfo() {
    this.getIsCollectedHotel();
  },

  /**
   * 查询是否收藏 onshow
   */
  getIsCollectedHotel() {
    let that = this;
    let data = {
      member_id: app.globalData.memberId,
      hotel_id: that.data.hotelId
    }
    tools.saveJAVA({
      url: API.isCollectedHotel,
      data: data,
      success(res) {
        // console.log(res);
        if (res.data.errorCode == 70000) {
          that.setData({
            iscollection: 1
          })
        } else if (res.data.errorCode == 70001) {
          that.setData({
            iscollection: 2
          })
        }
      }
    })
  },

  /**
   * 获取酒店房型 房价
   */
  getRoomType() {
    let that = this;
    tools.saveJAVA({
      url: API.avail,
      data: {
        hotel_id: wx.getStorageSync('hotelId'),
        // hotel_id: '00650',
        beginDate: wx.getStorageSync('checkIn') ? wx.getStorageSync('checkIn') : tools.getDateStr(0),
        endDate: wx.getStorageSync('checkOut') ? wx.getStorageSync('checkOut') : tools.getDateStr(1),
      },
      success(res){
        // console.log(res)
        if(res.data.status==500){
          wx.showModal({
            title:'提示',
            content:'系统错误，请稍后再试！',
            showCancel:false,
            success(){
              wx.navigateBack({
                delta: 1, // 回退前 delta(默认为1) 页面
              })
            }
          })
        }else{
          let list=res.data.entity.prices;
          that.setData({
            getRoomType:list,
            allNum: list.length
          })
        }
      },
      fail(err){
        console.log(err)
        wx.showModal({
          title:'提示',
          content:'系统错误，请稍后再试！',
          showCancel:false,
          success(){
            wx.navigateBack({
              delta: 1, // 回退前 delta(默认为1) 页面
            })
          }
        })
      }
    })

  },

  /**
   * 获取会员信息
   */
  getUserInfo(){
    this.setData({
      cardLevel:app.globalData.cardLevel,
      levelNum:app.globalData.levelNum,
    })
  },

  /**
   * 获取酒店评论 处理星星
   */
  getCommentList(){
    let that=this;
    tools.saveJAVA({
      url: API.selectMemberCommentList,
      data:{
        hotel_id: wx.getStorageSync('hotelId'),
        // hotel_id: '00650',
      },
      success(res){
        // console.log(res)
        if (res.data.errorCode == 50100){
          // "暂无数据"
          that.setData({
            commentListHotelGet:[],
            hasCom:false,
            commentlist:{},
            score:5,
          })
        }else{
          let list = res.data.data.dataList;
          list.forEach(e => {
            e.memberCardNum = e.memberCardNum ? tools.changeTelNum(e.memberCardNum) : '';
          });
          that.setData({
            commentListHotelGet: list,
            commentlist: list[0],
            hasCom: true,
            score:res.data.avg_star
          })
        }
        that.getStar();
      }
    })
  },

  getStar(){
    var score = this.data.score;
    var scoreArr = tools.convertToStarsArray(score);
    this.setData({
      starMsg:{
        score,
        scoreArr
      }
    })
  },



})