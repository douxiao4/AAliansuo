var tools = require('../../tools.js')
var API=require('../../API')
var app=getApp()
var config = require('../../config.js')

var app = getApp()
Page({
  data: {
    orderNo: '',
    // isTap: true,
    // couponsInfoText: '多晚/多间可多选',
    totalmoney: 0,
    // disable: false,
    // canUseClick: false
    click:false
  },
  onLoad: function (option) {
    this.setData({
      order_no:option.trade_id,
      channel_order_no: option.cid,
      totalmoney:option.price,
      click: true
    })
    // if (!trade_id){
    //   this.setData({
    //     order_no: option.cid
    //   })
    // }
    /* new app.WeToast()
    tools.mta.Page.init()
    var self = this
    if (option.trade_id) {
      self.setData({
        orderNo: option.trade_id,
      })
      self.searcOrderByOrdNo();
      var data = {
        orderNo: this.data.orderNo,
        ifStorageTimeDk: '-1',
        checked: this.data.checked || false
      }
      //self.useStorageTime(data);
    } else {
    }
    self.getCouponsNum(); */
  },
  onShow: function(){
    /* this.setData({
      couponsInfoText: '多晚/多间可多选',
    })
    this.searcOrderByOrdNo();*/
  }, 
  onHide: function(){
    //清除缓存中优惠券(为了避免短信影响，延迟3秒钟操作移除)
    //  setTimeout(() => {
    // wx.removeStorageSync('chooseCoupons');
    //  }, 3000);
  },

  // 新 lv 0315
  /**
   * 点击支付
   */
  tapPay(){
    if(!this.data.click){
      wx.showModal({
        title: '提示',
        content: '订单已支付',
        showCancel:false,
        success(){
          wx.redirectTo({
            url: "../payment-success/payment-success"
          })
        }
      })
      return
    }
    let that=this;
    tools.saveJAVA({
      url:API.payHotelFee,
      data:{
        memberId:app.globalData.memberId,
        channel_order_no: that.data.channel_order_no,
      },
      success(res){
        console.log(res)
        let payMsg = res.data;
        that.pay(payMsg);
      }
    })
  },

  /**
   * 实际调起支付
   */
  pay(payMsg) {
    let that=this;
    wx.requestPayment({
      'timeStamp': payMsg.timeStamp,
      'nonceStr': payMsg.nonceStr,
      'package': payMsg.package,
      'signType': 'MD5',
      'paySign': payMsg.paySign,

      success: function (res) {
        console.log(res)
        // wx.showToast({
        //   title: '支付成功',
        //   icon: 'success',
        //   mask: true,
        //   success() {}
        // })
        that.setData({
          click: false
        })
        
        wx.redirectTo({
          url: "../payment-success/payment-success"
        })
      },
      'fail': function (res) {
        console.log(res)
        wx.showToast({
          title: '支付失败',
          icon: 'none',
          mask: true,
        })
      },
      'complete': function (res) {
        console.log(res)
      }
    })
  },
  // 新 lv 0315 end

  // 查询订单详情
  /* searcOrderByOrdNo: function (storageTimeDk) {
    var ifStorageTimeDk = storageTimeDk || '-1';
    if(this.data.checked) {
      ifStorageTimeDk = 1;
    }
    var self = this
    wx.showToast({
      title: '请稍后...',
      icon: 'none',
      mask: true,
      duration: 60000
    })
    var data = {
      orderNo: self.data.orderNo,
      ifStorageTimeDk: ifStorageTimeDk
    }
    self.setData({
      ifStorageTimeDk: ifStorageTimeDk
    })
    tools.save({
      // url: '/orderResource/v1.3/searcOrderByOrdNo',
      // url: '/orderResource/v1.5/searcOrderByOrdNo',
      // url: '/orderResource/v1.7/searcOrderByOrdNo',
      url: '/orderResource/v2.0/searcOrderByOrdNo',
      data: data,
      success: function (res) {
        // console.log(res);
        if (res.data.retCode == 200) {
          //储存该订单的订房方式
          var openType = res.data.retValue.openType;
          //var timeCount = res.data.retValue.useStorageTimeCount;
          self.setData({
            openType: openType,
            //timeCount: timeCount
          })
          wx.setStorageSync('openType', self.data.openType);
          //判断时间储值是否禁用
          if(1*res.data.retValue.ifCanChangeMember <= 0 || res.data.retValue.ifCanChangeHotel != 1
              || res.data.retValue.couponsList.length > 0) {
            self.setData({
              disable: true
            })
          }else {
            self.setData({
              disable: false
            })
          }
          //判断优惠券是否可以点击
          var isTap = true;
          // var disable = self.data.disable;
          var couponsInfoText = self.data.couponsInfoText;
          var TM = 0;
          if(res.data.retValue.couponsList.length>0){
            isTap = false;
            // disable = true;
          }else if(res.data.retValue.openType == 2) {
            isTap = false;
            couponsInfoText = '不可使用';
          }else if(res.data.retValue.ifBlindCoupon == 1) {
            isTap = false;
            couponsInfoText = '不可选择';
          }else if(self.data.checked && res.data.retValue.openType==1) {
            isTap = false;
            couponsInfoText = '不与优惠券同时使用';
          }else {
            isTap = true;
          }
          //判断优惠券显示字样
          //如果已经绑定了优惠券，显示优惠券里的内容
          if(res.data.retValue.couponsList.length>0){
            //添加已优惠x元的字样
            var moneyTotal = 0;
            res.data.retValue.couponsList.forEach(e => {
              moneyTotal += e.couPrice*1;
            });
            couponsInfoText = '已优惠'+ moneyTotal + '元';
            TM = moneyTotal;
          }
          //如果缓存中有优惠券列表，显示缓存中的内容
          if(wx.getStorageSync('chooseCoupons').length>0){
            var moneyT = 0;
            // console.log(wx.getStorageInfoSync('chooseCoupons'));
            wx.getStorageSync('chooseCoupons').forEach(e=>{
              moneyT += e.couPrice*1;
            });
            couponsInfoText = '已优惠'+ moneyT + '元'
            // conponsInfoText = `已优惠${moneyT}元`
            TM = moneyT;
          }
          //获取入住日期和离店日期之间的天数
          var dayNum = tools.spendDateNum(res.data.retValue.checkInDate,res.data.retValue.checkOutDate);
          //获取最终金额的大小
          var lastMoney = res.data.retValue.totalPrice;
          if(self.data.checked) {
            TM = res.data.retValue.storageTimeDk;
          }
          // console.log(TM);
          lastMoney -= TM;
          self.setData({
            searcOrderByOrdNo: res.data.retValue,
            isTap: isTap,
            couponsInfoText: couponsInfoText,
            roomNum: res.data.retValue.roomNum,
            dayNum: dayNum,
            totalmoney: TM,
            lastMoney: lastMoney,
          })
          // console.log(self.data);
          setTimeout(function(){
            wx.hideToast();
          },1000)
        } else {
          wx.hideToast();
          wx.showToast({
            title: res.data.retMsg,
            icon: 'none',
            mask: true
          })
        }
      }
    })
  }, */
  
  //弹出确认绑定优惠券的按钮
  /* payBtn: function() {

    var that = this;
    var lm = that.data.lastMoney;
    if(lm <= 0){
      wx.showToast({
        title: '优惠券金额需小于实际支付金额，请重新选择!',
        icon:'none',
        mask: true
      })
      return false;
    }

    // //如果优惠券可以点击（既可以选择优惠券）
    if(that.data.isTap){
      wx.showModal({
        title:'优惠券支付规则',
        content: '点击确认支付后，不能修改优惠券，是否继续支付',
        confirmText: '确认支付',
        success: function(res){
          //点击确认
          if(res.confirm){
            //如果使用了优惠券，绑定优惠券和订单,并禁止时间储值的使用
            if(that.data.totalmoney > 0){
              that.setData({
                disable: true
              })
            }
            var obj = {};
            obj.memberId = wx.getStorageSync('memberId');
            obj.orderNo = that.data.orderNo;
            obj.couponsList = wx.getStorageSync('chooseCoupons') || [];
            tools.save({
              // url: '/orderResource/v1.6/addBindCoupons',
              url: '/orderResource/v2.0/addBindCoupons',
              data: obj,
              success: function(res) {
                // console.log(res);
                var money = res.data.retValue.paymentprice;
                //清除缓存中优惠券
                wx.removeStorageSync('chooseCoupons');
                that.payButton(money);
              }
            })
            // }else {
            //   that.payButton(that.data..totalPrice);
            // }
          }else if(res.cancel) {
            //重新渲染金额和优惠券说明,清除优惠券缓存
            //清除缓存中优惠券
            wx.removeStorageSync('chooseCoupons');
            var couponsInfoText = '多晚/多间可多选';
            this.setData({
              couponsInfoText:couponsInfoText,
              totalmoney: 0
            })
          }
        }
      })
    }else{
      that.payButton(that.data.searcOrderByOrdNo.totalPrice - that.data.totalmoney);
    }

  }, */
  // 支付按钮事件
  /* payButton: function (money) {
    var self = this
    self.setData({
      canUseClick: true
    })

    wx.showToast({
      title: '跳转支付中...',
      icon: 'loading',
      mask: true
    })
    if(money > 0) {
      var data = {
        memberId: wx.getStorageSync('memberId'),
        notifyurl: config.NOTIFY_URL,
        orderNo: self.data.orderNo,
        // totalFee: self.data.searcOrderByOrdNo.totalPrice,
        totalFee: money
      }
      // console.log(data);
      // console.log(data);
      tools.save({
        // url: '/weixinResource/v1.3/searchWeixinPageInfo',
        url: '/weixinResource/v2.0/searchWeixinPageInfo',
        data: data,
        success: function (res) {
          wx.hideToast();
          // console.log(res);
          if (res.data.retCode == 200) {
            // self.requestPayment(res.data.retValue)
            // console.log(res.data.retValue)
            self.payValidate(res.data.retValue)
            self.setData({
              canUseClick:false
            })
            self.wetoast.toast()

          } else {
            self.setData({
              canUseClick:false
            })
            self.wetoast.toast({
              title: res.data.retMsg
            })
          }
        }
      })
    }else if(money <= 0 && self.data.checked) {
      var data = {
        orderNo: self.data.orderNo,
      }
      tools.save({
        url: '/orderResource/v1.7/freeOrderByStorageTime',
        data: data,
        success: function(res){
          wx.hideToast();
          console.log(res);
          self.setData({
            canUseClick:false
          })
          if(res.data.retCode == 200){
            // wx.showToast({
            //   title: '已经支付成功',
            //   icon: 'success',
            //   duration: 2000
            // })
            // 支付完成后跳转到支付成功页面
            wx.redirectTo({
              url: "../payment-success/payment-success?trade_id" + self.data.orderNo
            })
          }
        }
      })
    }

  }, */
  // 支付之前校验支付
  /* payValidate: function (json) {
    var self = this
    var ifStorageTimeDk = self.data.ifStorageTimeDk;
    var data = {
      orderNo: self.data.orderNo,
      ifStorageTimeDk: ifStorageTimeDk
    }
    tools.save({
      url: '/orderResource/v2.0/payValidate',
      data: data,
      success: function (res) {
        // console.log(res);
        if (res.data.retCode == 200) {
          self.requestPayment(json)
        } else {
          self.wetoast.toast({
            title: res.data.retMsg
          })
        }
      }
    })
  }, */
  // 支付方法
  /* requestPayment: function (data) {
    var self = this
    wx.requestPayment({
      timeStamp: data.timeStamp,
      nonceStr: data.nonceStr,
      package: data.package,
      signType: data.signType,
      paySign: data.paySign,
      success: function (res) {
        // 支付完成后跳转到支付成功页面
        wx.redirectTo({
          url: "../payment-success/payment-success?trade_id" + self.data.orderNo
        })
      },
      fail: function (res) {
        self.wetoast.toast({
          title: '取消支付'
        })
      }
    })
  }, */

  // 跳转至卡券页面
  /* goToCoupons: function(){
    //判断是否可以点击，不可点击直接返回
    var isTap = this.data.isTap;
    // console.log(isTap);
    if(!isTap){
      return false;
    }
    //获取房间数和天数
    var dayNum = this.data.dayNum;
    var roomNum = this.data.roomNum;
    wx.navigateTo({
      url: '../lccoupons/lccoupons?page=2&dayNum='+dayNum+'&roomNum=' + roomNum+'&isTap=' + isTap
    })
  }, */

  // 获取可以使用的优惠券数
  /* getCouponsNum: function() {
    var that = this;
    tools.save({
      url: '/couponResource/v1.1/getMemAllCoupon',
      data: {
        memberId: wx.getStorageSync('memberId'),
        // memberId: 'J2130861212',
        status: 1
      },
      success: function (res) {
        console.log(res);
        if(res.data.retValue.count<=0){
          that.data.isTap = false;
        }else {
          that.data.isTap = true;
        };
      }
    })
  }, */

  // 改变单选的选中状态
  /* changeCheck: function(e) {
    var c = this.data.checked;
    this.data.checked = !c;
    wx.showToast({
      title:'请稍后...',
      icon: 'none',
      mask: true,
      duration: 6000
    })
    //设置后台扣除时间储值
    var data = {
      orderNo: this.data.orderNo,
      ifStorageTimeDk: '1',
      checked: this.data.checked
    }
    //this.useStorageTime(data);

    if(this.data.checked && wx.getStorageSync('openType')==1) {
      //清除缓存中的优惠券
      wx.removeStorageSync('chooseCoupons');
      //调用获取订单详情重新获取金额
      // this.searcOrderByOrdNo();
      this.setData({
        couponsInfoText: '不与优惠券同时使用'
      })
      //改变优惠券是否可以点击
      this.data.isTap = false;
    }else if(!this.data.checked && wx.getStorageSync('openType')==1) {
      // this.searcOrderByOrdNo(-1);
      this.setData({
        couponsInfoText: '多晚/多间可多选'
      })
      //改变优惠券是否可以点击
      this.data.isTap = true;
    }
    var timeCount = this.data.timeCount;
    if(this.data.checked){
      this.setData({
        timeText: '消耗'+ timeCount +'小时时间储值'
      })
    }else if(!this.data.checked) {
      this.setData({
        timeText: ''
      })
    }

    //判断该订单是否使用时间储值进行支付
    var k;
    this.data.checked == true ? k=1 : k=-1;
    this.searcOrderByOrdNo(k);
  } */
  // useStorageTime: function(data) {
  //   if(data.checked) {
  //     data.ifStorageTimeDk = '1';
  //   }else {
  //     data.ifStorageTimeDk = '-1';
  //   }
  //   tools.save({
  //     url: '/storageTimeResource/v1.1/storageTimeIfUse',
  //     data: data,
  //     success: function(res) {
  //       console.log(res);
  //     }
  //   })
  // }

})