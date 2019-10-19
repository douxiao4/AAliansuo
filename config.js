/**
 * 小程序配置文件
 */
var phoneInfo = '';
wx.getSystemInfo({
  success: function(res) {
    // success
    phoneInfo = res.model;
  }
})
// var HOST_URL = 'http://115.28.87.137:81/' // 测试地址
 var HOST_URL = 'https://sjz.ihotels.cc/' // 线上地址
// var HOST_URL = 'https://testsjz.ihotels.cc/' // 测试地址
// var HOST_URL = 'http://120.92.162.99:8081'

var config = {
  // 接口地址前缀
  API_URL: HOST_URL+"/ethank-sjz-web/rest",
  // 默认分页大小
  PAGE_SIZE: 10,
  // 没有位置信息/位置被禁用的时候默认地址
  DEFAULT_CITY: '北京',
  // 默认 request 请求附带的版本信息参数
  VERSION_INFO: {
    channel: 18,
    deviceType: '5',
    tagVersion: '5.0.0',
    deviceName: phoneInfo
  },
  // 验证码倒计时时间
  VCODE_TIME: 60,
  // 下单页直接注册时的默认密码
  DEFAULT_PWD: 123456,
  // 支付成功回调地址接口
  NOTIFY_URL: HOST_URL+'ethank-sjz-web/rest/notify/v1.6/weiXinNotifyMiniAPP',
  
  // 百度地图转腾讯地图坐标接口
  API_MAP_URL: 'https://apis.map.qq.com/ws/coord/v1/translate',
  // 腾讯地图KEY，用于转换百度地图坐标到腾讯地图坐标
  TENGMAP_KEY: 'ANGBZ-JWYWF-GCPJZ-JYXAY-PXP4S-5VBOP',
  // 可以预订的最长日期
  MAX_BOOKDAY: 30,
  // 可以预定的天数
  MAX_BOOKDAY_LENGTH: 7,
  // 最多可订房间数量
  MAX_ROOM_NUMS: 3,
  // 腾讯移动分析应用配置
  MTA: {
    "appID":"500413713",
    "eventID":"500413720",
    "statPullDownFresh":true,
    "statShareApp":true,
    "statReachBottom":true
  },
  // webView链接
  H5url:{
    // 质检
    clothUrl: 'https://aaroomtest.bjlrsd.com/aachainWeChat/h5/clothDetail.html',
    // 会员权益
    equityUrl: 'https://memberweb.ethank.com.cn/index.html'
  }
  
  
};

module.exports = config