// vipPackage/pages/editUserInfo/editUserInfo.js
var tools=require('../../../tools');
var API=require('../../../API');
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    end:'2099-01-01',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setEndDay();
    this.getUserInfo();
  },

  /* 设置最大日期 */
  setEndDay(){
    let date = new Date();
    let y=date.getFullYear();
    let m=date.getMonth()+1;
    let d=date.getDate();
    let today=`${y}-${m}-${d}`;
    this.setData({
      end:today
    })
  },

  /* 缓存获取用户信息 */
  getUserInfo() {
    let userInfo = null;
    let userName = '';
    let userEmail = '';
    let userId = '';
    let date = '请选择出生日期';
    if (wx.getStorageSync('memberInfo')) {
      userInfo = wx.getStorageSync('memberInfo');
      userName = userInfo.name;
      date = userInfo.birthday ? userInfo.birthday :'请选择出生日期';
      userEmail = userInfo.email;
      userId = userInfo.certificateNum;
    }
    this.setData({
      userName,
      date,
      userEmail,
      userId,
    })
  },

  /* 修改生日 */
  getDate(e) {
    this.setData({
      date: e.detail.value
    })
  },

  /* 修改姓名 */
  getName(e) {
    let name = e.detail.value;
    name = name.trim();
    this.setData({
      userName: name
    })
  },

  /* 修改证件 */
  getId(e) {
    let idNumber = e.detail.value;
    idNumber = idNumber.trim();
    this.setData({
      userId: idNumber
    })
  },

  /* 修改邮箱 */
  getEmail(e) {
    let email = e.detail.value;
    email = email.trim();
    this.setData({
      userEmail: email
    })
  },

  /* 保存信息 */
  saveMsg() {
    // let openid = app.globalData.openId;
    let saveDate='';
    let userName=this.data.userName;
    if (userName){
      userName = userName.trim()
    }
    if(!userName){
      wx.showModal({
        title:'提示',
        content:'请输入姓名！',
        showCancel:false,
        success(){
          return
        }
      })
      return
    }
    
    let userId=this.data.userId;
    if (userId){
      userId = userId.trim()
    }
    if(!userId){
      wx.showModal({
        title:'提示',
        content:'请输入证件号码！',
        showCancel:false,
        success(){
          return
        }
      })
      return
    }
    let userEmail=this.data.userEmail;
    if (userEmail){
      userEmail = userEmail.trim()
    }
    if(userEmail){
      let reg = new RegExp('^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$');
      let emailVar = reg.test(userEmail);
      if(!emailVar){
        wx.showModal({
          title:'提示',
          content:'请输入正确的邮箱地址！',
          showCancel:false,
          success(){
            return
          }
        })
        return
      }
    }

    let date=this.data.date.trim();
    if(date!=='请选择出生日期'){
      saveDate=date;
    }
    console.log(userEmail)
    console.log(userId)
    console.log(userName)
    console.log(saveDate)
    tools.saveJAVAjson({
      url:API.updateMemberInfo,
      data:{
        id:app.globalData.memberId,
        name:userName,
        certificateNum:userId,
        birthday:saveDate,
        email:userEmail
      },
      success(res){
        console.log(res)
        if(res.data.status=="success"){
          wx.navigateBack({
            delta: 1, // 回退前 delta(默认为1) 页面
            success: function(res){
              // success
              wx.showToast({
                title: '修改成功',
                icon: 'success',
                duration: 2000,
              })
            },
            fail: function() {
              // fail
            },
            complete: function() {
              // complete
            }
          })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})