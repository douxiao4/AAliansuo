var config = require('../../config.js')
var tools = require('../../tools.js')
var API = require('../../API')
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
        value: '企业',
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
        addTraveler: true,
        option: option
      }
    } else if (option.type == 2) {
      var data = {
        addAddress: true,
        option: option
      }
    } else if (option.type == 3) {
      var data = {
        addInvoice: true,
        option: option
      }
    }
    if (option.itype) {
      // switch (option.itype) {
      //   case '1':
      //     this.setData({
      //       items: [{
      //           name: 'gs',
      //           value: '公司'
      //         },
      //         {
      //           name: 'gr',
      //           value: '个人',
      //           checked: 'true'
      //         },
      //         {
      //           name: 'zzs',
      //           value: '增值税专用发票'
      //         }
      //       ],
      //       isGs: false,
      //       isGr: true,
      //       isZz: false
      //     })
      //     break;
      //   case '2':
      //     this.setData({
      //       items: [{
      //           name: 'gs',
      //           value: '公司'
      //         },
      //         {
      //           name: 'gr',
      //           value: '个人'
      //         },
      //         {
      //           name: 'zzs',
      //           value: '增值税专用发票',
      //           checked: 'true'
      //         }
      //       ],
      //       isGs: false,
      //       isGr: false,
      //       isZz: true
      //     })
      //     break;
      //   case '3':
      //     this.setData({
      //       items: [{
      //           name: 'gs',
      //           value: '公司',
      //           checked: 'true'
      //         },
      //         {
      //           name: 'gr',
      //           value: '个人'
      //         },
      //         {
      //           name: 'zzs',
      //           value: '增值税专用发票'
      //         }
      //       ],
      //       isGs: true,
      //       isGr: false,
      //       isZz: false
      //     })
      // }
      switch (option.itype) {
        case '个人':
          this.setData({
            items: [{
                name: 'gs',
                value: '企业'
              },
              {
                name: 'gr',
                value: '个人',
                checked: 'true'
              },
              {
                name: 'zzs',
                value: '增值税专用发票'
              }
            ],
            isGs: false,
            isGr: true,
            isZz: false
          })
          break;
        case '2':
          this.setData({
            items: [{
                name: 'gs',
                value: '企业'
              },
              {
                name: 'gr',
                value: '个人'
              },
              {
                name: 'zzs',
                value: '增值税专用发票',
                checked: 'true'
              }
            ],
            isGs: false,
            isGr: false,
            isZz: true
          })
          break;
        case '企业':
          this.setData({
            items: [{
                name: 'gs',
                value: '企业',
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
          })
      }
    }
    self.setData(data)
    self.getInfo(option)
  },
  // 获取数据详情 旅客信息/地址/发票
  getInfo: function (obj) {
    var self = this
    var memberId = wx.getStorageSync('memberId')
    // 常旅
    if (obj.type == 1) {
      console.log(obj)
      // tools.save({
      //   url: '/travelerResource/v1.1/getTravelerByIdAndCreate',
      //   data: {
      //     memberId: memberId,
      //     id: obj.id
      //   },
      //   success: function (res) {
      //     if (res.data.retCode == 200) {
      //       self.setData({
      //         getTravelerByIdAndCreate: res.data.retValue
      //       })
      //     } else {
      //       self.wetoast.toast({
      //         title: res.data.retMsg,
      //       })
      //     }
      //   }
      // })
      let index=+obj.index;
      tools.saveJAVA({
        url: API.getAllMemberPassenger,
        data: {
          member_id: app.globalData.memberId
        },
        success(res) {
          // self.wetoast.toast();
          console.log('获取常旅')
          console.log(res)
          let list = [];
          let cardIndex=0;
          if (res.data.errorCode == 50100) {
            list = [];
          } else {
            list = res.data;
            if(list[index].card_type==='身份证'){
              cardIndex=0;
            }else{
              cardIndex=1
            }
          }

          self.setData({
            getTravelerByIdAndCreate: list[index],
            cardIndex:cardIndex
          })
        }
      })
    } else if (obj.type == 2) {
      // 地址
      // tools.save({
      //   url: '/addressResource/v1.1/getAddress',
      //   data: {
      //     memberId: memberId,
      //     id: obj.id
      //   },
      //   success: function (res) {
      //     if (res.data.retCode == 200) {
      //       self.setData({
      //         getAddress: res.data.retValue[0],
      //         province: res.data.retValue[0].province,
      //         city: res.data.retValue[0].city,
      //         area: res.data.retValue[0].area,
      //       })
      //     } else {
      //       self.wetoast.toast({
      //         title: res.data.retMsg,
      //       })
      //     }
      //   }
      // })
      tools.saveJAVA({
        url: API.getAllMemberAddress,
        data: {
          member_id: app.globalData.memberId
        },
        success(res) {
          console.log(res.data[0])
          if (res.statusCode == 200) {
            let data = res.data[0]
            self.setData({
              getAddress: data,
              province: data.province,
              city: data.city,
              area: data.area,
            })
          }

        }
      })
    } else if (obj.type == 3) {
      // 发票
      // tools.save({
      //   url: '/invoiceResource/v1.5/invoiceGet',
      //   data: {
      //     memberId: memberId
      //   },
      //   success: function (res) {
      //     if (res.data.retCode == 200) {
      //       for (let i = 0; i < res.data.retValue.length; i++) {
      //         if (res.data.retValue[i].invoiceId == obj.id) {
      //           self.setData({
      //             invoiceGet: res.data.retValue[i]
      //           })
      //         }
      //       }
      //     } else {
      //       self.wetoast.toast({
      //         title: res.data.retMsg,
      //       })
      //     }
      //   }
      // })
      tools.saveJAVA({
        url: API.getAllMemberInvoice,
        data: {
          member_id: app.globalData.memberId
        },
        success(res) {
          let invoiceGet = null;
          if (res.statusCode == 200) {
            invoiceGet = res.data[0];
            console.log(invoiceGet)
            if (invoiceGet.invoice_rise === '企业') {
              self.setData({
                isGs: true,
                isGr: false,
                isZz: false
              })
            } else {
              self.setData({
                isGs: false,
                isGr: true,
                isZz: false
              })
            }
          }
          self.setData({
            invoiceGet
          })

        }
      })
    } else {

    }
  },
  // 提交旅客信息表单
  addTravelerForm: function (e) {
    var self = this
    //改变保存按钮的状态
    self.setData({
      isBtnUseful: true
    })
    var formData = e.detail.value;
    var idTypeMap = ['身份证', '护照']
    formData.idType = idTypeMap[formData.idType]
    formData.memberId = wx.getStorageSync('memberId')
    formData.id = self.data.option.id
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
    //显示正在保存的加载模态框
    wx.showLoading({
      title: '正在保存...',
      icon: 'none'
    })
    // 获取酒店数量和覆盖城市
    // tools.save({
    //   url: '/travelerResource/v1.1/updTraveler',
    //   data: formData,
    //   success: function (res) {
    //     wx.hideLoading();
    //     if (res.data.retCode == 200) {
    //       wx.navigateBack()
    //       //改变保存按钮的状态
    //       self.setData({
    //         isBtnUseful: false
    //       })
    //     } else {
    //       self.wetoast.toast({
    //         title: res.data.retMsg,
    //       })
    //       //改变保存按钮的状态
    //       self.setData({
    //         isBtnUseful: false
    //       })
    //     }
    //   }
    // })
    tools.saveJAVAjson({
      url:API.updateMemberPassengerById,
      data:{
        id:self.data.getTravelerByIdAndCreate.id,
        name:formData.name,
        phone:formData.phone,
        email:formData.email,
        card_number:formData.idCode,
        card_type:formData.idType,
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
    var formData = e.detail.value
    formData.memberId = wx.getStorageSync('memberId')
    formData.id = self.data.option.id
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
    //显示正在保存的加载模态框
    wx.showLoading({
      title: '正在保存...',
      icon: 'none'
    })
    let msg={
      // member_id:app.globalData.memberId,
      id:self.data.getAddress.id,
      name:formData.contactName,
      phone:formData.contactMobile,
      // address:`${formData.province}${formData.city}${formData.area}`,
      province:formData.province,
      city:formData.city,
      area:formData.area,
      address_detail:`${formData.address}`,
      postal_code:`${formData.postCode}`,
    };
    tools.saveJAVAjson({
      url:API.updateMemberAddressById,
      data:msg,
      success(res) {
        console.log(res)
        if (res.data.errorDesc === 'success') {
          wx.hideLoading({
            success() {
              wx.navigateBack({
                delta: 1
              })
            }
          })
        }else{
          wx.hideLoading();
          wx.showModal({
            title: '提示',
            content: '系统错误，请稍后再试！',
            showCancel: false
          })
        }
      },
      fail(err) {
        console.log(err)
        wx.hideLoading();
        wx.showModal({
          title: '提示',
          content: '系统错误，请稍后再试！',
          showCancel: false
        })
      }
    })
    // tools.save({
    //   url: '/addressResource/v1.1/updAddress',
    //   data: formData,
    //   success: function (res) {
    //     wx.hideLoading();
    //     if (res.data.retCode == 200) {
    //       wx.navigateBack()
    //       //改变保存按钮的状态
    //       self.setData({
    //         isBtnUseful: false
    //       })
    //     } else {
    //       self.wetoast.toast({
    //         title: res.data.retMsg,
    //       })
    //       //改变保存按钮的状态
    //       self.setData({
    //         isBtnUseful: false
    //       })
    //     }
    //   }
    // })
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
  //   formData.invoiceId = self.data.option.id
  //   //显示正在保存的加载模态框
  //   wx.showLoading({
  //     title: '正在保存...',
  //     icon: 'none'
  //   })
  //   tools.save({
  //     url: '/invoiceResource/v1.1/invoiceMod',
  //     data: formData,
  //     success: function (res) {
  //       wx.hideLoading();
  //       if (res.data.retCode == 200) {
  //         wx.navigateBack()
  //         //改变保存按钮的状态
  //         self.setData({
  //           isBtnUseful: false
  //         })
  //       } else {
  //         self.wetoast.toast({
  //           title: res.data.retMsg,
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
  // 删除按钮
  delBtn: function () {
    var that = this;
    wx.showModal({
      title: '确认需要删除吗？',
      success: function (res) {
        if (res.confirm) {
          that.delBtn1();
        }
      }
    })
  },
  delBtn1: function (e) {
    wx.showLoading({
      title: '删除中',
      mask: true
    });

    var self = this
    if (self.data.option.type == 1) {
      // tools.save({
      //   url: '/travelerResource/v1.1/delTraveler',
      //   data: {
      //     id: self.data.option.id,
      //     memberId: wx.getStorageSync('memberId')
      //   },
      //   success: function (res) {
      //     if (res.data.retCode == 200) {
      //       wx.navigateBack()
      //     } else {
      //       self.wetoast.toast({
      //         title: res.data.retMsg,
      //       })
      //     }
      //   }
      // })
      tools.saveJAVA({
        url: API.deleteMemberPassengerById,
        data: {
          id: self.data.getTravelerByIdAndCreate.id
        },
        success(res) {
          console.log(res)
          if (res.data.errorDesc === "success") {
            wx.hideLoading({
              success() {
                wx.navigateBack({
                  delta: 1
                })
              }
            })
          } else {
            wx.hideLoading()
            wx.showModal({
              title: '提示',
              content: '系统错误，请稍后再试！',
              showCancel: false
            })
          }
        },
        fail() {
          wx.hideLoading()
          wx.showModal({
            title: '提示',
            content: '系统错误，请稍后再试！',
            showCancel: false
          })
        }
      })
    } else if (self.data.option.type == 2) {
      // tools.save({
      //   url: '/addressResource/v1.1/delAddress',
      //   data: {
      //     id: self.data.option.id,
      //     memberId: wx.getStorageSync('memberId')
      //   },
      //   success: function (res) {
      //     if (res.data.retCode == 200) {
      //       wx.navigateBack()
      //     } else {
      //       self.wetoast.toast({
      //         title: res.data.retMsg,
      //       })
      //     }
      //   }
      // })
      tools.saveJAVA({
        url: API.deleteMemberAddressById,
        data: {
          id: self.data.getAddress.id
        },
        success(res) {
          console.log(res)
          if (res.data.errorDesc === "success") {
            wx.hideLoading({
              success() {
                wx.navigateBack({
                  delta: 1
                })
              }
            })
          } else {
            wx.hideLoading()
            wx.showModal({
              title: '提示',
              content: '系统错误，请稍后再试！',
              showCancel: false
            })
          }
        },
        fail() {
          wx.hideLoading()
          wx.showModal({
            title: '提示',
            content: '系统错误，请稍后再试！',
            showCancel: false
          })
        }
      })
    } else if (self.data.option.type == 3) {
      // tools.save({
      //   url: '/invoiceResource/v1.5/invoiceDel',
      //   data: {
      //     invoiceId: self.data.option.id,
      //     memberId: wx.getStorageSync('memberId')
      //   },
      //   success: function (res) {
      //     if (res.data.retCode == 200) {
      //       wx.navigateBack()
      //     } else {
      //       self.wetoast.toast({
      //         title: res.data.retMsg,
      //       })
      //     }
      //   }
      // })

      tools.saveJAVA({
        url: API.deleteMemberInvoiceById,
        data: {
          id: self.data.invoiceGet.id
        },
        success(res) {
          console.log(res)
          if (res.data.errorDesc === "success") {
            wx.hideLoading({
              success() {
                wx.navigateBack({
                  delta: 1
                })
              }
            })
          } else {
            wx.hideLoading()
            wx.showModal({
              title: '提示',
              content: '系统错误，请稍后再试！',
              showCancel: false
            })
          }
        },
        fail() {
          wx.showModal({
            title: '提示',
            content: '系统错误，请稍后再试！',
            showCancel: false
          })
        }
      })
    }
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
  // 更改发票抬头
  radioChange: function (e) {
    console.log(e);
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
   * 修改发票
   */
  formSubmit: function (e) {
    console.log(e);
    let that = this;
    let invoiceGet = this.data.invoiceGet;
    let msg = e.detail.value;
    let data = {};
    // data.member_id = app.globalData.memberId;
    data.company_name = `${msg.gsmc}`.trim();
    data.id = invoiceGet.id;
    data.member_id = app.globalData.memberId;

    if (!data.company_name || data.company_name == '') {
      wx.showModal({
        title: '提示',
        content: '抬头不能为空!',
        showCancel: false
      })
      return
    }
    if (msg['radio-group'] == 'gs') {
      console.log(111111111)
      data.invoice_rise = '企业';
      data.company_number = `${msg.sbh}`.trim();
      console.log(data.company_number)
      if (!data.company_number || data.company_number == '') {
        console.log(2222)
        wx.showModal({
          title: '提示',
          content: '税号不能为空!',
          showCancel: false
        })
        return
      }
    } else if (msg['radio-group'] == 'gr') {
      data.invoice_rise = '个人';
    }

    wx.showLoading({
      title: '保存中',
      mask: true
    })
    tools.saveJAVAjson({
      url: API.updateMemberInvoiceById,
      data: data,
      success(res) {
        console.log(res)
        if (res.data.errorDesc === 'success') {
          wx.hideLoading({
            success() {
              wx.navigateBack({
                delta: 1
              })
            }
          })
        }else{
          wx.hideLoading();
          wx.showModal({
            title: '提示',
            content: '系统错误，请稍后再试！',
            showCancel: false
          })
        }
      },
      fail(err) {
        console.log(err)
        wx.hideLoading();
        wx.showModal({
          title: '提示',
          content: '系统错误，请稍后再试！',
          showCancel: false
        })
      }
    })
    // var self = this;
    // var invoiceHead = e.detail.value.gsmc;
    // var identifyNo = e.detail.value.sbh;
    // self.setData({
    //   isBtnUseful: true
    // })
    // wx.showToast({
    //   title: '保存...',
    //   icon: 'none'
    // })
    // tools.save({
    //   url: '/invoiceResource/v1.5/invoiceMod',
    //   data: {
    //     invoiceHead: invoiceHead,
    //     invoiceId: self.data.option.id,
    //     identifyNo: identifyNo,
    //     memberId: wx.getStorageSync('memberId'),
    //     invoiceType: self.data.option.itype
    //   },
    //   success: function (e) {
    //     console.log(e);
    //     if (e.data.retCode == 200) {
    //       self.setData({
    //         isBtnUseful: true
    //       })
    //       wx.navigateBack({
    //         delta: 1
    //       })
    //     } else {
    //       self.setData({
    //         isBtnUseful: true
    //       })
    //       wx.showToast({
    //         title: res.data.retMsg,
    //         icon: 'none'
    //       })
    //     }
    //   }
    // })
    // if(invoiceType)
  }

})