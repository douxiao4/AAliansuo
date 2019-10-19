var tools = require('../../tools.js')
var config = require('../../config.js')
var Data = require("../../utils/data.js");
var API = require("../../API.js");
var app = getApp();

Page({
  data: {
    roomNums: 1,
    customerName: '',
    phone: '',
    // 发票相关的
    showInvoiceWrap: false, // 是否显示发票模块
    invoiceHead: '',
    needInvoice: false,
    showInvoiceSwitch: true,

    showPriceDetail: false,
    roomNums: 1,
    maxRoomNums: config.MAX_ROOM_NUMS
  },
  onLoad: function (options) {
    new app.WeToast()
    // 生命周期函数--监听页面加载
    console.log(options)
    let index = options.index;
    let openType = options.openType;
    let roomid = options.roomid;
    let hotelId = options.hotelId;

    let levelNum = app.globalData.levelNum;
    this.setData({
      index,
      openType,
      roomid,
      hotelId,
      levelNum,
    });
    this.getHotelInfo();
    // 有请求
    this.getRoomTime();
    this.getRoomType();
    this.setUser();
  },
  onShow: function () {
    // 生命周期函数--监听页面显示
    this.getInvoiceGet();
  },

  /**
   * 获取入住 退房时间 到店时间列表
   */
  getRoomTime() {
    let self = this;
    let checkIn = wx.getStorageSync('checkIn');
    let checkOut = wx.getStorageSync('checkOut');
    let countDays = tools.spendDateNum(checkIn, checkOut)
    this.setData({
      checkIn,
      checkOut,
      countDays
    })

    tools.save({
      url: '/commonResource/v1.1/getArrivateTime',
      data: {
        date: checkIn,
        openType: self.data.openType,
      },
      success: function (res) {
        self.setData({
          getArrivateTime: res.data.retValue,
          arriveTime: res.data.retValue[0],
          arriveTimes: res.data.retValue
        })
      }
    })
  },

  /**
   * 获取酒店信息
   */
  getHotelInfo() {
    let hotelName = wx.getStorageSync('hotelName');
    let hotelAddress = wx.getStorageSync('hotelAddress');
    this.setData({
      hotelName,
      hotelAddress
    })
  },

  /**
   * 获取房型 价格列表
   */
  getRoomType() {
    let that = this;
    tools.saveJAVA({
      url: API.avail,
      data: {
        hotel_id: that.data.hotelId,
        beginDate: that.data.checkIn,
        endDate: that.data.checkOut,
      },
      success(res) {
        console.log(res);
        if (res.data.status == 500) {
          wx.showModal({
            title: '提示',
            content: '系统错误，请稍后再试！',
            showCancel: false,
            success() {
              wx.navigateBack({
                delta: 1, // 回退前 delta(默认为1) 页面
              })
            }
          })
        } else {
          let index = that.data.index;
          let list = res.data.entity.prices[index];
          let maxRoomNums = config.MAX_ROOM_NUMS;
          if (maxRoomNums > list.minNum) {
            maxRoomNums = list.minNum;
          }
          that.setData({
            getRoomType: list,
            maxRoomNums: maxRoomNums,
          })
        }
        that.computedRoomList();
      }
    })
  },

  /**
   * 初始化入住人，代入常旅第一个
   */
  setUser() {
    let that = this;
    tools.saveJAVA({
      url: API.getAllMemberPassenger,
      data: {
        member_id: app.globalData.memberId
      },
      success(res) {
        console.log('获取常旅')
        console.log(res)
        let customerName = '';
        let phone = '';

        let list = [];
        if (res.data.errorCode == 50100) {
          list = [];
          customerName = '';
          phone = '';
        } else {
          list = res.data;
          customerName = list[0].name;
          phone = list[0].phone;
        }
        that.setData({
          // getAllTravelerByCreate: list,
          customerName,
          phone,
        })
      }
    })
  },

  /**
   * 打开发票填写/选择页面
   */
  openInvoicePage: function (e) {
    let that = this
    this.setData({
      showInvoiceWrap: true
    })
    // this.getInvoiceGet();
  },

  /**
   * 确认发票
   */
  confirmInvoice: function () {
    var self = this
    self.setData({
      showInvoiceWrap: false
    })
  },

  /**
   * 查看我的发票列表
   */
  openMyInvoiceList: function (e) {
    var self = this
    self.setData({
      showInvoiceSwitch: false
    })
    // self.invoiceGet()
  },

  /**
   * 是否需要发票
   */
  switchNeedInvoice: function (e) {
    var self = this
    // 246
    self.setData({
      needInvoice: e.detail.value,
      invoiceHead: ''
    })
  },

  /**
   * 新增发票
   */
  goToAdd: function () {
    wx.navigateTo({
      url: '../add-common-info/add-common-info?type=3',
      success: function (res) {
        // success
      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
      }
    })
  },

  /**
   * 选择发票
   */
  selectInvoiceBtn: function (e) {
    var self = this
    self.setData({
      invoiceHead: e.currentTarget.dataset.head,
      invoiceId: e.currentTarget.dataset.id,
      showInvoiceSwitch: true
    })
  },

  /**
   * 获取发票列表
   */
  getInvoiceGet() {
    let that = this;
    tools.saveJAVA({
      url: API.getAllMemberInvoice,
      data: {
        member_id: app.globalData.memberId
      },
      success(res) {
        let list = [];
        if (res.data.errorCode == 50100) {
          list = [];
        } else {
          list = res.data;
        }
        that.setData({
          invoiceGet: list
        })
      }
    })
  },

  /**
   * 选择到点时间
   */
  selectArrivateTime: function (e) {
    var self = this
    this.setData({
      arrivateTimeIndex: e.detail.value,
      arriveTime: self.data.getArrivateTime[e.detail.value]
    })
  },

  /**
   * 显示/隐藏明细
   */
  switchShowPriceDetail: function () {
    var self = this
    self.setData({
      showPriceDetail: !self.data.showPriceDetail
    })
  },

  /**
   * 增加减少房间数量
   */
  changeRoomNums: function (e) {
    var self = this
    if (e.currentTarget.dataset.type == 1) {
      if (self.data.roomNums == 1) {
        return false
      }
      self.setData({
        roomNums: self.data.roomNums - 1
      })
    } else {
      if (self.data.roomNums == self.data.maxRoomNums) {
        return false
      }
      self.setData({
        roomNums: self.data.roomNums + 1
      })
    }
    // 房价数量变化后重新计算总价格
    self.computedRoomList()
  },

  /**
   * 计算房价
   */
  computedRoomList() {
    let list = this.data.getRoomType.room_type_prices;
    let levelNum = app.globalData.levelNum;

    let totalPriceAct = 0;
    for (let i in list) {
      switch (levelNum) {
        case 'v1':
          totalPriceAct += +list[i].price;
          break;
        case 'v2':
          totalPriceAct += +list[i].aa_plus_price;
          break;
        case 'v3':
          totalPriceAct += +list[i].aa_pro_price;
          break;
        default:
          break;
      }
    }
    totalPriceAct = totalPriceAct * this.data.roomNums;
    this.setData({
      totalPriceAct
    })
  },

  /**
   * 绑定入住人填写
   */
  bindCustomerName: function (e) {
    this.setData({
      customerName: e.detail.value
    })
  },

  /**
   * 绑定手机号填写
   */
  bindPhone: function (e) {
    this.setData({
      phone: e.detail.value
    })
  },

  /**
   * 绑定备注填写
   */
  bindMemo: function (e) {
    this.setData({
      memo: e.detail.value
    })
  },

  /**
   * 表单验证
   */
  checkForm: function () {
    var self = this
    if (self.data.customerName.trim() == '') {
      self.wetoast.toast({
        title: '请输入入住人'
      })
      return false
    } else if (self.data.phone.trim() == '') {
      self.wetoast.toast({
        title: '请输入手机号'
      })
      return false;
    }
    return true;
  },

  /**
   * 订单提交
   */
  createOrder() {
    let self = this;
    // 判断是否有发票
    let hasInvoice = this.data.invoiceHead ? 1 : 0;
    let Invoice = null;
    // if (hasInvoice == 0) {
    //   Invoice = null;
    // } else {
    //   Invoice.invoice_rise = self.data.invoiceHead;
    //   Invoice.company_name = self.data.invoiceId;
    //   Invoice.id = +self.data.invoiceGet[0].id;
    // }
    if (hasInvoice == 0) {
      Invoice = null;
    } else {
      Invoice = +self.data.invoiceGet[0].id;
    }
    

    for (let i in self.data.getRoomType.room_type_prices){
      self.data.getRoomType.room_type_prices[i].price = 1
      self.data.getRoomType.room_type_prices[i].Wprc = 1
    }

    let data = {
      // param:{
      customer_name: self.data.customerName,
      contact_name: self.data.customerName,
      contact_phone: self.data.phone,
      hotel_code: wx.getStorageSync('hotelId'),
      room_type_code: wx.getStorageSync('roomTypeID'),
      room_type_name: wx.getStorageSync('roomName'),
      room_num: self.data.roomNums,
      start: self.data.checkIn,
      end: self.data.checkOut,
      arrival: self.data.checkIn + ' ' + self.data.arriveTime + ':00',
      pay_status: 1,
      // price_total: self.data.totalPriceAct * self.data.roomNums,
      price_total: self.data.totalPriceAct,
      remark: self.data.memo,
      price_list: self.data.getRoomType.room_type_prices,
      // },
      hasInvoice: hasInvoice,
      // Invoice: Invoice,
      invoiceId: Invoice,
      memberId: app.globalData.memberId,
      hotel_name : self.data.hotelName,
      address: self.data.hotelAddress
    }
    // console.log(data)
    // return
    tools.saveJAVAjson({
      url: API.orderSave,
      data,
      success(res) {
        console.log(res)
        if(res.data.entity){
          let entity=res.data.entity;
          console.log(entity)
          // return
          wx.redirectTo({
            // url: "../payment/payment?trade_id=" + entity.order_no
            // url: `../payment/payment?trade_id=${entity.order_no}&cid=${entity.channel_order_no}&price=${self.data.totalPriceAct}`
            url: `../payment/payment?trade_id=${entity}&cid=${entity}&price=${self.data.totalPriceAct}`
          })
        }else{
          wx.showModal({
            title:'提示',
            content:'订单创建失败，请稍后再试！',
            showCancel:false
          })
        }
        // 预订成功后跳转到支付页面
      },
      fail(err) {
        console.log(err)
        wx.showModal({
          title: '提示',
          content: '系统错误，请稍后再试！',
          showCancel: false
        })
      }
    })
  },

  /**
   * 订单保存按钮
   */
  paybtn: function () {
    var self = this
    // 表单验证
    // if (!self.checkForm()) {
    //   return false
    // }
    // self.createOrder()

    if (self.checkForm()) {
      self.createOrder()
    }
  },

  onReady: function () {
    // 生命周期函数--监听页面初次渲染完成
  },
  onHide: function () {
    // 生命周期函数--监听页面隐藏
  },
  onUnload: function () {
    // 生命周期函数--监听页面卸载
  },
  onPullDownRefresh: function () {
    // 页面相关事件处理函数--监听用户下拉动作
  },
  onReachBottom: function () {
    // 页面上拉触底事件的处理函数
  },
  onShareAppMessage: function () {
    // 用户点击右上角分享
  }
})