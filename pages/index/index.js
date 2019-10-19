var config = require('../../config.js')
var tools = require('../../tools.js')
var Data = require("../../utils/data.js");
var API = require('../../API.js');

// var QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js');
// var qqmapsdk;
var app = getApp()

Page({
  data: {
    cityName: wx.getStorageSync('cityName') ? wx.getStorageSync('cityName') : config.DEFAULT_CITY,
    index: 0,
    keyword: '',
    hotelId: '',
    brands: [],
    bannerPic: [],

    tips: '选择日期',
    date: '',
    tomorrow: '',
    userInfo: {},
    // 扫码获取的酒店id
    AAid: null,
    AARid: null,
    loginStatus: false,
    // 埋点
    tepyNav: null,
    tapName: null,
    tapBanner: null,
    // 统一授权
    hasPhone: null,
  },
  // 首页分享功能
  onShareAppMessage: function() {
    return {
      title: 'AA连锁酒店',
      path: '/pages/index/index'
    }
  },
  // 页面载入的时候
  onLoad: function(options) {
    this.login();
    // qqmapsdk = new QQMapWX({
    //   key: '5L5BZ-OXNKD-VE44W-HLIZU-FEAEK-WCFIN' //自己的key秘钥 http://lbs.qq.com/console/mykey.html 在这个网址申请
    // });
    var that = this;
    var self = this
    new app.WeToast()
    tools.mta.Page.init()
    wx.removeStorageSync('openType')
    var pic = [{
      picture: '/images/pic_loading750.svg'
    }];
    this.setData({
      bannerPic: pic
    })

    // 设置时间控件的时间
    var startDate = this.data.startDate;
    var endDate = this.data.endDate;
    var date = Data.formatDate(new Date(), "yyyy-MM-dd");
    var tomorrow1 = new Date();
    tomorrow1.setDate((new Date()).getDate() + 1);
    var tomorrow = Data.formatDate(new Date(tomorrow1), "yyyy-MM-dd");
    if (startDate == null) {
      startDate = date;
      endDate = tomorrow;
    }
    this.setData({
      checkIn: startDate,
      checkOut: endDate,
      checkInHour: startDate,
      selectDate: {
        checkIn: startDate,
        checkOut: endDate,
        checkInHour: startDate,
        countDay: 1,
        startDay: startDate,
        lcisToday: true
      },
      openType: 1
    });

    wx.setStorageSync('checkIn', self.data.selectDate.checkIn)
    wx.setStorageSync('checkOut', self.data.selectDate.checkOut)
    wx.setStorageSync('checkInHour', self.data.selectDate.checkInHour)
    self.getLatLon()
    this.getBannerPicPHP();

  },
  // 在前台展示
  onShow: function(e) {

    // 页面回到顶端
    if (wx.pageScrollTo) {
      wx.pageScrollTo({
        scrollTop: 0
      })
    }
    this.checkMemberLogin();
    // 读取AAID
    let AAid = wx.getStorageSync('AAid');
    let AARid = wx.getStorageSync('AARid');
    this.setData({
      AAid,
      AARid
    })
    // 读取AAID end
    var self = this;
    // 设置默认品牌 AA
    wx.setStorageSync('brandNameList', ['AA ROOM']);
    //清楚keyword
    wx.removeStorageSync('keyword');
    // wx.removeStorageSync('brandNameList');
    wx.removeStorageSync('area');
    wx.removeStorageSync('serviceNameList');
    wx.removeStorageSync('commentLeave');
    wx.removeStorageSync('distance');
    //判断缓存中是否有入住时间，有的话使用缓存中的时间
    if (wx.getStorageSync('checkIn') && wx.getStorageSync('checkOut')) {
      var selectDate = self.data.selectDate;
      selectDate.checkIn = wx.getStorageSync('checkIn');
      selectDate.checkOut = wx.getStorageSync('checkOut');
      selectDate.countDay = tools.spendDateNum(wx.getStorageSync('checkIn'), wx.getStorageSync('checkOut'));
      self.setData({
        selectDate: selectDate
      })
    }
    self.setData({
      cityName: wx.getStorageSync('cityName') ? wx.getStorageSync('cityName') : config.DEFAULT_CITY,
      keyword: wx.getStorageSync('keyword') ? wx.getStorageSync('keyword') : '',
      index: wx.getStorageSync('index') ? wx.getStorageSync('index') : 0
    })
    self.getCountyByCity()

  },

  /**
   * 登录wx 判断是否授权
   */
  login() {
    let that = this;
    tools.getHasPhone(app, that);
  },

  /**
   * 获取手机号
   */
  getPhone(e) {
    let hasPhone = e.detail.hasPhone;
    this.setData({
      hasPhone
    })
  },

  // 根据城市名称获取区县
  getCountyByCity: function() {
    var self = this
    var data = {
      cityName: wx.getStorageSync('cityName')
    }
  },
  // 获取经纬度
  getLatLon: function() {
    var self = this
    wx.getLocation({
      type: 'wgs84',
      success: function(res) {
        wx.setStorageSync('lat', res.latitude)
        wx.setStorageSync('lon', res.longitude)
        self.getLocation(res)
        self.getList(res.latitude, res.longitude);
      },
      fail() {
        self.getList()
      }

    })
  },
  // 根据经纬度获取城市名称
  getLocation: function(pos) {
    var self = this
    self.wetoast.toast({
      title: '正在获取位置',
    })
    //判断用户授权
    wx.getSetting({
      success: function(res) {
        //提醒用户尚未授权
        if (res.authSetting['scope.userLocation'] == false || !res.authSetting['scope.userLocation']) {
          self.wetoast.toast({
            title: '您尚未授权',
            duration: 500,
            success: function() {
              //弹出授权框
              wx.openSetting({
                success: function(res) {
                  if (res.authSetting['scope.userLocation'] == true) {
                    self.getLatLon();
                  }
                },
                fail: function() {
                  self.getList()
                }
              })
            }
          })
        }
      }
    });
    var data = {
      lat: wx.getStorageSync('lat'),
      lng: wx.getStorageSync('lon')
    }

    tools.saveJAVA({
      url: API.getCityName,
      data: data,
      method: 'GET',
      success(res) {
        if (res.data.city) {
          let city = res.data.city;
          let tem = city.split('');
          if (tem[tem.length - 1] === '市') {
            tem.pop()
            city = tem.join('');
          }
          wx.setStorageSync('cityName', city);
          self.setData({
            cityName: city
          })
          wx.setStorageSync('keyword', '')
        } else {
          self.setData({
            cityName: config.DEFAULT_CITY
          })
        }
        self.getCountyByCity()
        self.setData({
          keyword: '',
          index: 0
        })
      },
      fail(err) {
        console.log(err)
        self.setData({
          cityName: config.DEFAULT_CITY
        })
      }
    })

  },


  // 选择入住时间
  setCheckIn: function(e) {
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
  },
  // 选择离店时间
  setCheckOut: function(e) {
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
  },
  // 钟点房选择入住时间
  setCheckInHour: function(e) {
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
  },
  // 打开选择城市页面
  changeCity: function() {
    wx.navigateTo({
      url: '../switchcity/switchcity'
    })
  },

  // 获取用户搜索的关键字
  getInputWord: function(e) {
    // console.log(e.detail.value);
    this.setData({
      keyword: e.detail.value
    })
  },
  // 搜索酒店
  openHotelList: function(a) {
    // 埋点
    // let AAid = this.data.AAid;
    // let AARid = this.data.AARid;
    // let cityName = this.data.cityName;
    // let keyword = this.data.keyword;
    // wx.reportAnalytics('index_search', {
    //   AAid: AAid,
    //   AARid: AARid,
    //   cityName: cityName,
    //   keyword: keyword,
    // });
    // 埋点end

    var self = this
    //清除缓存中优惠券
    wx.removeStorageSync('chooseCoupons');
    wx.setStorageSync('openType', self.data.openType)
    // if (!self.data.keyword && a != 1) {
    //   wx.setStorageSync('keyword', 'AA');
    // } else {
    //   wx.setStorageSync('keyword', self.data.keyword);
    // }
    wx.setStorageSync('keyword', self.data.keyword);
    // wx.removeStorageSync('brandNameList');
    wx.removeStorageSync('serviceNameList');
    wx.removeStorageSync('distance');
    wx.removeStorageSync('commentLeave');
    wx.navigateTo({
      url: "../lchotel-list/lchotel-list"
    })
  },
  // 更改房型
  changeRoomType: function(e) {
    if (e.currentTarget.dataset.type == 2) {
      wx.showModal({
        title: '提示',
        content: '正在开发中，敬请期待！',
        showCancel: false
      })
      return
    }
    var self = this
    self.setData({
      openType: e.currentTarget.dataset.type
    })
  },


  //搜索空间聚焦时，页面上移至按钮可见的位置
  bindHotelFocus: function(e) {
    // console.log(e);
    this.goTop(126);
  },
  goTop: function(m) { // 离顶部m距离的位置
    if (wx.pageScrollTo) {
      wx.pageScrollTo({
        scrollTop: m
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }
  },
  onPageScroll: function(e) {
    // console.log(e);

  },
  //事件处理函数
  bindViewTap: function() {
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



  /* 新增 */
  // 获取轮播图数据 PHP
  getBannerPicPHP: function() {
    var that = this;
    // let success = function (res) {
    // let openid = null;
    // if (res) {
    //   openid = res.data.openid
    // } else {
    //   openid = app.globalData.openId;
    // }
    let openid = 'openid'
    tools.savePHP({
      url: API.reservationBanner,
      data: {
        // openid: app.globalData.openId
        openid: openid
      },
      success: function(res) {
        that.setData({
          bannerPic: res.data.data[0].reservationBanner,
          // myTel: res.data.data[0].myTel,
        })
      }
    })
    // };

    // if (app.globalData.openId) {
    //   success()
    // } else {
    //   let option = {
    //     success: success
    //   }
    //   // tools.loginWx(option)
    // }
  },

  /* 获取推荐酒店列表 */
  getList(lat = 'undefined', lon = 'undefined') {
    let that = this;
    tools.savePHP({
      url: API.recommendedHotel,
      data: {
        lat,
        lon
      },
      success: function(res) {
        let msg = res.data.data[0];
        let list = msg.recommendedHotel;
        for (let i = 0; i < list.length; i++) {
          // 标签
          let tagList = list[i].labels;
          tagList = that.getItemTag(4, tagList);
          list[i].labels = tagList;
          // 距离
          let distance = list[i].distance;
          distance = that.getDistance(distance);
          list[i].distance = distance;
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
  getDistance(distance = 0) {
    if (distance == 0 || +distance == -1) {
      return 0
    } else {
      distance = (distance / 1000).toFixed(1);
      if (distance >= 10000) {
        distance = `大于1万`
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
      tags.push({
        label: '··'
      });
    }
    return tags
  },

  /* 跳订房 */
  toBuyRoom(e) {
    // 埋点
    let tapName = e.currentTarget.dataset.item.name
    this.setData({
      tapName
    })
    // wx.reportAnalytics('index_list_taphotel', {
    //   tapName
    // });
    // 埋点end
    // 新埋点
    wx.reportAnalytics('to_hotel_detail', {
      to_hotel_detail_hid: app.globalData.AAid,
      to_hotel_detail_position: '首页订房-推荐酒店',
    });
    let aHid = e.currentTarget.dataset.item.aHid;
    wx.navigateTo({
      url: `../hotel-detail/hotel-detail?id=${aHid}`
    })
  },


  // 检查用户登录状态
  checkMemberLogin() {
    let loginStatus = false;
    if (wx.getStorageSync('memberId')) {
      loginStatus = true;
    }
    this.setData({
      loginStatus
    })
  },

  /**
   * 点击导航栏 
   */
  tapNav(e) {
    
    let name = e.currentTarget.dataset.name;
    // 埋点
    this.setData({
      tepyNav: name
    })
    // wx.navigateTo({
    //   url: `../login/login?to=${name}`
    // })
    // return

    // wx.reportAnalytics('index_tapnav', {
    //   tepyNav: name
    // });
    // 埋点end
    // if (name == '会员权益' || name == '房间质检') {
    switch (name) {
      case '会员权益':
        var brandUrl = config.H5url.equityUrl;
        var openId = wx.getStorageSync("openId");
        // 埋点
        wx.reportAnalytics('to_vip_equity', {
          to_vip_equity_hid: app.globalData.AAid,
          to_vip_equity_position: `订房首页-功能导航-会员权益`,
        });
        wx.navigateTo({
          // url: '../goToEquity/goToEquity?url=' + brandUrl + '&openId=' + openId
          url: `../../vipPackage/pages/vipEquity/vipEquity`
        })
        break;
      case '我的收藏':
        wx.navigateTo({
          url: '../my-hotel/my-hotel?id=' + 1
        })
        break;
      case '我的订单':
        wx.navigateTo({
          url: '../order-list/order-list?id=' + 0
        })
        break;
      case '房间质检':
        wx.navigateTo({
          url: `../../vipPackage/pages/qualityChecking/qualityChecking?type=订房导航栏`
        })
        break;

    }
    // } 
    // else {
    //   wx.navigateTo({
    //     url: `../login/login?to=${name}`
    //   })
    // }
  },

  /* 点banner */
  tapBanner(e) {
    let tapBanner = null;
    if (e.currentTarget.dataset.event) {
      tapBanner = e.currentTarget.dataset.event;
    }
    // 埋点
    this.setData({
      tapBanner: tapBanner
    })
    // wx.reportAnalytics('index_banner', {
    //   tapBanner: tapBanner
    // });
    // 埋点end
    // if (this.data.loginStatus || tapBanner == '会员权益' || tapBanner == '推荐酒店' || tapBanner == '房间质检') {
    switch (tapBanner) {
      case '会员权益':
        wx.reportAnalytics('to_vip_equity', {
          to_vip_equity_hid: app.globalData.AAid,
          to_vip_equity_position: '首页-banner',
        });
        wx.navigateTo({
          url: `../../vipPackage/pages/vipEquity/vipEquity`
        })
        break;
      case '推荐酒店':
        wx.navigateTo({
          url: `../../vipPackage/pages/suggestionList/suggestionList`
        })
        break;
      case '房间质检':
        wx.navigateTo({
          url: `../../vipPackage/pages/qualityChecking/qualityChecking?type=订房banner`
        })
        break;
    }
    // }else{
    //   wx.navigateTo({
    //     url: `../login/login?to=${tapBanner}`
    //   })
    // }
  },

  // 获取手机号授权 删
  // getPhoneNumber(e) {
  //   let that = this;
  //   let options = {
  //     page: '订房首页-',
  //     e: e,
  //     success: function (res) {
  //       let myTel = res.data.data.phoneNumber;
  //       that.setData({
  //         myTel: myTel,
  //       })
  //     },
  //     fail: function (err) {
  //       console.log(err)
  //     }
  //   }
  //   tools.getPhoneNumber(options)
  // },

})