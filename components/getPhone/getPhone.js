// components/getPhone/getPhone.js
var app = getApp();
var tools = require('../../tools');
var API = require('../../API');
Component({
  properties: {},
  methods: {
    getPhoneNumber: function (e) {
      console.log(e)
      // console.log(app)
      let that = this;
      if (e.detail.errMsg === 'getPhoneNumber:ok') {
        var myEventDetail = {} // detail对象，提供给事件监听函数
        let encryptedData = e.detail.encryptedData;
        let iv = e.detail.iv;
        wx.showLoading({
          title: '授权中',
          mask: true
        })
        // 发给后台获取手机号
        tools.saveJAVAjson({
          url: API.getPhone,
          data: {
            code: app.globalData.code,
            encryptedData: encryptedData,
            iv: iv,
            // hotelId:app.globalData.AAid,
          },
          success: function (res) {
            console.log(res);
            wx.hideLoading();
            let msg = res.data.msg;
            if (msg === '保存成功！') {
              wx.showTabBar();
              myEventDetail.levelNum = 'v1';
              myEventDetail.hasPhone = true;
              myEventDetail.phoneNum = res.data.phoneNum;
              myEventDetail.cardLevel = res.data.cardLevel;
              myEventDetail.discountPrice = res.data.discountPrice;

              app.globalData.hasPhone = true;
              app.globalData.levelNum = res.data.levelNum;
              app.globalData.memberId = res.data.memberId;
              app.globalData.cardLevel = res.data.cardLevel;
              app.globalData.discountPrice = res.data.discountPrice;
              app.globalData.phoneNum = res.data.phoneNum;
              var myEventOption = {} // 触发事件的选项
              that.triggerEvent('getPhone', myEventDetail, myEventOption);

              // 向后台发送酒店id
              let smHotelCode = '';
              if (app.globalData.AAid) {
                tools.savePHP({
                  url: API.hotelIndex,
                  data: {
                    "id": app.globalData.AAid,
                    'openid': 'openid',
                  },
                  success: function (res) {
                    smHotelCode = res.data.data[0].aHid;
                    tools.saveJAVA({
                      url: API.insertHotelInfo,
                      data: {
                        memberId: app.globalData.memberId,
                        // smHotelCode: smHotelCode
                        smHotelCode: '00650'
                      },
                      method: 'GET',
                      success(res) {}
                    })
                  }
                })
              } else {
                smHotelCode = '';
                tools.saveJAVA({
                  url: API.insertHotelInfo,
                  data: {
                    memberId: app.globalData.memberId,
                    smHotelCode: smHotelCode
                    // smHotelCode: '00650'
                  },
                  method: 'GET',
                  success(res) {}
                })
              }
              // 向后台发送酒店id end
            }
          },
          fail: function (err) {
            console.log(err);
            wx.hideLoading();
          }
        })

      }
    },
    /* sendHid() {
      let smHotelCode = null;
      if (app.globalData.AAid) {
        tools.savePHP({
          url: API.hotelIndex,
          data: {
            "id": app.globalData.AAid,
            'openid': 'openid',
          },
          success: function (res) {
            smHotelCode = res.data.data[0].aHid;
          }
        })
      } else {
        smHotelCode = null;
      }
      tools.saveJAVA({
        url: API.insertHotelInfo,
        data: {
          memberId: app.globalData.memberId,
          smHotelCode: smHotelCode
        },
        method: 'GET',
        success(res) {}
      })
    } */
  }
})