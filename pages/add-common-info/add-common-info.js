var config = require('../../config.js')
var tools = require('../../tools.js')
var API=require('../../API')
var app = getApp()

var cityData = require('../../utils/cityData.js')
var provinces = []
for (let i = 0; i < cityData.length; i++) {
  provinces.push(cityData[i].name)
}
var citys = []
for (let i = 0; i < cityData[0].city.length; i++) {
  citys.push(cityData[0].city[i].name)
}
var areas = []
for (let i = 0; i < cityData[0].city[0].area.length; i++) {
  areas.push(cityData[0].city[0].area[i])
}

Page({
  data: {
    addTraveler: false,
    addAddress: false,
    addInvoice: false,
    // 新增身份证信息
    cardArray: ['身份证', '护照'],
    cardIndex: 0,

    // 新增地址选择器
    showCityPickerView: false,
    provinces: provinces,
    province: cityData[0].name,
    citys: citys,
    city: cityData[0].city[0].name,
    areas: areas,
    area: cityData[0].city[0].area[0],
    value: [0, 0, 0],
    isBtnUseful: false,
    items: [{
      name: 'gs',
      value: '公司',
      checked: 'true'
    },
      {
        name: 'gr',
        value: '个人'
      },
      {
        name: 'zzs',
        value: '增值税专用发票'
      }
    ],
    isGs: true,
    isGr: false,
    isZz: false
    // 新增发票
  },
  onLoad: function (option) {
    var self = this
    new app.WeToast()
    tools.mta.Page.init()
    if (option.type == 1) {
      var data = {
        addTraveler: true
      }
    } else if (option.type == 2) {
      var data = {
        addAddress: true
      }
    } else if (option.type == 3) {
      var data = {
        addInvoice: true
      }
    } else {

    }
    self.setData(data)
  },

  // 提交旅客信息表单
  addTravelerForm: function (e) {
    var self = this
    //改变保存按钮的状态
    self.setData({
      isBtnUseful: true
    })
    var formData = e.detail.value
    //手机号校验
    var phoneReg = /^1\d{10}$/
    if (!phoneReg.test(formData.phone)) {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none'
      })
      //改变保存按钮的状态
      self.setData({
        isBtnUseful: false
      })
      return false
    }
    //身份证和护照校验
    // var idTypeMap = ['身份证', '护照']
    // formData.idType = idTypeMap[formData.idType]
    // var idcodeRegS = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/
    // var idcodeRegH = /^1[45][0-9]{7}|([P|p|S|s]\d{7})|([S|s|G|g]\d{8})|([Gg|Tt|Ss|Ll|Qq|Dd|Aa|Ff]\d{8})|([H|h|M|m]\d{8，10})$/
    // if (formData.idType == '身份证') {
    //   if (!idcodeRegS.test(formData.idCode)) {
    //     wx.showToast({
    //       title: '请输入正确的身份证号',
    //       icon: 'none'
    //     })
    //改变保存按钮的状态
    //     self.setData({
    //       isBtnUseful: false
    //     })
    //     return false;
    //   }
    // } else if (formData.idType == '护照') {
    // if (!idcodeRegH.test(formData.idCode)) {
    //   wx.showToast({
    //     title: '请输入正确的护照号',
    //     icon: 'none'
    //   })
    //   //改变保存按钮的状态
    //   self.setData({
    //     isBtnUseful: false
    //   })
    //   return false;
    // }
    // }
    //邮箱校验
    // var emailReg = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/;
    // if (!emailReg.test(formData.email)) {
    //   wx.showToast({
    //     title: '请输入正确的邮箱',
    //     icon: 'none'
    //   })
    //   //改变保存按钮的状态
    //   self.setData({
    //     isBtnUseful: false
    //   })
    //   return false;
    // }
    formData.member_id = wx.getStorageSync('memberId')
    //显示正在保存的加载模态框
    wx.showLoading({
      title: '正在保存...',
      icon: 'none'
    })
    // 获取酒店数量和覆盖城市
    // tools.save({
    //   url: '/travelerResource/v1.1/addTraveler',
    //   data: formData,
    //   success: function (res) {
    //     wx.hideLoading();
    //     if (res.data.retCode == 200) {
    //       //改变保存按钮的状态
    //       self.setData({
    //         isBtnUseful: false
    //       })
    //       wx.navigateBack()
    //     } else {
    //       wx.showToast({
    //         title: res.data.retMsg,
    //         icon: 'none'
    //       })
    //       //改变保存按钮的状态
    //       self.setData({
    //         isBtnUseful: false
    //       })
    //     }
    //   }
    // })
    console.log(formData);
    tools.saveJAVAjson({
      url:API.insertMemberPassenger,
      data:{
        member_id:app.globalData.memberId,
        name:formData.name,
        phone:formData.phone,
        email:formData.email,
        card_number:formData.idCode,
        card_type:formData.idType==0?'身份证':'护照',
      },
      success(res){
        console.log(res)
        let errorCode=res.data.errorCode;
        if(errorCode===0){
          self.setData({
            isBtnUseful: true
          })
          wx.hideLoading()
          wx.navigateBack({
            delta: 1
          })
        }else{
          self.setData({
            isBtnUseful: true
          })
          wx.hideLoading()
          wx.showModal({
            title:'提示',
            content:'系统错误，请稍后再试！',
            showCancel:false
          })
        }
      },
      fail(err) {
        console.log(err)
        wx.hideLoading()
        wx.showModal({
          title:'提示',
          content:'系统错误，请稍后再试！',
          showCancel:false
        })
      }
    })
  },

  // 提交地址表单
  addAddressForm: function (e) {
    var self = this
    //改变保存按钮的状态
    self.setData({
      isBtnUseful: true
    })
    var formData = e.detail.value;
    formData.member_id = wx.getStorageSync('memberId')
    formData.province = self.data.province
    formData.city = self.data.city
    formData.area = self.data.area
    //手机号校验
    var phoneReg = /^1\d{10}$/
    if (!phoneReg.test(formData.contactMobile)) {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none'
      })
      //改变保存按钮的状态
      self.setData({
        isBtnUseful: false
      })
      return false
    }
    //邮政编码校验
    // var postalReg = /^[1-9]\d{5}$/
    // if (!postalReg.test(formData.postCode)) {
    //   wx.showToast({
    //     title: '请输入正确的邮政编码',
    //     icon: 'none'
    //   })
    //改变保存按钮的状态
    //   self.setData({
    //     isBtnUseful: false
    //   })
    //   return false;
    // }
    //显示正在保存的加载模态框
    wx.showLoading({
      title: '正在保存...',
      icon: 'none'
    })

    // tools.save({
    //   url: '/addressResource/v1.1/insertAddress',
    //   data: formData,
    //   success: function (res) {
    //     wx.hideLoading();
    //     if (res.data.retCode == 200) {
    //       //改变保存按钮的状态
    //       self.setData({
    //         isBtnUseful: false
    //       })
    //       wx.navigateBack()
    //     } else {
    //       wx.showToast({
    //         title: res.data.retMsg,
    //         icon: 'none'
    //       })
    //       //改变保存按钮的状态
    //       self.setData({
    //         isBtnUseful: false
    //       })
    //     }
    //   }
    // })
    let msg={
      member_id:app.globalData.memberId,
      name:formData.contactName,
      phone:formData.contactMobile,
      // address:`${formData.province}${formData.city}${formData.area}`,
      province:formData.province,
      city:formData.city,
      area:formData.area,
      address_detail:`${formData.address}`,
      postal_code:`${formData.postCode}`,
    };
    console.log(formData)
    console.log(msg)
    tools.saveJAVAjson({
      url:API.insertMemberAddress,
      data:msg,
      // success(res){
      //   console.log(res)
      //   let errorCode=res.data.errorCode;
      //   if(errorCode===0){
      //     self.setData({
      //       isBtnUseful: true
      //     })
      //     wx.navigateBack({
      //       delta: 1
      //     })
      //   }else{
      //     self.setData({
      //       isBtnUseful: true
      //     })
      //     wx.showModal({
      //       title:'提示',
      //       content:'系统错误，请稍后再试！',
      //       showCancel:false
      //     })
      //   }
      // },
      // fail(err) {
      //   console.log(err)
      //   wx.showModal({
      //     title:'提示',
      //     content:'系统错误，请稍后再试！',
      //     showCancel:false
      //   })
      // }
      success(res){
        console.log(res)
        let errorCode=res.data.errorCode;
        if(errorCode===0){
          self.setData({
            isBtnUseful: true
          })
          wx.hideLoading()
          wx.navigateBack({
            delta: 1
          })
        }else{
          self.setData({
            isBtnUseful: true
          })
          wx.hideLoading()
          wx.showModal({
            title:'提示',
            content:'系统错误，请稍后再试！',
            showCancel:false
          })
        }
      },
      fail(err) {
        console.log(err)
        wx.hideLoading()
        wx.showModal({
          title:'提示',
          content:'系统错误，请稍后再试！',
          showCancel:false
        })
      }
    })
  },

  // 提交发票表单
  // addInvoiceForm: function (e) {
  //   var self = this
  //   //改变保存按钮的状态
  //   self.setData({
  //     isBtnUseful: true
  //   })
  //   var formData = e.detail.value
  //   formData.memberId = wx.getStorageSync('memberId')
  //   //显示正在保存的加载模态框
  //   wx.showLoading({
  //     title: '正在保存...',
  //     icon: 'none'
  //   })
  //   tools.save({
  //     url: '/invoiceResource/v1.1/invoiceAdd',
  //     data: formData,
  //     success: function (res) {
  //       wx.hideLoading();
  //       if (res.data.retCode == 200) {
  //         //改变保存按钮的状态
  //         self.setData({
  //           isBtnUseful: false
  //         })
  //         wx.navigateBack()
  //       } else {
  //         wx.showToast({
  //           title: res.data.retMsg,
  //           icon: 'none'
  //         })
  //         //改变保存按钮的状态
  //         self.setData({
  //           isBtnUseful: false
  //         })
  //       }
  //     }
  //   })
  //   tools.save({
  //     url: '/invoiceResource/v1.1/invoiceAdd',
  //     data: formData,
  //     success: function (res) {
  //       wx.hideLoading();
  //       if (res.data.retCode == 200) {
  //         //改变保存按钮的状态
  //         self.setData({
  //           isBtnUseful: false
  //         })
  //         wx.navigateBack()
  //       } else {
  //         wx.showToast({
  //           title: res.data.retMsg,
  //           icon: 'none'
  //         })
  //         //改变保存按钮的状态
  //         self.setData({
  //           isBtnUseful: false
  //         })
  //       }
  //     }
  //   })
  // },
  // 返回按钮
  backBtn: function () {
    wx.navigateBack()
  },
  // 证件类型选择器
  bindCardChange: function (e) {
    this.setData({
      cardIndex: e.detail.value
    })
  },
  // 地址选择器
  bindAddressChange: function (e) {
    var self = this
    const val = e.detail.value
    var c = []
    for (let i = 0; i < cityData[val[0]].city.length; i++) {
      c.push(cityData[val[0]].city[i].name)
    }
    var a = []
    for (let i = 0; i < cityData[val[0]].city[val[1]].area.length; i++) {
      a.push(cityData[val[0]].city[val[1]].area[i])
    }

    if (val[0] != self.data.value[0]) {
      self.setData({
        citys: c,
        areas: a,
        province: this.data.provinces[val[0]],
        city: cityData[val[0]].city[0].name,
        area: cityData[val[0]].city[0].area[0],
        value: [val[0], 0, 0]
      })
      return false
    }

    if (val[1] != self.data.value[1]) {
      self.setData({
        areas: a,
        province: this.data.provinces[val[0]],
        city: this.data.citys[val[1]],
        area: cityData[val[0]].city[val[1]].area[0],
        value: [val[0], val[1], 0]
      })
      return false
    }

    this.setData({
      citys: c,
      areas: a,
      province: this.data.provinces[val[0]],
      city: this.data.citys[val[1]],
      area: this.data.areas[val[2]],
      value: val
    })
  },
  // 打开城市选择器
  openCityPickerView: function (e) {
    var self = this
    self.setData({
      showCityPickerView: true
    })
  },
  // 关闭城市选择器
  closeCityPickerView: function (e) {
    var self = this
    self.setData({
      showCityPickerView: false
    })
  },
  radioChange: function (e) {
    // console.log(e);
    switch (e.detail.value) {
      case 'gs':
        this.setData({
          isGs: true,
          isGr: false,
          isZz: false
        })
        break;
      case 'gr':
        this.setData({
          isGs: false,
          isGr: true,
          isZz: false
        })
        break;
      case 'zzs':
        this.setData({
          isGs: false,
          isGr: false,
          isZz: true
        })
        break;
    }
    console.log(this.data.isGs, this.data.isGr, this.data.isZz)
  },

  /**
   * 发票
   */
  formSubmit: function (e) {
    // console.log(e);
    var self = this;
    // var invoiceType = '';
    var invoice_rise = '';
    switch(e.detail.value['radio-group']){
      case 'gs':
        // invoiceType = '3';
        invoice_rise='企业';
        break;
      case 'gr':
        // invoiceType = '1';
        invoice_rise='个人';
        break;
    }
    var invoiceHead =`${e.detail.value.gsmc}`.trim();
    var identifyNo = `${e.detail.value.sbh}`.trim();
    if(!invoiceHead || invoiceHead==''){
      wx.showModal({
        title:'提示',
        content:'抬头不能为空!',
        showCancel:false
      })
      return
    }
    if(invoice_rise==='企业'){
      if(!identifyNo || identifyNo==''){
        wx.showModal({
          title:'提示',
          content:'税号不能为空!',
          showCancel:false
        })
        return
      }
    }else if(invoice_rise==='个人'){
      identifyNo='';
    }
    self.setData({
      isBtnUseful: true
    })

    // wx.showToast({
    //   title: '保存...',
    //   icon: 'none'
    // })
    // tools.save({
    //   url: '/invoiceResource/v1.5/invoiceAdd',
    //   data:{
    //     invoiceHead: invoiceHead,
    //     identifyNo: identifyNo,
    //     memberId: wx.getStorageSync('memberId'),
    //     invoiceType: invoiceType
    //   },
      // success: function(e){
      //   // console.log(e);
      //   if(e.data.retCode == 200) {
      //     self.setData({
      //       isBtnUseful: true
      //     })
      //     wx.navigateBack({
      //       delta: 1
      //     })
      //   }else {
      //     self.setData({
      //       isBtnUseful: true
      //     })
      //     wx.showToast({
      //       title: res.data.retMsg,
      //       icon: 'none'
      //     })
      //   }
      // }
    // })

    // 类型
    // let invoice_rise='';
    // if(invoiceType===1){
    //   invoice_rise='个人';
    // }else if(invoiceType===3){
    //   invoice_rise='企业';
    // }
    // 抬头
    let company_name=invoiceHead;
    // 税号
    let company_number=identifyNo;
    tools.saveJAVAjson({
      url:API.insertMemberInvoice,
      data:{
        member_id:app.globalData.memberId,
        invoice_rise,
        company_name,
        company_number
      },
      success(res){
        console.log(res)
        let errorCode=res.data.errorCode;
        if(errorCode===0){
          self.setData({
            isBtnUseful: true
          })
          wx.navigateBack({
            delta: 1
          })
        }else{
          self.setData({
            isBtnUseful: true
          })
          wx.showModal({
            title:'提示',
            content:'系统错误，请稍后再试！',
            showCancel:false
          })
        }
      },
      fail(err) {
        console.log(err)
        wx.showModal({
          title:'提示',
          content:'系统错误，请稍后再试！',
          showCancel:false
        })
      }
    })
  },
  /**
   * 发票
   */
  // formSubmit(){
  //   var self = this;
  //   var invoiceType = '';
  //   switch(e.detail.value['radio-group']){
  //     case 'gs':
  //       invoiceType = '3';
  //       break;
  //     case 'gr':
  //       invoiceType = '1';
  //       break;
  //   }
  //   var invoiceHead = e.detail.value.gsmc;
  //   var identifyNo = e.detail.value.sbh;
  //   self.setData({
  //     isBtnUseful: true
  //   })
  //   wx.showToast({
  //     title: '保存...',
  //     icon: 'none'
  //   })
  // },

})