var config = require('../../config.js')
var tools = require('../../tools.js')
var app = getApp()

Page({
  data: {
    index: 0,
    travelTypeTitle: '请选择出游类型',
    commentText: '',

    commentHyg: '',
    commentEnv: '',
    commentSer: '',
    utility: '',
  },
  onLoad: function(option){
    new app.WeToast()
    tools.mta.Page.init()
    var self = this
    self.setData({
      hotelId: option.store_id,
      store_title: option.store_title,
      orderNo: option.trade_id
    })
    self.getgetTourType()
  },
  onShow: function(){},
  // 获取出游类型
  getgetTourType: function(){
    var self = this
    tools.save({
      url: '/commonResource/v1.1/getgetTourType',
      data: {},
      success: function(res) {
        var travelTypeArr = []
        var travelTypeTitleArr = []
        for(let i=0;i<res.data.retValue.length;i++){
          travelTypeArr.push(res.data.retValue[i].code)
          travelTypeTitleArr.push(res.data.retValue[i].name)
        }
        self.setData({
          getgetTourType: res.data.retValue,
          travelTypeArr: travelTypeArr,
          travelTypeTitleArr: travelTypeTitleArr
        })
      }
    })
  },
  // 选择出游类型
  selectTravelType: function(e){
    var self = this
    this.setData({
      index: e.detail.value,
      travelTypeTitle: self.data.travelTypeTitleArr[e.detail.value],
      travelTypeCode: self.data.travelTypeArr[e.detail.value]
    })
  },
  // 评论框失去焦点时
  bindTextAreaBlur: function(e){
    this.setData({
      commentText: e.detail.value
    })
  },
  // 提交评论
  submitBtn: function(){
    var self = this
    if( !self.checkData() ){
      return false
    }
    self.wetoast.toast({
      title: '正在提交...'
    })
    var data = {
      commentEnv: self.data.commentEnv,  // 环境
      commentHyg: self.data.commentHyg, // 卫生
      commentSer: self.data.commentSer, // 服务
      utility: self.data.utility, // 设施
      commentText: self.data.commentText,
      hotelId: self.data.hotelId,
      memberId: wx.getStorageSync('memberId'),
      orderNo: self.data.orderNo,
      roomTypeCode: '',
      roomTypeName: '',
      tourType: self.data.travelTypeCode,
    }
    tools.save({
      url: '/commentResource/v1.1/commentAdd',
      data: data,
      success: function(res) {
        if(res.data.retCode == 200){
          self.wetoast.toast({
            title: res.data.retMsg
          })
          setTimeout(function(){
            wx.navigateBack()
          },1000)
        }else{
          self.wetoast.toast({
            title: res.data.retMsg
          })
        }
      }
    })
  },
  // 数据验证
  checkData: function(){
    var self = this
    if(!self.data.travelTypeCode){
      self.wetoast.toast({
        title: '请选择出游类型'
      })
      return false
    }else if(!self.data.commentHyg){
      self.wetoast.toast({
        title: '请评价房间卫生'
      })
      return false
    }else if(!self.data.commentEnv){
      self.wetoast.toast({
        title: '请评价周围环境'
      })
      return false
    }else if(!self.data.commentSer){
      self.wetoast.toast({
        title: '请评价酒店服务'
      })
      return false
    }else if(!self.data.utility){
      self.wetoast.toast({
        title: '请评价设施服务'
      })
      return false
    }else if(!self.data.commentText){
      self.wetoast.toast({
        title: '请填写评价内容'
      })
      return false
    }
    return true
  },
  // 选择星级
  tapStar: function(e){
    var self = this
    var data = {}
    switch (e.currentTarget.dataset.type){
      case 'commentHyg':
        data.commentHyg = e.currentTarget.dataset.id
        break;
      case 'commentEnv':
        data.commentEnv = e.currentTarget.dataset.id
        break;
      case 'commentSer':
        data.commentSer = e.currentTarget.dataset.id
        break;
      case 'utility':
        data.utility = e.currentTarget.dataset.id
        break;
    }
    self.setData(data)
  }
})