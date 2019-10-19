
var config = require('../../config.js')
var tools = require('../../tools.js')
var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title:'正在加载...',
      mask: true
    });
    this.getFilterData();

  },

  // 获取页面数据
  getFilterData: function () {
    var self = this
    var dataSum = [];
    tools.save({
      url: '/hotelResource/v1.1/hotelsearchType',
      data: '',
      success: function (res) {
        console.log(res);
        res.data.retValue.forEach((e, i) => {
          var datas = ['不限'];
          e.data.forEach(event => {
            datas.push(event.name);
          })
          dataSum.push({ name: e.name, data: datas });
        });
        tools.save({
          url: '/commonResource/v1.1/getCountyByCity',
          data: {
            cityName: wx.getStorageSync('cityName')
          },
          success: function (res) {
            // console.log(res);
            var county = ['不限']
            for (let i = 0; i < res.data.retValue.length; i++) {
              county.push(res.data.retValue[i].name)
            }
            // console.log(county);
            //将区域放在数组第二位
            dataSum.splice(1, 0, { name: '区域', data: county });
            // dataSum.push({name:'区域',data:county});

            dataSum.forEach((e, i) => {
              var Datas = [];
              e.data.forEach((ele, index) => {
                if (index != 0) {
                  Datas.push({
                    id: index,
                    name: ele,
                    isselected: false
                  })
                } else {
                  Datas.push({
                    id: index,
                    name: ele,
                    isselected: true
                  })
                }
              })
              e.data = Datas;
            })
            self.setData({
              datas: dataSum
            })
            wx.hideLoading();
          }
        })
      }
    })
  },

  // 处理页面文本框点击事件
  getSelectedInfo: function (e) {
    var that = this;
    // console.log(e);
    var type = e.currentTarget.dataset.type;
    var id = e.currentTarget.dataset.id;
    //0,3是多选
    var dt = that.data.datas;
    if (type == 0 || type == 3) {
      if (id != 0) {
        dt[type].data[id].isselected = !dt[type].data[id].isselected;
        dt[type].data[0].isselected = true;
        dt[type].data.forEach((e,i)=>{
          if(e.isselected && (i!=0)){
            dt[type].data[0].isselected = false;
          }
        })
        that.setData({
          datas: dt
        })
      } else {
        dt[type].data[0].isselected = true;
        dt[type].data.forEach((e, i) => {
          if (i != 0) {
            e.isselected = false;
          }
        })
        that.setData({
          datas: dt
        })
      }
    } else {
      //其他单选
      dt[type].data[id].isselected = true;
      dt[type].data.forEach((e, i) => {
        if (i != id) {
          e.isselected = false;
        }
      })
      that.setData({
        datas: dt
      })
    }
  },

  // 处理确定点击事件
  getConditionHotels: function (e) {
    //当前的数据
    var datas = this.data.datas;
    //选中的品牌数组
    var brandNameList = [];
    //选中的设施服务数组
    var serviceNameList = [];
    //选中的区域
    var keyword = '';
    //选中的距离
    var distance = '';
    //选中的点评
    var commentLeave = '';
    //遍历数据
    datas.forEach(e => {
      switch (e.name) {
        case '品牌':
          e.data.forEach(ele => {
            if (ele.isselected == true) {
              if(ele.name=='不限'){
                brandNameList = [];
              }else{
                brandNameList.push(ele.name);
              }
            }
          })
          wx.setStorageSync('brandNameList', brandNameList);
          break;
        case '区域':
          e.data.forEach(ele => {
            if (ele.isselected == true) {
              if(ele.name=='不限'){
                ele.name = '';
              }
              keyword = ele.name;
            }
          })
          wx.setStorageSync('keyword', keyword);
          break;
        case '距离':
          e.data.forEach(ele => {
            if (ele.isselected == true) {
              if(ele.name=='不限'){
                distance = '';
              }else {
                distance = ele.name.substring(0, ele.name.length - 2) * 1000
              }
            }
          })
          wx.setStorageSync('distance', distance);
          break;
        case '设施服务':
          e.data.forEach(ele => {
            if (ele.isselected == true) {
              if(ele.name=='不限'){
                serviceNameList = [];
              }else {
                serviceNameList.push(ele.name);
              }
            }
          })
          wx.setStorageSync('serviceNameList', serviceNameList);
          break;
        case '点评':
          e.data.forEach(ele => {
            if (ele.isselected == true) {
              if(ele.id == 0){
                commentLeave = ''
              }else {
                commentLeave = ele.id;
              }
            }
          })
          wx.setStorageSync('commentLeave', commentLeave);
          break;
      }
    })

    //跳转到酒店列表页
    wx.navigateBack({
      delta: 1
    })
  }
})