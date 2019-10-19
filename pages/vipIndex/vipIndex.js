var tools = require('../../tools');
var API = require('../../API');
var config = require('../../config');
var app = getApp();
// pages/vipIndex/vipIndex.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hid: null,
    AARid: null,
    typeNav: null,
    typeMap: null,
    typeCheck: null,
    typeBuyRoom: null,
    typeEquity: null,
    typeHotelList: null,
    bodyMsg: {},
    WiFiList: [],
    bannerList: [],
    memberId: null,
    haveHid: false,
    haveVipId: false,
    inlineMsg: {},
    memberInfo: {},
    // 统一授权
    hasPhone: null,
    cardLevel:app.globalData.cardLevel,
    // 当前会员权益
    nowEquity:{},
  },

  /* 通用 */
  /**
   * 登录wx 判断是否授权
   */
  login(){
    let that=this;
    // 获取会员权益
    let hasPhoneCB=function () { 
      let cardLevel=app.globalData.cardLevel;
      that.setData({
        cardLevel
      });
      that.getNowEquity();
     }
    tools.getHasPhone(app,that,hasPhoneCB);
  },

  /**
   * 获取手机号
   */
  getPhone(e) {
    let hasPhone=e.detail.hasPhone;
    this.setData({
      hasPhone
    })
  },

  /**
   * 获取当前会员权益信息
   */
  getNowEquity(){
    let that=this;
    tools.saveJAVA({
      url: API.getMemberEquity,
      method: "GET",
      data:{
        memberId:app.globalData.memberId
      },
      success(res) {
        // console.log(777)
        // console.log(res)
        app.globalData.levelNum=res.data.levelNum;
        app.globalData.cardLevel=res.data.levelName;
        that.setData({
          nowEquity:res.data
        })
      }
    })
  },

  // 获取是否扫码 hid
  getHid() {
    let haveHid = app.globalData.haveHid;
    let hid = app.globalData.AAid;
    let AARid = wx.getStorageSync('AARid');
    this.setData({
      hid,
      AARid,
      haveHid,
    })
    if (hid != '' && haveHid) {
      this.getMsg();
    } else {
      // this.getInlineMsg();
    }
  },
  // 获取会员id 判断是否登陆
  // getVipId() {
  //   this.setData({
  //     inlineMsg: {},
  //     memberInfo: {},
  //   })
  //   let that = this;
  //   let memberId = null;
  //   let haveVipId = false;
  //   let tem = wx.getStorageSync('memberId');
  //   if (tem) {
  //     memberId = tem;
  //     haveVipId = true;
  //     that.getUserMsg(memberId);
  //   }
  //   // that.getInlineMsg();
  //   that.setData({
  //     memberId,
  //     haveVipId
  //   })
  // },
  // 跳登录
  toLogin() {
    wx.navigateTo({
      url: '../login/login',
    })
  },

  /* 通用end */

  /* 非扫码通用 */
  // 获取线上进入信息
  getInlineMsg() {
    let that = this;
    wx.showLoading({
      title: '加载中',
      // mask: true,
    })
    // let success=function(res){
    //   let openid=null;
    //   if(res){
    //     openid=res.data.openid
    //   }else{
    //     openid=app.globalData.openId;
    //   }
    //   tools.savePHP({
    //     url: API.nonMember,
    //     data: {
    //       openid: openid
    //     },
    //     success(res) {
    //       wx.hideLoading()
    //       let inlineMsg = {};
    //       let bodyMsg = that.data.bodyMsg;
    //       let msg = res.data.data[0];
    //       bodyMsg.myTel = msg.myTel;
    //       // inlineMsg.ad = msg.advertisement[0];
    //       inlineMsg.cardVip = msg.indexCard[0];
    //       inlineMsg.cardNoVip = msg.indexCard[1];
    //       // inlineMsg.equity = msg.indexEquity[0];
    //       inlineMsg.minPrice = msg.minPrice;
    //       that.setData({
    //         inlineMsg,
    //         bodyMsg
    //       })
    //     }
    //   })
    // };

    // if(app.globalData.openId){
      // success();
      let openid='openid';

      tools.savePHP({
        url: API.nonMember,
        data: {
          openid: openid
        },
        success(res) {
          wx.hideLoading()
          let inlineMsg = {};
          let bodyMsg = that.data.bodyMsg;
          let msg = res.data.data[0];
          bodyMsg.myTel = msg.myTel;
          // inlineMsg.ad = msg.advertisement[0];
          inlineMsg.cardVip = msg.indexCard[0];
          inlineMsg.cardNoVip = msg.indexCard[1];
          // inlineMsg.equity = msg.indexEquity[0];
          inlineMsg.minPrice = msg.minPrice;
          that.setData({
            inlineMsg,
            bodyMsg
          })
        }
      })
    // }else{
    //   let option={
    //     success:success
    //   }
    //   tools.loginWx(option);
    // }
    
  },
  // 跳index订房
  toBuyRoom(e) {
    // 埋点
    let typeBuyRoom = e.currentTarget.dataset.type;
    this.setData({
      typeBuyRoom
    });
    // wx.reportAnalytics('vipindex_buyroom', {
    //   typeBuyRoom
    // });
    // 埋点end
    wx.switchTab({
      url: '../index/index'
    })
  },

  // 跳会员权益 尚美
  // toEquity(e) {
  //   // 埋点
  //   let typeEquity = e.currentTarget.dataset.type;
  //   this.setData({
  //     typeEquity: typeEquity
  //   })
  //   // 会员权益
  //   // wx.reportAnalytics('vipindex_equity', {
  //   //   typeEquity:typeEquity
  //   // });
  //   // 埋点end
  //   var brandUrl = config.H5url.equityUrl;
  //   var openId = wx.getStorageSync("openId");
  //   wx.navigateTo({
  //     // url: '../goToEquity/goToEquity?url=' + brandUrl + '&openId=' + openId
  //     url: '../goToEquity/goToEquity?url=' + brandUrl 
  //   })
  // },

  // 跳推荐列表
  toHotelList(e) {
    // 埋点
    let typeHotelList = e.currentTarget.dataset.type;;
    this.setData({
      typeHotelList
    })
    // wx.reportAnalytics('vipindex_hotellist', {
    //   typeHotelList: typeHotelList,
    // });
    // 埋点end
    wx.navigateTo({
      url: '../../vipPackage/pages/suggestionList/suggestionList'
    })
  },

  /* 会员非扫码 */
  // 获取用户信息
  getUserMsg(memberId) {
    wx.showToast({
      title: '正在加载...',
      icon: 'loading',
      mask: true
    })
    var self = this
    tools.save({
      // url: '/memberResource/v1.1/memberInfo',
      url: '/memberResource/v2.0/memberInfo',
      data: {
        memberId: memberId
        // memberId: '18221519347'
      },
      success: function (res) {
        // console.log(res)
        var value = res.data.retValue;
        var memberName = res.data.retValue.cardLevelName;
        value.memberHead = value.memberHead ? value.memberHead : '../../images/pic_Default_red.svg';
        value.memberPhone = tools.changeTelNum(value.memberPhone);
        self.setData({
          memberInfo: value,
          memberName: memberName,
          modglod: res.data.retValue.modglod,
          integral: res.data.retValue.availableRewardsNum
        })
        //  清除加载
        wx.hideToast();
      }
    })
  },

  /* 搜索进入 */

  /* 搜索进入end */


  /* 扫码进入 */
  /* 获取首页数据 */
  getMsg() {
    let that = this;
    wx.showLoading({
      title: '加载中',
      mask: true,
    })
    // let success = function (res) {
      // let openid=null;
      // if(res){
      //   openid=res.data.openid;
      // }else{
      //   openid=app.globalData.openId;
      // }
      let openid='openid';
      tools.savePHP({
        url: API.hotelIndex,
        data: {
          "id": that.data.hid,
          'openid': openid,
        },
        success: function (res) {
          wx.hideLoading();
          let hotelVip = {};
          let bodyMsg = res.data.data[0];
          let hotelName = bodyMsg.name;
          let bannerList = bodyMsg.banner;
          let WiFiList = bodyMsg.WiFi;

          hotelVip.id = that.data.hid;
          hotelVip.hotelName = hotelName;

          wx.setStorageSync('hotelVip', hotelVip);
          that.setData({
            bannerList,
            WiFiList,
            bodyMsg
          })

        }
      })
    // }
    // if (app.globalData.openId) {
    //   success()
    // } else {
    //   let option = {
    //     success: success
    //   }
    //   tools.loginWx(option)
    // }
  },

  // 获取手机号 删
  // getPhoneNumber(e) {
  //   let that = this;
  //   let AAid = app.globalData.AAid;
  //   let AARid = app.globalData.AARid;
  //   let options = {
  //     page: '会员频道-',
  //     AAid: AAid,
  //     AARid: AARid,
  //     e: e,
  //     success: function (res) {
  //       let bodyMsg = that.data.bodyMsg;
  //       bodyMsg.myTel = res.data.data.phoneNumber;
  //       that.setData({
  //         bodyMsg: bodyMsg,
  //       })
  //     },
  //     fail: function (err) {
  //       console.log(err)
  //     }
  //   }
  //   tools.getPhoneNumber(options)
  // },

  /**
   * 房态检测
   * @param {id} 0:床上用品质检 1:房态检测
   */
  toCheck(e) {
    var type = e.currentTarget.dataset.id;
    if (type == '0') {
      var typeCheck = '床上用品质检';
      // var url = config.H5url.clothUrl;

    } else if (type == '1') {
      var typeCheck = '房态检测';
    }
    // 埋点
    this.setData({
      typeCheck
    })
    // let AAid = this.data.AAid;
    // let AARid = this.data.AARid;
    // let AAname = this.data.bodyMsg.name;
    // wx.reportAnalytics('vipindex_check', {
    //   AAid: AAid,
    //   AARid: AARid,
    //   typeCheck: typeCheck,
    //   AAname: AAname,
    // });
    // 埋点end
    wx.navigateTo({
      url: `../../vipPackage/pages/qualityChecking/qualityChecking?type=会员-${typeCheck}`
    })

  },

  /* 点击导航 */
  openMap(e) {
    // 埋点
    let typeMap = '导航';
    this.setData({
      typeMap
    })
    // let AAid = this.data.AAid;
    // let AARid = this.data.AARid;
    // let AAname = this.data.bodyMsg.name;
    // wx.reportAnalytics('vipindex_address', {
    //   AAid: AAid,
    //   AARid: AARid,
    //   typeMap: typeMap,
    //   AAname: AAname,
    // });
    // 埋点end
    /* // 判断是否登录
    let haveVipId = this.data.haveVipId;
    let memberId = this.data.memberId;
    if (!haveVipId || !memberId) {
      wx.navigateTo({
        url: '../login/login',
      })
      return
    }
    // 判断是否登录 end */
    let that = this;
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.userLocation']) {
          wx.authorize({
            scope: 'scope.userLocation',
            success() {
              let msg = e.currentTarget.dataset.addmsg
              let lon = Number(msg.lon)
              let lat = Number(msg.lat)
              let name = msg.name
              let add = msg.address
              wx.setStorageSync('lon', lon)
              wx.setStorageSync('lat', lat)
              wx.openLocation({
                latitude: lat,
                longitude: lon,
                name: name,
                address: add,
                scale: 15
              })
            },
            fail(err) {
              console.log(err)
              wx.showModal({
                title: '提示',
                content: '获得地址位置授权后，即可使用导航功能！',
                confirmText: '去授权',
                success: function (res) {
                  if (res.confirm) {
                    wx.openSetting()
                  }
                }
              })
            }
          })
        } else {
          let msg = e.currentTarget.dataset.addmsg
          let lon = Number(msg.lon)
          let lat = Number(msg.lat)
          let name = msg.name
          let add = msg.address
          wx.setStorageSync('lon', lon)
          wx.setStorageSync('lat', lat)
          wx.openLocation({
            latitude: lat,
            longitude: lon,
            name: name,
            address: add,
            scale: 15
          })
        }
      }
    })
  },

  /* 点击展开wifi列表 */
  tapShowMoreWifi() {
    /* // 判断是否登录
    let haveVipId = this.data.haveVipId;
    let memberId = this.data.memberId;
    if (!haveVipId || !memberId) {
      wx.navigateTo({
        url: '../login/login',
      })
      return
    }
    // 判断是否登录 end */
    this.setData({
      showMoreWifi: true
    })
  },

  /* 点击收起wifi列表 */
  tapNoMoreWifi() {
    /* // 判断是否登录
    let haveVipId = this.data.haveVipId;
    let memberId = this.data.memberId;
    if (!haveVipId || !memberId) {
      wx.navigateTo({
        url: '../login/login',
      })
      return
    }
    // 判断是否登录 end */
    this.setData({
      showMoreWifi: false
    })
  },

  /* 复制地址 */
  copyAdd(event) {
    // 埋点
    let typeMap = '复制';
    this.setData({
      typeMap
    })
    // let AAid = this.data.AAid;
    // let AARid = this.data.AARid;
    // let AAname = this.data.bodyMsg.name;
    // wx.reportAnalytics('vipindex_address', {
    //   AAid: AAid,
    //   AARid: AARid,
    //   typeMap: typeMap,
    //   AAname: AAname,
    // });
    // 埋点end
    /* // 判断是否登录
    let haveVipId = this.data.haveVipId;
    let memberId = this.data.memberId;
    if (!haveVipId || !memberId) {
      wx.navigateTo({
        url: '../login/login',
      })
      return
    }
    // 判断是否登录 end */
    let addTxt = event.currentTarget.dataset.addtxt
    wx.setClipboardData({
      data: addTxt,
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {}
        })
      }
    })
  },

  /* 复制wifi */
  copyWifi(event) {
    // 埋点
    // let AAid = this.data.AAid;
    // let AARid = this.data.AARid;
    // let AAname = this.data.bodyMsg.name;
    // wx.reportAnalytics('vipindex_copywifi', {
    //   AAid: AAid,
    //   AARid: AARid,
    //   AAname: AAname,
    // });
    // 埋点end
    /* // 判断是否登录
    let haveVipId = this.data.haveVipId;
    let memberId = this.data.memberId;
    if (!haveVipId || !memberId) {
      wx.navigateTo({
        url: '../login/login',
      })
      return
    }
    // 判断是否登录 end */
    // let that = this;
    // let hid = `${this.data.hid}`;
    
    let wifi = event.currentTarget.dataset.wifi;
    // let isWifi = +this.data.bodyMsg[0].isWifi;

    wx.setClipboardData({
      data: wifi,
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {}
        })
      }
    })
    // this.getClickCoupon(this.data.bodyMsg[0].wifi_id, '复制成功');
  },

  /* 拨号 */
  tapPhone(event) {
    // 埋点
    // let AAid = this.data.AAid;
    // let AARid = this.data.AARid;
    // let AAname = this.data.bodyMsg.name;
    // wx.reportAnalytics('vipindex_tel', {
    //   AAid: AAid,
    //   AARid: AARid,
    //   AAname: AAname,
    // });
    // 埋点end
    /* // 判断是否登录
    let haveVipId = this.data.haveVipId;
    let memberId = this.data.memberId;
    if (!haveVipId || !memberId) {
      wx.navigateTo({
        url: '../login/login',
      })
      return
    }
    // 判断是否登录 end */
    // let hid = `${this.data.hid}`;
    
    let tel = event.currentTarget.dataset.tel;
    wx.makePhoneCall({
      phoneNumber: tel
    })
  },

  /* 跳订房 */
  tapBuyRoom() {
    // 埋点
    let typeNav = '我要住店';
    let aHid = `${this.data.bodyMsg.aHid}`;
    this.setData({
      typeNav
    })
    // let AAid = this.data.AAid;
    // let AARid = this.data.AARid;
    // let AAname = this.data.bodyMsg.name;
    // wx.reportAnalytics('vipindex_navbar', {
    //   AAid: AAid,
    //   AARid: AARid,
    //   typeNav: typeNav,
    //   AAname: AAname,
    // });
    // 埋点end
    /* // 判断是否登录
    // let hid = `${this.data.hid}`;
    // let name = `${this.data.bodyMsg.name}`;
    let haveVipId = this.data.haveVipId;
    let memberId = this.data.memberId;
    if (!haveVipId || !memberId) {
      wx.navigateTo({
        url: `../login/login?to=${typeNav}&hid=${aHid}`,
      })
      return
    }
    // 判断是否登录 end */

    // 新埋点
    wx.reportAnalytics('to_hotel_detail', {
      to_hotel_detail_hid: app.globalData.AAid,
      to_hotel_detail_position: '会员频道-扫码进入-我要住店',
    });
    wx.navigateTo({
      // url: `../../vipPackage/pages/tips/tips?id=${hid}`
      url: `../../pages/hotel-detail/hotel-detail?id=${aHid}`
    })
  },

  /* 跳公告 */
  tapTips() {
    // 埋点
    let typeNav = '酒店贴士';
    let hid = `${this.data.hid}`;
    let name = `${this.data.bodyMsg.name}`;
    this.setData({
      typeNav
    })
    // let AAid = this.data.AAid;
    // let AARid = this.data.AARid;
    // let AAname = this.data.bodyMsg.name;
    // wx.reportAnalytics('vipindex_navbar', {
    //   AAid: AAid,
    //   AARid: AARid,
    //   typeNav: typeNav,
    //   AAname: AAname,
    // });
    // 埋点end
    /* // 判断是否登录
    let haveVipId = this.data.haveVipId;
    let memberId = this.data.memberId;
    if (!haveVipId || !memberId) {
      wx.navigateTo({
        url: `../login/login?to=${typeNav}&hid=${hid}&name=${name}`,
      })
      return
    }
    // 判断是否登录 end */
    wx.navigateTo({
      url: `../../vipPackage/pages/tips/tips?hid=${hid}&name=${name}`
    })
  },

  /* 跳问题反馈 */
  tapFeedback() {
    let hid = `${this.data.hid}`;
    let name = `${this.data.bodyMsg.name}`;
    // 埋点
    let typeNav = '我要吐槽';
    this.setData({
      typeNav
    })
    // let AAid = this.data.AAid;
    // let AARid = this.data.AARid;
    // let AAname = this.data.bodyMsg.name;
    // wx.reportAnalytics('vipindex_navbar', {
    //   AAid: AAid,
    //   AARid: AARid,
    //   typeNav: typeNav,
    //   AAname: AAname,
    // });
    // 埋点end
    /* // 判断是否登录
    let haveVipId = this.data.haveVipId;
    let memberId = this.data.memberId;
    if (!haveVipId || !memberId) {
      wx.navigateTo({
        url: `../login/login?to=${typeNav}&hid=${hid}&name=${name}`,
      })
      return
    }
    // 判断是否登录 end */
    wx.navigateTo({
      url: `../../vipPackage/pages/feedback/feedback?hid=${hid}&name=${name}`
    })
  },

  /* 跳会员权益 落地页 */
  tapVipEquity(e) {
    // console.log(e.currentTarget.dataset.type)
    let hid = `${this.data.hid}`;
    let name = `${this.data.bodyMsg.name}`;
    // 埋点
    // let typeNav = '会员权益(扫码)';
    // this.setData({
    //   typeNav
    // })
    // let AAid = this.data.AAid;
    // let AARid = this.data.AARid;
    // let AAname = this.data.bodyMsg.name;
    // wx.reportAnalytics('vipindex_navbar', {
    //   AAid: AAid,
    //   AARid: AARid,
    //   typeNav: typeNav,
    //   AAname: AAname,
    // });
    // 埋点end
    // 判断是否登录
    // let haveVipId = this.data.haveVipId;
    // let memberId = this.data.memberId;
    // if (!haveVipId || !memberId) {
    //   wx.navigateTo({
    //     url: `../login/login?to=${typeNav}&hid=${hid}&name=${name}`,
    //   })
    //   return
    // }
    // 判断是否登录 end

    // 新埋点0322
    wx.reportAnalytics('to_vip_equity', {
      to_vip_equity_hid: hid,
      to_vip_equity_position: e.currentTarget.dataset.type,
    });

    wx.navigateTo({
      url: `../../vipPackage/pages/vipEquity/vipEquity?hid=${hid}&name=${name}&from=vipIndex`
    })
  },

  /* 扫码进入end */

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
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
    this.login();
    // 页面回到顶端
    if (wx.pageScrollTo) {
      wx.pageScrollTo({
        scrollTop: 0
      })
    }

    this.getHid();
    // this.getVipId();
    // this.getMsg();
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
  onShareAppMessage: function () {

  }
})