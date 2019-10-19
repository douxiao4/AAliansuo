var tools = require('../../tools.js');
var app = getApp();
Page({

  data: {

  },
  onLoad: function (options) {
    // console.log(options);
    wx.showLoading({
      title: '正在加载...',
      icon: 'loading',
      mark: true
    })
    var page = 1;
    if(options.page) {
      page = options.page;
    }
    this.setData({
      page: page,
      isTap: options.isTap,
      roomNum: options.roomNum,
      dayNum: options.dayNum
    })
    // var resolve1 = this.getUserMarginInfo();
    // var resolve2 = this.getCouponsInfos();
    // var resolve3 = this.goToNew();
    var that = this;
    var promise1 = new Promise(function(resolve,project) {
      that.getCouponsInfos(resolve);
    })
    promise1.then(value=> that.getUserMarginInfo()).then(value=>that.goToNew())

  },
  onShow:function() {
    var that = this;
    var promise1 = new Promise(function(resolve,project) {
      that.getCouponsInfos(resolve);
    })
    promise1.then(value=> that.getUserMarginInfo()).then(value=>that.goToNew())
  },
  getCouponsInfos: function (fn) {
    var that = this;
    var status = 0;
    var page = that.data.page;
    var sortBy = page == 3? 2:1;
    if (that.data.page == 2) {
      status = 1;
    }
    console.log(status);
    tools.save({
      url: '/couponResource/v1.1/getMemAllCoupon',
      data: {
        memberId: wx.getStorageSync('memberId'),
        // memberId: 'J2130861212',
        // memberId: '18221519347',
        sortBy: sortBy,
        status: status
      },
      success: function (res) {
        console.log(res);

        var Arr = res.data.retValue.couponList;
        var UseArr = wx.getStorageSync('chooseCoupons') || [];
        // console.log(Arr);
        var newArr = [];
        var newArr0 = [];
        var newArr1 = [];
        var newArr2 = [];
        var times = '';
        wx.hideLoading();
        Arr.forEach((e,i) => {
          var obj = {};
          times = tools.getDays(e.eDate);
          // console.log(times);
          if(times > 0 && times < 7) {
            obj.time = times + '天过期';
            obj.isgary = false;
          }else if(times >= 7) {
            obj.time = e.assignDate + '至' + e.eDate;
            obj.isgary = true;
          }else if(times > -1 && times < 0){
            obj.time = '今日过期'
            obj.isgary = false;
          }else {
            obj.time = '已过期';
            obj.isgary = false;
          }
          obj.eDate = e.eDate;
          obj.assignDate = e.assignDate;
          obj.coupons = e.coupons;
          obj.assigner = e.assigner;
          obj.status = e.status;
          obj.couPrice = e.couPrice;
          obj.isWeekStr = tools.changeNumToWeak(e.isWeek);
          obj.isWeeks = e.isWeek;
          obj.page = that.data.page;
          obj.isUseful = e.isUseful;
          obj.isNew = e.isNew;
          if(tools.isInArr(e,UseArr)){
            obj.isChoose = true;
          }else{
            obj.isChoose = false;
          }
          if (obj.status == 1) {
            newArr0.push(obj);
          } else if (obj.status == 2) {
            newArr1.push(obj);
          } else {
            newArr2.push(obj);
          }
        });
        newArr = newArr0.concat(newArr1, newArr2);
        newArr.forEach((e, i) => {
          e.index = i;
        })

        // console.log(newArr);
        that.setData({
          datas: newArr,
          couponUseNum: res.data.retValue.count
        })
        console.log(that.data.datas);
        var index = 0;
        for(var i = 0; i <= that.data.datas.length; i++){
          if(that.data.datas[i].isNew==1){
            index = i;
            break;
          }
        }
        that.setData({
          index : index
        })
        fn(that.data.index)

      }
    })
  },
  //获取订单详情
  // 只有page=2的情况可以选择优惠券,如果数量是房间数*天数就自动返回支付页面
  chooseCoupons: function (e) {
    // console.log(e);
    if (e.currentTarget.dataset.page == 1 || this.data.isTap == false || e.currentTarget.dataset.page == 3) {
      return false;
    }
    var arr = this.data.datas;
    var numMax = this.data.roomNum * this.data.dayNum;
    // if(numMax > 5) {
    //   numMax = 5;
    // }
    var chooseArr = [];
    var chooseArr1 = wx.getStorageSync('chooseCoupons');
    if(chooseArr1.length >= numMax && arr[e.currentTarget.dataset.index].isChoose == false){
      wx.showToast({
        title: '本单最多选择'+numMax+'张订单',
        icon: 'none',
        mask: true
      })
      return;
    }
    arr.forEach((ele, i) => {
      if (e.currentTarget.dataset.index == i) {
        ele.isChoose = !ele.isChoose;
      }
      if (ele.isChoose) {
        chooseArr.push(ele);
      }
    })
    // console.log(chooseArr);
    //将选中的券信息存入缓存
    wx.setStorageSync('chooseCoupons', chooseArr);
    this.setData({
      datas: arr
    });
    //选中的券个数等于房间数*天数自动返回
    var nums = this.data.couponUseNum;
    if (chooseArr.length >= numMax || chooseArr.length >= nums) {
      wx.navigateBack();
    }
  },
  //页面调到新优惠券的地方
  goToNew: function (e) {
    if(this.data.page != 3){
      return false;
    }
    var index = this.data.index;
    var scale = this.data.scale;
    console.log(index,scale);
    var height = 256;
    var distance = height*index/scale;
    console.log(distance);
    // 一键回到顶部
    // if (wx.pageScrollTo) {
    wx.pageScrollTo({
      scrollTop: distance
    })
    // } else {
    //   wx.showModal({
    //     title: '提示',
    //     content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
    //   })
    // }
  },
  // 获取用户设备信息
  getUserMarginInfo: function() {
    var that = this;
    wx.getSystemInfo({
      success: function(res) {
        console.log(res);
        var screenWidth = res.screenWidth;
        var scale = 750/screenWidth;
        that.setData({
          scale: scale
        })
      }
    })
  },
  //房券码兑换
  roomExchange: function() {
    wx.navigateTo({
      url: '/pages/lcroomcodeex/lcroomcodeex'
    })
  }
})