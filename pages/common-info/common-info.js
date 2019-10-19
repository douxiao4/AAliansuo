var tools = require('../../tools.js')
var config = require('../../config.js')
var API = require('../../API')
var app = getApp()
Page({
  data: {
    winWidth: 0,
    winHeight: 0,
    currentTab: 0,
  },
  onLoad: function (option) {
    this.setData({
      currentTab: option.id
    })
    var self = this
    new app.WeToast()
    tools.mta.Page.init()
    // 获取系统信息
    wx.getSystemInfo({
      success: function (res) {
        self.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        })
      }
    })
  },
  onShow: function () {
    var self = this
    self.searchOrderByMemNo()
  },
  // * 滑动切换tab
  bindChange: function (e) {
    var self = this
    self.setData({
      currentTab: e.detail.current
    })
  },
  // 点击tab切换
  swichNav: function (e) {
    var self = this
    if (this.data.currentTab === e.target.dataset.current) {
      return false
    } else {
      self.setData({
        currentTab: e.target.dataset.current
      })
    }
  },
  // 根据用户卡号查询订单列表
  searchOrderByMemNo: function () {
    var self = this
    self.wetoast.toast({
      title: '请稍后...',
      duration: 60000
    })
    var data = {
      memberId: wx.getStorageSync('memberId'),
      member_id: app.globalData.memberId,
      pageIndex: 1,
      pageSize: 10,
    }
    // 获取常旅
    // tools.save({
    //   url: '/travelerResource/v1.1/getAllTravelerByCreate',
    //   data: data,
    //   success: function(res) {
    //     self.wetoast.toast()
    //     self.setData({
    //       getAllTravelerByCreate: res.data.retValue
    //     })
    //   }
    // })
    tools.saveJAVA({
      url: API.getAllMemberPassenger,
      data: {
        member_id: app.globalData.memberId
      },
      success(res) {
        self.wetoast.toast();
        console.log('获取常旅')
        console.log(res)
        let list = [];
        if (res.data.errorCode == 50100) {
          list = [];
        } else {
          list = res.data;
        }
        self.setData({
          getAllTravelerByCreate: list
        })
      }
    })

    // 获取地址
    // tools.save({
    //   url: '/addressResource/v1.1/getAddress',
    //   data: data,
    //   success: function(res) {
    //     self.wetoast.toast()
    //     self.setData({
    //       getAddress: res.data.retValue
    //     })
    //   }
    // })
    tools.saveJAVA({
      url: API.getAllMemberAddress,
      data: {
        member_id: app.globalData.memberId
      },
      success(res) {
        self.wetoast.toast();
        let list = [];
        if (res.data.errorCode == 50100) {
          list = [];
        } else {
          list = res.data;
        }
        self.setData({
          getAddress: list
        })
      }
    })

    // 获取发票列表
    // tools.save({
    //   url: '/invoiceResource/v1.5/invoiceGet',
    //   data: data,
    //   success: function (res) {
    //     console.log(1111111111)
    //     console.log(res)
    //     self.wetoast.toast()
    //     self.setData({
    //       invoiceGet: res.data.retValue
    //     })
    //   }
    // })
    tools.saveJAVA({
      url: API.getAllMemberInvoice,
      data: {
        member_id: app.globalData.memberId
      },
      success(res) {
        self.wetoast.toast();
        let list = [];
        if (res.data.errorCode == 50100) {
          list = [];
        } else {
          list = res.data;
        }
        self.setData({
          invoiceGet: list
        })
      }
    })
  },
  // 打开新增
  addNewList: function (e) {
    wx.navigateTo({
      url: '../add-common-info/add-common-info?type=' + e.currentTarget.dataset.id
    })
  },
  // 打开编辑
  editList: function (e) {
    console.log(e);
    wx.navigateTo({
      // url: '../edit-common-info/edit-common-info?type=' + e.currentTarget.dataset.type + '&id=' + e.currentTarget.dataset.id + '&itype=' + e.currentTarget.dataset.itype
      url: `../edit-common-info/edit-common-info?type=${e.currentTarget.dataset.type}&id=${e.currentTarget.dataset.id}&itype=${e.currentTarget.dataset.itype}&index=${e.currentTarget.dataset.index}`
    })
  }

})