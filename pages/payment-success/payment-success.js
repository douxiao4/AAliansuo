var tools = require('../../tools.js')
var config = require('../../config.js')
var API=require('../../API')

var app = getApp()
Page({
  data: {
    orderNo: '',
    time: '',
    time1: ''
  },
  onLoad: function(option){
    /* new app.WeToast()
    tools.mta.Page.init()
    var self = this
    self.getMemberInfo();
    if( option.trade_id ){
      self.setData({
        orderNo: option.trade_id
      })
      self.searcOrderByOrdNo();

    }else{
    } */
  },
  onShow(){
    this.getMemberEquity();
  },

  // 查询订单详情
  /* searcOrderByOrdNo: function(){
    var self = this
    self.wetoast.toast({
      title: '请稍后...',
      duration: 60000
    })
    var data = {
      orderNo: self.data.orderNo
    }
    tools.save({
      // url: '/orderResource/v1.3/searcOrderByOrdNo',
      url: '/orderResource/v2.0/searcOrderByOrdNo',
      data: data,
      success: function(res) {
        console.log(res);
        if(res.data.retCode == 200){
          self.setData({
            searcOrderByOrdNo: res.data.retValue
          })
          self.wetoast.toast()
        }else{
          self.wetoast.toast({
            title: res.data.retMsg
          })
        }
      }
    })
  }, */
  // 获取会员信息
  /* getMemberInfo: function() {
    // var time = '19:00';

    var self = this;
    tools.save({
      //  url: '/memberResource/v1.1/memberInfo',
      url: '/memberResource/v2.0/memberInfo',
      data: {
        memberId: wx.getStorageSync('memberId')
      },
      success: function (res) {
        console.log(res);
        var time = self.data.time;
        var time1 = self.data.time1;
        if(res.data.retValue.memberCardLeave == '10001' || res.data.retValue.memberCardLeave == '20001'){
          time='19:00';
        }else if (res.data.retValue.memberCardLeave == "40001" || res.data.retValue.memberCardLeave == '30001') {
          time='20:00';
        }else if(res.data.retValue.memberCardLeave == "50001") {
          time='21:00';
        }
        if(res.data.retValue.memberCardLeave == '40001' || res.data.retValue.memberCardLeave == '50001'){
          time1 = '14:00'
        }else {
          time1 = '13:00'
        }
        self.setData({
          time: time,
          time1: time1
        })
      }

    })

  }, */
  /**
   * 会员权益 
   * */
  getMemberEquity() {
    let that=this;
    wx.showLoading({
      title:'加载中',
      mask:true
    })
    tools.saveJAVA({
      url: API.getMemberEquity,
      method: "GET",
      data:{
        memberId:app.globalData.memberId
        // memberId:'6922f80845b94fd594f2ac12b73256ab'
      },
      success(res) {
        wx.hideLoading();
        let msg=res.data;
        console.log(res);
        that.setData({
          time:msg.delay,
          time1:msg.preRetain
        })
      },
      fail: function() {
        wx.hideLoading();
      }
    })
  },
})