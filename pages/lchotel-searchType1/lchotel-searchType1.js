// pages/lchotel-searchType1/lchotel-searchType1.js
var config = require('../../config.js')
var tools = require('../../tools.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    types: [], 
    // index: 0,
    index: 1,
    // text: '酒店品牌',
    text: '区域',
    area: wx.getStorageSync('area') || [],
    serviceNameList: wx.getStorageSync('serviceNameList') || [],
    brandNameList: wx.getStorageSync('brandNameList') || [],
    commentLeave: wx.getStorageSync('commentLeave') || '',
    distance: wx.getStorageSync('distance') || '',
    choosedians:[false,false,false,false,false],
    isCity: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.getCitys();
    this.getFilterData();
    this.chooseDian();
  },
  onShow: function() {
    // this.getCitys();
    this.getFilterData();
  },
  getFilterData: function () {
    var that = this;
    var types = [];
    wx.showToast({
      title: '正在加载...',
      icon: 'loading',
      mask: true
    })
    tools.save({
      url: '/hotelResource/v1.3/hotelsearchType',
      data: {
        "lon": wx.getStorageSync('lon'),
        "lat": wx.getStorageSync('lat'),
        "cityName": wx.getStorageSync('cityName')
      },
      success: function (res) {
        console.log(res);
        if(res.data.retCode != 200) {
          var t = res.data.retMsg;
          wx.showToast({
            title: t,
            icon: 'none',
            mask: true
          })
          return false;
        }
        var brands = wx.getStorageSync('brandNameList');
        var area = wx.getStorageSync('area');
        var distance = wx.getStorageSync('distance');
        var services = wx.getStorageSync('serviceNameList');
        var comment = wx.getStorageSync('commentLeave');
        if (res.data.retCode == 200) {
          // console.log(res.data.retValue.splice(0,4)); 
          if(res.data.retValue.length == 6){
            that.setData({
              isCity: true
            })
            res.data.retValue.splice(4,1);
          }else if(res.data.retValue.length == 5){
            that.setData({
              isCity: false
            })
            res.data.retValue.splice(1,0,{field:'distance',name:'距离',data:[],is_multi:'0'})
            res.data.retValue.splice(4,1);
          }
          
          
          res.data.retValue.forEach((e, i) => {
            
            // if (i == 0) {
            //   types.push({ name: e.name, isChoose: true })
            // } else {
            //   types.push({ name: e.name, isChoose: false });
            // }
            types.push({ name: e.name, isChoose: false });

            e.data.forEach((el, item) => {
              if (i == 0 && brands.indexOf(el.name) != -1) {
                el.isSelected = true;
              } else if (i == 1 && distance == el.distance) {
                el.isSelected = true;
              } else if (i == 2 && services.indexOf(el.name) != -1) {
                el.isSelected = true;
              } else if (i == 3 && comment == el.id) {
                el.isSelected = true;
              } else if(i == 4 && area.indexOf(el.name) != -1){
                el.isSelected = true;
              }else {
                el.isSelected = false;
              }
            })
          });
          // types.splice(1, 0, { name: "区域", isChoose: false });
          types.splice(1, 0, { name: "区域", isChoose: true });
          types.splice(5,1);

          //TODO:之后再进行修改
          var brandnames = [];

          res.data.retValue[0].data.forEach((el, item) => {
            if (el.name === "AA ROOM") {
              brandnames.push(el);
            }
          })
          var servicenames = res.data.retValue[2].data;
          if (services != '') {
            servicenames.unshift({
              id: 0,
              name: '不限',
              isSelected: false
            })
          } else {
            servicenames.unshift({
              id: 0,
              name: '不限',
              isSelected: true
            })
          }

          var distances = res.data.retValue[1].data;
          if(distance != ''){
            distances.unshift({
              id: 0,
              name: '不限',
              isSelected: false
            })
          }else {
            distances.unshift({
              id: 0,
              distance:'',
              name: '不限',
              isSelected: true
            })
          }

          var scores = res.data.retValue[3].data;
          if(comment != ''){
            scores.unshift({
              id: 0,
              name: '不限',
              isSelected: false
            })
          }else {
            scores.unshift({
              id: 0,
              name: '不限',
              isSelected: true
            })
          }

          var areas = res.data.retValue[4].data;
          if(area != ''){
            areas.unshift({
              id: 0,
              name: '不限',
              isSelected: false
            })
          }else {
            areas.unshift({
              id: 0,
              name: '不限',
              isSelected: true
            })
          }
          that.setData({
            types: types,
            brandnames: brandnames,
            servicenames: servicenames,
            distances: distances,
            scores: scores,
            citys: areas
          })
          
          wx.hideToast();
        }
      }
    })
  },
  // getCitys: function () {
  //   var that = this;
  //   var city = wx.getStorageSync('area');
  //   wx.showToast({
  //     title: '正在加载...',
  //     icon: 'loading',
  //     mask: true
  //   })
  //   tools.save({
  //     url: '/commonResource/v1.1/getCountyByCity',
  //     data: {
  //       cityName: wx.getStorageSync('cityName'),

  //     },
  //     success: function (res) {
  //       console.log(res);
  //       res.data.retValue.forEach((e, i) => {
  //         if(city.indexOf(e.name)!=-1) {
  //           e.isSelected = true;
  //         }else {
  //           e.isSelected = false;
  //         }
  //       })
  //       if(city) {
  //         res.data.retValue.unshift({
  //           id: 0,
  //           name: '不限',
  //           isSelected: false
  //         })
  //       }else {
  //         res.data.retValue.unshift({
  //           id: 0,
  //           name: '不限',
  //           isSelected: true
  //         })
  //       }

  //       that.setData({
  //         citys: res.data.retValue
  //       })
  //       // console.log(that.data.citys);
  //       wx.hideToast();
  //     }
  //   })
  // },
  chooseType: function (e) {
    // console.log(e);
    var index = e.currentTarget.dataset.type;
    var text = this.data.text;
    switch (index) {
      case 0:
        text = '酒店品牌';
        break;
      case 1:
        text = '行政区域';
        break;
      case 2:
        text = '距离';
        break;
      case 3:
        text = '设施服务';
        break;
      case 4:
        text = '用户点评';
        break;
    }
    var types = this.data.types;
    types.forEach((e, i) => {
      e.isChoose = false;
    })
    types[index].isChoose = true;
    // console.log(types);
    this.setData({
      types: types,
      index: index,
      text: text
    })
  },
  brandchangeSelect: function (e) {
    // console.log(e);
    var brandnames = this.data.brandnames;
    var selected = brandnames[e.currentTarget.dataset.id].isSelected;
    brandnames[e.currentTarget.dataset.id].isSelected = !selected;
    this.setData({
      brandnames: brandnames
    })
    var brandNameList = [];
    this.data.brandnames.forEach((e, i) => {
      if (e.isSelected) {
        brandNameList.push(e.name);
      }
    })
    wx.setStorageSync('brandNameList', brandNameList);
    this.chooseDian();
  },
  citychangeselected: function (e) {
    console.log(e);
    var index = e.currentTarget.dataset.id;
    var citys = this.data.citys;
    var select = citys[index].isSelected;
    citys[index].isSelected = !select;
    var city = [];
    console.log(city);
    console.log(index);
    console.log(citys);
    // if (citys[index].isSelected) {
    //   city = citys[index].name;
    //   citys.forEach((e, i) => {
    //     if (i != index) {
    //       e.isSelected = false;
    //     }
    //   })
    // }
    if (index == 0 && citys[0].isSelected == true) {
      citys.forEach((e, i) => {
        if (i != 0) {
          e.isSelected = false;
        }
      })
    } else if (index != 0 && citys[index].isSelected == true) {
      citys[0].isSelected = false;
    }
    citys.forEach((e,i)=>{
      if(e.isSelected && i!=0){
        city.push(e.name);
      }
    })
    this.setData({
      citys: citys,
      area: city
    })
    wx.setStorageSync('area', this.data.area);
    if(wx.getStorageSync('area') && wx.getStorageSync('area')!=''){
      wx.removeStorageSync('distance');
      this.areaVSdistance();
    }
    this.chooseDian();
  },
  distancechangeselected: function (e) {
    console.log(e);
    var index = e.currentTarget.dataset.id;
    var distances = this.data.distances;
    // console.log(distances);
    var select = distances[index].isSelected;
    distances[index].isSelected = !select;
    var distance = this.data.distance;
    if (distances[index].isSelected) {
      distance = distances[index].distance;
      distances.forEach((e, i) => {
        if (i != index) {
          e.isSelected = false;
        }
      })
    }
    this.setData({
      distances: distances,
      distance: distance
    })
    wx.setStorageSync('distance', this.data.distance);
    if(wx.getStorageSync('distance') && wx.getStorageSync('distance')!=''){
      wx.removeStorageSync('area');
      this.distanceVSarea();
    }
    this.chooseDian();
  },
  servicenamechangeselected: function (e) {
    console.log(e);
    var servicenames = this.data.servicenames;
    var index = e.currentTarget.dataset.id;
    var select = servicenames[index].isSelected;
    servicenames[index].isSelected = !select;
    var services = this.data.serviceNameList || [];
    if (index == 0 && servicenames[0].isSelected == true) {
      servicenames.forEach((e, i) => {
        if (i != 0) {
          e.isSelected = false;
        }
      })
      services = [];
    } else if (index != 0 && servicenames[index].isSelected == true) {
      servicenames[0].isSelected = false;
      services.splice(index-1, 0, servicenames[index].name);
    } else if (index != 0 && servicenames[index].isSelected == false) {
      services.splice(index-1, 1);
    }
    this.setData({
      servicenames: servicenames,
      services: services
    })
    wx.setStorageSync('serviceNameList', this.data.services);
    this.chooseDian();
  },
  scorechangeselected: function (e) {
    console.log(e);
    var index = e.currentTarget.dataset.id;
    var scores = this.data.scores;
    var select = scores[index].isSelected;
    scores[index].isSelected = !select;
    var score = this.data.commentLeave;
    if (scores[index].isSelected) {
      score = scores[index].id;
      scores.forEach((e, i) => {
        if (i != index) {
          e.isSelected = false;
        }
      })
    }
    this.setData({
      scores: scores,
      commentLeave: score
    })
    wx.setStorageSync('commentLeave', this.data.commentLeave);
    this.chooseDian();
  },
  removeChoose: function() {
    wx.setStorageSync('area', []);
    wx.setStorageSync('brandNameList', []);
    wx.setStorageSync('distance', '');
    wx.setStorageSync('commentLeave', 0);
    wx.setStorageSync('serviceNameList', []);
    var citys = this.data.citys;
    var brandnames = this.data.brandnames;
    var distances = this.data.distances;
    var servicenames = this.data.servicenames;
    var scores = this.data.scores;
    citys.forEach((e,i)=>{
      if(i==0) {
        e.isSelected = true;
      }else {
        e.isSelected = false;
      }
    })
    brandnames.forEach((e,i)=>{
      e.isSelected = false;
    })
    distances.forEach((e,i)=>{
      if(i==0) {
        e.isSelected = true;
      }else {
        e.isSelected = false;
      }
    })
    servicenames.forEach((e,i)=>{
      if(i==0) {
        e.isSelected = true;
      }else {
        e.isSelected = false;
      }
    })
    scores.forEach((e,i)=>{
      if(i==0) {
        e.isSelected = true;
      }else {
        e.isSelected = false;
      }
    })
    this.setData({
      citys: citys,
      brandnames: brandnames,
      servicenames: servicenames,
      distances: distances,
      scores: scores
    })
    this.chooseDian();
  },
  backList: function() {
    wx.navigateBack({
      delta: 1
    })
  },
  chooseDian: function() {
    var choosedians = this.data.choosedians;
    choosedians[0] = wx.getStorageSync('brandNameList')&&wx.getStorageSync('brandNameList')!=''? true : false;
    choosedians[1] = wx.getStorageSync('area')&&wx.getStorageSync('area')!=''? true : false;
    choosedians[2] = wx.getStorageSync('distance')&&wx.getStorageSync('distance')!=''? true : false;
    choosedians[3] = wx.getStorageSync('serviceNameList')&&wx.getStorageSync('serviceNameList')!=''? true : false;
    choosedians[4] = wx.getStorageSync('commentLeave')&&wx.getStorageSync('commentLeave')!=0? true : false;
    this.setData({
      choosedians: choosedians
    })
  },
  distanceVSarea: function() {
    var citys = this.data.citys;
    citys.forEach((e,i)=>{
      if(i==0) {
        e.isSelected = true;
      }else {
        e.isSelected = false;
      }
    })
    this.setData({
      citys: citys
    })
  },
  areaVSdistance: function() {
    var distances = this.data.distances;
    distances.forEach((e,i)=>{
      if(i==0) {
        e.isSelected = true;
      }else {
        e.isSelected = false;
      }
    })
    this.setData({
      distances: distances
    })
  }
})