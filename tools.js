/**
 * 常用工具函数
 */
var config = require('config.js')
var md5 = require('utils/md5.js')
var mta = require('./utils/mta_analysis.js')
var API = require('./API')

// 获取年月日日期
function getDateStr(count) {
  if (typeof count === 'undefined') {
    var count = 0
  }
  var dd = new Date()
  dd.setDate(dd.getDate() + count);
  var y = dd.getFullYear()
  var m = dd.getMonth() + 1
  m = (m.toString()).length == 1 ? 0 + m.toString() : m
  var d = dd.getDate()
  d = (d.toString()).length == 1 ? 0 + d.toString() : d
  return y + '-' + m + '-' + d
}

// 获取日期相差天数
function spendDateNum(sDate, eDate) {
  var startDate = new Date(sDate)
  var endDate = new Date(eDate)
  var time = endDate.getTime() - startDate.getTime()
  return Math.floor(time / (24 * 60 * 60 * 1000))
}

// 获取某天+n天
function getDayAfterNum(sDate, num) {
  var dd = new Date(sDate)
  dd = +dd + 1000 * 60 * 60 * 24 * num
  dd = new Date(dd)
  var mouths = dd.getMonth() + 1
  var date = dd.getDate()
  return dd.getFullYear() + "-" + (mouths < 10 ? '0' : '') + (mouths) + "-" + (date < 10 ? '0' : '') + date
}

// 对象转URL参数
function urlEncode(param, key, encode) {
  if (param == null) return ''
  var paramStr = ''
  var t = typeof (param)
  if (t == 'string' || t == 'number' || t == 'boolean') {
    paramStr += '&' + key + '=' + ((encode == null || encode) ? encodeURIComponent(param) : param)
  } else {
    for (var i in param) {
      var k = key == null ? i : key + (param instanceof Array ? '[' + i + ']' : '.' + i)
      paramStr += urlEncode(param[i], k, encode)
    }
  }
  return paramStr
}

// 通用异步请求方法
function save(options) {
  //设置默认信息
  var defaultOption = {
    method: "POST",
    dataType: 'json',
    header: {
      'content-type': 'application/json'
    }
  }
  options.data = Object.assign({}, options.data, config.VERSION_INFO)
  options = Object.assign({}, defaultOption, options)
  wx.request({
    url: config.API_URL + options.url,
    data: options.data,
    header: options.header,
    method: options.method,
    dataType: options.dataType,
    success: function (res) {
      options.success(res)
    },
    error: function (err) {
      options.error(err)
    }
  })
}

// 百度地图坐标转腾讯地图坐标
function mapBdToTeng(opt) {
  var data = {
    locations: opt.lat + ',' + opt.lng,
    type: 3,
    key: config.TENGMAP_KEY
  }
  wx.request({
    url: config.API_MAP_URL,
    data: data,
    header: {
      'content-type': 'application/json'
    },
    method: 'get',
    dataType: 'json',
    success: function (res) {
      if (res.data.status == 0) {
        opt.success(res.data.locations[0])
      } else {
        opt.success(opt)
      }
    },
    error: function (err) {
      opt.success(opt)
    }
  })
}

// 获取 code
function getCode(self, callback) {
  !(typeof callback == 'function') ? (callback = function () {}) : ''
  wx.login({
    success: function (res) {
      self.setData({
        code: res.code
      })
      callback()
    },
    fail: function () {
      return false
    }
  })
}

// 将数组array转化成每count个数组成的数组
function group(array, count) {
  var index = 0;
  var newArray = [];
  while (index < array.length) {
    newArray.push(array.slice(index, index += count));
  }
  return newArray;
}

// 将电话号码中间四位转化成*
function changeTelNum(tel) {
  return tel.substr(0, 3) + '****' + tel.substr(7);
}

//将数据转化成周几
function changeNumToWeak(str) {
  //将字符串转化成数组
  var arr = str.split(';');
  var newStr = '';
  if (arr.length >= 7 || str == '7') {
    newStr = '不限于周几使用'
  } else {
    //遍历数组将数字转化成汉字
    var newArr = [];
    arr.forEach((e, i) => {
      switch (e) {
        case '0':
          newArr.push('日');
          break;
        case '1':
          newArr.push('一');
          break;
        case '2':
          newArr.push('二');
          break;
        case '3':
          newArr.push('三');
          break;
        case '4':
          newArr.push('四');
          break;
        case '5':
          newArr.push('五');
          break;
        case '6':
          newArr.push('六');
          break;
      }
    })
    newStr = '仅在周(' + newArr.join(',') + ')可使用';
  }
  return newStr;
}

//将后台的星星数字转化为数组
function convertToStarsArray(stars) {
  var num = stars.toString().substring(0, 1);
  var num1 = num * 1 + 1;
  var arr = [];
  if (stars % 1 === 0) {
    for (var i = 1; i <= 5; i++) {
      if (i <= num) {
        arr.push(1);
      } else {
        arr.push(0);
      }
    }
  } else {
    for (var i = 1; i <= 5; i++) {
      if (i <= num) {
        arr.push(1);
      } else if (i == num1) {
        arr.push(2);
      } else {
        arr.push(0);
      }
    }
  }
  return arr;
}

//删除数组中的某个元素
function remove(arr, val) {
  var index = arr.indexOf(val);
  if (index > -1) {
    arr.splice(index, 1);
  }
  return arr;
};
//判断是否在数组中
function isInArr(ele, arr) {
  var isChoose = false;
  arr.forEach((e, i) => {
    if (ele.coupons == e.coupons) {
      isChoose = true;
    }
  })
  return isChoose;
}

//当前日期截止一个日期的天数
function getDays(day) {
  var today = new Date().getTime();
  var time = new Date(day).getTime();
  var ds = time - today;
  var d = Math.ceil(ds / 86400000)
  return d;
};


// 通用异步请求方法 PHP
function savePHP(options) {
  //设置默认信息
  var defaultOption = {
    method: "POST",
    dataType: 'json',
    header: {
      'content-type': 'application/json',
      'charset': 'utf-8'
    }
  }
  options.data = Object.assign({}, options.data, config.VERSION_INFO)
  options = Object.assign({}, defaultOption, options)
  wx.request({
    url: options.url,
    data: options.data,
    header: options.header,
    method: options.method,
    dataType: options.dataType,
    success: function (res) {
      options.success(res)
    },
    error: function (err) {
      options.error(err)
    }
  })
};

// 通用异步请求方法 JAVA
function saveJAVA(options) {
  //设置默认信息
  var defaultOption = {
    method: "POST",
    dataType: 'json',
    header: {
      // 'content-type': 'application/json',
      'content-type': 'application/x-www-form-urlencoded',
      'charset': 'utf-8'
    }
  }
  options.data = Object.assign({}, options.data)
  options = Object.assign({}, defaultOption, options)
  wx.request({
    url: options.url,
    data: options.data,
    header: options.header,
    method: options.method,
    dataType: options.dataType,
    success: function (res) {
      options.success(res)
    },
    error: function (err) {
      options.error(err)
    }
  })
};

// 通用异步请求方法 JAVA JSON
function saveJAVAjson(options) {
  //设置默认信息
  var defaultOption = {
    method: "POST",
    dataType: 'json',
    header: {
      'content-type': 'application/json',
      // 'content-type': 'application/x-www-form-urlencoded',
      'charset': 'utf-8'
    }
  }
  options.data = Object.assign({}, options.data)
  options = Object.assign({}, defaultOption, options)
  wx.request({
    url: options.url,
    data: options.data,
    header: options.header,
    method: options.method,
    dataType: options.dataType,
    success: function (res) {
      options.success(res)
    },
    error: function (err) {
      options.error(err)
    }
  })
};

// 时间戳转为 年-月-日 时：分：秒
function getTime(ts) {
  let date = new Date(ts * 1000); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
  let Y = date.getFullYear();
  let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
  let D = date.getDate();
  let h = date.getHours();
  let m = date.getMinutes();
  let s = date.getSeconds();
  if (D < 10) {
    D = `0${D}`
  }
  if (h < 10) {
    h = `0${h}`
  }
  if (m < 10) {
    m = `0${m}`
  }
  if (s < 10) {
    s = `0${s}`
  }
  return `${Y}-${M}-${D} ${h}:${m}:${s}`;
};

// 手机号授权 删
function getPhoneNumber(options) {
  let type = options.page + options.e.currentTarget.dataset.type;
  let AAid = options.AAid;
  let AARid = options.AARid;

  wx.reportAnalytics('allpage_getphone', {
    allpage_getphone_type: type,
    allpage_getphone_hid: AAid,
    allpage_getphone_rid: AARid,
  });
  let that = this;
  let session_key = null;
  wx.login({
    success: function (res) {
      console.log(res)
      if (res.code) {
        var code = res.code
        wx.request({
          url: 'https://aaroom.ihotels.cc/wechat/code2all?code=' + code + '&source=aaroom',
          method: 'get',
          header: {
            'content-type': 'application/json' //默认值
          },
          data: {
            code: res.code
          },

          success: function (result) {
            console.log(result.data)
            let openid = result.data.openid
            session_key = result.data.session_key;
            if (options.e.detail.encryptedData && options.e.detail.iv) {
              wx.showLoading({
                title: '授权中',
                mask: true,
              })
              wx.request({
                method: 'POST',
                url: API.getMyTel,
                data: {
                  iv: options.e.detail.iv,
                  encryptedData: options.e.detail.encryptedData,
                  openid: openid,
                  session_key: session_key,
                  // session_key: app.globalData.skey
                },
                success: function (res2) {
                  wx.hideLoading()
                  wx.reportAnalytics('allpage_getphone_ok', {
                    allpage_getphone_ok_type: type,
                    allpage_getphone_ok_hid: AAid,
                    allpage_getphone_ok_rid: AARid,
                  });
                  options.success(res2)
                },
                fail: function (err) {
                  options.fail(err)
                }
              })
            }
          }
        })
      } else {
        console.log('获取用户登录态失败！' + res.errMsg)
      }
    }
  });
};

// 微信登录 删
function loginWx(options) {
  let session_key = options.session_key;
  if (!session_key) {
    wx.login({
      success: function (res) {
        // console.log(res)
        if (res.code) {
          var code = res.code
          wx.request({
            url: 'https://aaroom.ihotels.cc/wechat/code2all?code=' + code + '&source=aaroom',
            method: 'get',
            header: {
              'content-type': 'application/json' //默认值
            },
            data: {
              code: res.code
            },

            success: function (result) {
              // console.log(result)
              if (options.success) {
                options.success(result)
              }
            }
          })
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      }
    });
  }
};
// 微信登录 app不登录 删
function loginPage(options) {
  let session_key = options.session_key;
  if (!session_key) {
    wx.login({
      success: function (res) {
        // console.log(res)
        if (res.code) {
          var code = res.code
          wx.request({
            url: 'https://aaroom.ihotels.cc/wechat/code2all?code=' + code + '&source=aaroom',
            method: 'get',
            header: {
              'content-type': 'application/json' //默认值
            },
            data: {
              code: res.code
            },

            success: function (result) {
              // console.log(result)
              if (options.success) {
                options.success(result)
              }
            }
          })
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      }
    });
  }
};

/**
 * 登录wx 判断是否授权 0311
 */
function getHasPhone(app, that, hasPhoneCB) {
  if (app.globalData.hasPhone === null || app.globalData.openId === null) {
    wx.login({
      success: function (res) {
        // success
        let code = res.code;
        // console.log(res)
        saveJAVA({
          url: API.getHasPhone,
          method: 'GET',
          data: {
            code: code
          },
          success(res) {
            // console.log(res)
            if (res.statusCode != 200) {
              wx.showModal({
                title: '提示',
                content: '系统出错，请稍后再试！',
                showCancel: false
              })
              return
            } else {
              if (res.data.msg === '手机号未授权。') {
                wx.hideTabBar();
                app.globalData.hasPhone = false;
                wx.login({
                  success: function (res) {
                    // success
                    let code = res.code;
                    app.globalData.hasPhone = false;
                    app.globalData.code = code;
                    that.setData({
                      hasPhone: false,
                    })
                  },
                  fail: function () {
                    // fail
                  },
                  complete: function () {
                    // complete
                  }
                })
              } else {
                app.globalData.hasPhone = true;
                let openid = res.data.openid;
                // let sessionKey = res.data.sessionKey;
                let memberId = res.data.memberId;
                app.globalData.openId = openid;
                // app.globalData.session_key = sessionKey;
                app.globalData.memberId = memberId;
                // console.log(11111)
                // console.log(res.data)
                let cardLevel = res.data.cardLevel;
                let discountPrice = res.data.discountPrice;
                let phoneNum = res.data.phoneNum;
                let levelNum = res.data.levelNum;

                app.globalData.discountPrice = discountPrice;
                app.globalData.cardLevel = cardLevel;
                app.globalData.phoneNum = phoneNum;
                app.globalData.levelNum = levelNum;
                wx.setStorageSync('openId', openid);
                wx.showTabBar();
                if (hasPhoneCB) {
                  hasPhoneCB();
                }
                that.setData({
                  hasPhone: true,
                  cardLevel: cardLevel,
                  phoneNum: phoneNum,
                  discountPrice:discountPrice,
                  levelNum:levelNum,
                })
              }
            }
          }
        })
      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
      }
    })
  } else {
    // console.log(app.globalData)
    let hasPhone = app.globalData.hasPhone;
    let cardLevel = app.globalData.cardLevel;
    let phoneNum = app.globalData.phoneNum;
    let discountPrice = app.globalData.discountPrice;
    if (hasPhone) {
      wx.showTabBar();
      if (hasPhoneCB) {
        hasPhoneCB();
      }
    }
    that.setData({
      hasPhone,
      phoneNum,
      cardLevel,
      discountPrice
    })
  }
};

module.exports = {
  config,
  md5: md5.md5,
  getDateStr,
  spendDateNum,
  getDayAfterNum,
  urlEncode,
  save,
  mapBdToTeng,
  getCode,
  mta,
  group,
  changeTelNum,
  changeNumToWeak,
  convertToStarsArray,
  remove,
  isInArr,
  getDays,

  savePHP,
  saveJAVA,
  saveJAVAjson,
  getTime,
  // getPhoneNumber,
  // loginWx,
  // loginPage,
  getHasPhone,
}