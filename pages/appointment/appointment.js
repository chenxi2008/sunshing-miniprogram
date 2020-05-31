//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    userInfo: {
      name: '',
      jobnumber: '',
      mobile: '',
      department: '',
      doorcard: ''
    },
    type: '',
    movieList: ['上半场','下半场'],
    timeList: [],
    originList: [],
    selectType: [],
    pickerValue: 0,
    pickerValue1: 0,
    isagree: false,
    showModal: false,
    modalTitle: '安全告知',
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },

  onLoad: function (query) {
    this.setData({
      type: query.type
    })

    this.checkUserinfo()
    wx.request({
      url: app.globalData.baseUrl + '/equipment/getEquipmentList',
      type: 'GET',
      success: res => {
        let data = res.data
        let selectType = data.data.map(res => res.name)
        let index = selectType.indexOf(query.type)
        if (data.code == 200) {
          this.setData({
            pickerValue: index > 0 ? index : 0,
            originList: data.data,
            selectType: selectType,
            timeList: this.type == 'js'
              ? data.data[0].timenode.split(',')
              : data.data[1].timenode.split(',')
          })
        }
      }
    })
  },
  checkUserinfo: function() {
    if (!app.globalData.userInfo) {
      wx.showModal({
        title: '提示',
        content: '预约需要先授权权限',
        success:function(res){
          if (res.confirm) {
            wx.switchTab({
              url: "/pages/mine/mine?backto=/pages/mine/mine"
            })
          }
        }
      })
    }
    return app.globalData.userInfo
  },
  changevalue(e) {
    let {detail, target} = e
    let type = `userInfo.${target.dataset.id}`
    this.setData({
      [type]: detail.value
    })

  },
  //提交数据
  handleSubmit: function() {
    let {
      type, movieList,
      userInfo, isagree,
      selectType, timeList,
      pickerValue, pickerValue1
    } = this.data
    let error = null
    let equipment = type == '电影'
      ? '电影'
      : selectType[pickerValue];
    let time = type == '电影'
      ? movieList[pickerValue1]
      : timeList[pickerValue1];

    if (this.checkUserinfo()) {
      if (!userInfo.name) {
        error = '请输入姓名'
      }
      else if (!userInfo.jobnumber) {
        !error && (error = '请输入工号')
      }
      else if (!userInfo.department) {
        !error && (error = '请输入部门')
      }
      else if (!userInfo.mobile || userInfo.mobile.length != 11) {
        !error && (error = '请输入正确的手机号码')
      }
      else if (!isagree) {
        !error && (error = '请阅读并确认安全告知')
      }

      if (error) {
        wx.showModal({
          title: '提示',
          content: error,
          showCancel: false
        })
        return false
      }

      wx.request({
        url: app.globalData.baseUrl + '/user/submitOrder', //提交数据并创建订单
        type: 'GET',
        data: {
          type: type,
          time: time,
          equipment: equipment,
          userinfo: app.globalData.userInfo,
          openid: app.globalData.openid,
          otherinfo: userInfo
        },
        success: res => {
          console.log(res)
          if (res.data.code == 200) {
            wx.showModal({
              title: '提示',
              content: '提交成功等待人员审核',
              showCancel: false
            })
            wx.redirectTo({
              url: '/pages/resoult/resoult?type=padding'
            })
          } else {
            wx.showModal({
              title: '提示',
              content: res.data.msg,
              showCancel: false
            })
          }
        }
      })
    }
  },
  handleShowTip: function() {
    this.setData({
      showModal: true
    })
  },
  bindPickerChange: function({detail:{value},target}) {
    let id = target.dataset.id
    this.setData({
      [id]: value
    })
  },
  handleRead() {
    this.setData({
      isagree: !this.data.isagree
    })
  }
})
