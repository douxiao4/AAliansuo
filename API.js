/**
 * 小程序配置文件 PHP
 */
// 测试php
// var hostPHP ='https://playaround.bjlrsd.com/hotelmaster/user';
// 正式php
var hostPHP = 'https://uc.aaroom.cc/hotelmaster/user';

// 测试java
// var hostJava = 'https://aaroomtest.bjlrsd.com';
// 正式
var hostJava = 'https://aaproducttest.bjlrsd.com';
// 张继源
// var hostJava = 'http://172.31.29.11:8080';
// 赵泽飞
// var hostJava = 'http://172.31.205.215:8080';
// 李亚鹏
// var hostJava = 'http://172.31.29.10:8080';


var config = {
  // PHP
  // 订房页轮播图
  reservationBanner: `${hostPHP}/reservationBanner`,
  // 酒店详情
  hotelIndex: `${hostPHP}/hotelIndex`,
  // 酒店公告 页面删了
  bulletin: `${hostPHP}/bulletin`,
  // 酒店公告点赞 页面删了
  bulletinComment: `${hostPHP}/bulletinComment`,
  // 问题反馈 页面删了
  problemFeedback: `${hostPHP}/problemFeedback`,
  // 线上进入 信息
  nonMember: `${hostPHP}/nonMember`,
  // 推荐酒店列表
  recommendedHotel: `${hostPHP}/recommendedHotel`,
  // 周边服务-测试海报
  poster: `${hostPHP}/poster`,
  // 授权获取手机号
  getMyTel: `${hostPHP}/iv`,
  // 登录wx，获取openid
  getCode: `${hostPHP}/getCode`,
  // 注册
  register: `${hostPHP}/register`,
  // 会员卡面列表
  indexCard: `${hostPHP}/indexCard`,

  // JAVA
  // 支付
  createOrder: `${hostJava}/createOrder`,
  // 坐标转为城市
  getCityName: `${hostJava}/WeChat/console/api/getCityNameByLatLng`,

  // 张继源 
  // 添加常旅信息
  insertMemberPassenger: `${hostJava}/WeChat/console/api/insertMemberPassenger`,
  // 查询常旅信息
  getAllMemberPassenger: `${hostJava}/WeChat/console/api/getAllMemberPassenger`,
  // 修改常旅信息
  updateMemberPassengerById: `${hostJava}/WeChat/console/api/updateMemberPassengerById`,
  // 删除常旅信息
  deleteMemberPassengerById: `${hostJava}/WeChat/console/api/deleteMemberPassengerById`,

  // 添加地址
  insertMemberAddress: `${hostJava}/WeChat/console/api/insertMemberAddress`,
  // 查询地址
  getAllMemberAddress: `${hostJava}/WeChat/console/api/getAllMemberAddress`,
  // 修改地址
  updateMemberAddressById: `${hostJava}/WeChat/console/api/updateMemberAddressById`,
  // 删除地址
  deleteMemberAddressById: `${hostJava}/WeChat/console/api/deleteMemberAddressById`,

  // 添加发票
  insertMemberInvoice: `${hostJava}/WeChat/console/api/insertMemberInvoice`,
  // 查询发票 
  getAllMemberInvoice: `${hostJava}/WeChat/console/api/getAllMemberInvoice`,
  // 修改发票 
  updateMemberInvoiceById: `${hostJava}/WeChat/console/api/updateMemberInvoiceById`,
  // 删除发票 
  deleteMemberInvoiceById: `${hostJava}/WeChat/console/api/deleteMemberInvoiceById`,

  // 常住酒店列表
  getUsuallyHotelInfo: `${hostJava}/WeChat/console/api/getUsuallyHotelInfo`,
  // 收藏酒店列表
  getCollectedHotelList: `${hostJava}/WeChat/console/api/getCollectedHotelList`,
  // 添加收藏酒店
  collectHotel: `${hostJava}/WeChat/console/api/collectHotel`,
  // 取消收藏酒店
  collectHotelDel: `${hostJava}/WeChat/console/api/collectHotelDel`,
  // 取消收藏酒店
  isCollectedHotel: `${hostJava}/WeChat/console/api/isCollectedHotel`,

  // 个人评论列表
  getMemberCommentByEmp: `${hostJava}/WeChat/console/api/getMemberCommentByEmp`,
  // 添加评论 
  insertMemberComment: `${hostJava}/WeChat/console/api/insertMemberComment`,
  // 酒店评论列表 
  selectMemberCommentList: `${hostJava}/WeChat/console/api/selectMemberCommentList`,


  // 赵泽飞  
  // 查询是否授权过手机号
  getHasPhone: `${hostJava}/WeChat/console/api/loginConfirm`,
  // 获取手机号
  getPhone: `${hostJava}/WeChat/console/api/login`,
  // 会员权益
  getMemberEquity: `${hostJava}/WeChat/console/api/getMemberEquity`,
  // getMemberEquity: `${hostJava}/console/api/getMemberEquity`,
  // 获取支付信息
  getWechatPayPreId: `${hostJava}/WeChat/console/api/getWechatPayPreId`,

  // 获取会员信息
  getMemberInfo: `${hostJava}/WeChat/console/api/getMemberInfo`,
  // 修改会员信息
  updateMemberInfo: `${hostJava}/WeChat/console/api/updateMemberInfo`,
  // 获取会员积分 
  getIntegralAll: `${hostJava}/WeChat/console/api/getIntegralAll`,
  //向后台传尚美hid 
  insertHotelInfo: `${hostJava}/WeChat/console/api/insertHotelInfo`,
  // 花钱买会员
  getWechatPayPreId: `${hostJava}/WeChat/console/api/getWechatPayPreId`,
  // 确认购买会员结果
  confirmResult: `${hostJava}/WeChat/console/api/confirmResult`,
  


  // 李亚鹏
  // 查看全部订单
  queryOrderList: `${hostJava}/WeChat/console/api/queryOrderList`,
  // 查看订单详情
  selectOrder: `${hostJava}/WeChat/console/api/selectOrder`,
  // 取消订单 
  cancelOrder: `${hostJava}/WeChat/console/api/cancelOrder`,
  // 支付房费获取预支付ID
  payHotelFee: `${hostJava}/WeChat/console/api/payHotelFee`,
  // 订单号查发票信息
  queryInvoiceInfoByOrderNo: `${hostJava}/WeChat/console/api/queryInvoiceInfoByOrderNo`,
  // 查房型 （房量 房价）
  avail: `${hostJava}/WeChat/console/api/avail`,
  // 下单
  orderSave: `${hostJava}/WeChat/console/api/orderSave`,
};

module.exports = config