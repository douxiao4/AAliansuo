// pages/lctime-storage/lctime-storage.js
var tools = require('../../tools.js');
var API=require('../../API');
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // total: true,
    // income: false,
    // expend: false,
    // recodeInfo: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },
  onShow: function() {
    this.getIntegral();
  },
  

  // 跳转到兑换页面
  gotoExchange: function() {
    
  },

  /**
   * 获取总积分
   */
  getIntegral(){
    let that=this;
    tools.saveJAVA({
      url:API.getIntegralAll,
      data:{
        memberId:app.globalData.memberId
      },
      method:'GET',
      success(res){
        console.log(res)
        let list=res.data.data.dataList;
        if(list){
          for(let i in list){
            let creationTime=list[i].creationTime;
            let y=new Date(creationTime).getFullYear();
            let m=new Date(creationTime).getMonth()+1;
            let d=new Date(creationTime).getDate();
            let h=new Date(creationTime).getHours();
            let mm=new Date(creationTime).getMinutes();
            creationTime=`${y}-${m}-${d} ${h}:${mm}`;
            list[i].creationTime=creationTime;
          }
        }
        console.log(list)
        that.setData({
          integral:res.data,
        })
      }
    })
  }

})