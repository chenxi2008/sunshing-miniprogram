// component/showModal.js
var colorRgb = function (sColor) {
  sColor = sColor.toLowerCase();
  //十六进制颜色值的正则表达式
  var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
  // 如果是16进制颜色
  if (sColor && reg.test(sColor)) {
    if (sColor.length === 4) {
      var sColorNew = "#";
      for (var i = 1; i < 4; i += 1) {
        sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1));
      }
      sColor = sColorNew;
    }
    //处理六位的颜色值
    var sColorChange = [];
    for (var i = 1; i < 7; i += 2) {
      sColorChange.push(parseInt("0x" + sColor.slice(i, i + 2)));
    }
    return "RGB(" + sColorChange.join(",") + ")";
  }
  return sColor;
};


var colorHex = function (color) {
  var that = color;
  //十六进制颜色值的正则表达式
  var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
  // 如果是rgb颜色表示
  if (/^(rgb|RGB)/.test(that)) {
    var aColor = that.replace(/(?:\(|\)|rgb|RGB)*/g, "").split(",");
    var strHex = "#";
    for (var i = 0; i < aColor.length; i++) {
      var hex = Number(aColor[i]).toString(16);
      if (hex.length < 2) {
        hex = '0' + hex;
      }
      strHex += hex;
    }
    if (strHex.length !== 7) {
      strHex = that;
    }
    return strHex;
  } else if (reg.test(that)) {
    var aNum = that.replace(/#/, "").split("");
    if (aNum.length === 6) {
      return that;
    } else if (aNum.length === 3) {
      var numHex = "#";
      for (var i = 0; i < aNum.length; i += 1) {
        numHex += (aNum[i] + aNum[i]);
      }
      return numHex;
    }
  }
  return that;
};
var colorHunHe = function (color) {
  var zhi = colorRgb(color)
  var rgb = zhi.substr(4, zhi.length - 5)
  var rgbArr = rgb.split(',')
  // 两种颜色混合后，混色的色值计算，RGB分别用这个公式计算：颜色A - (颜色A - 颜色B) * (1 - 颜色A的百分比)
  // 例如：绿和白混合，绿(192, 229, 112)70 %，白(255, 255, 255)30 %R: 192-(192-255)*(1-0.7) = 210.9
  // G: 229 - (229 - 255) * (1 - 0.7) = 234.8
  // B: 112 - (112 - 255) * (1 - 0.7) = 154.9
  // 四舍五入后得到混合色值：(211, 235, 155) 
  var R = Math.round(0 - (0 - parseInt(rgbArr[0])) * (1 - 0.7))
  var G = Math.round(0 - (0 - parseInt(rgbArr[1])) * (1 - 0.7))
  var B = Math.round(0 - (0 - parseInt(rgbArr[2])) * (1 - 0.7))
  return colorHex('rgb(' + R + ',' + G + ',' + B + ')')
}
var app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    title: {
      type: String,
      value: '提示',
    },
    content:{
      type: String,
      value: '',
    },
    showModal: {
      type: Boolean,
      value: false,
    },
    showNoCancel:{
      type: Boolean,
      value: false,
    },
     pageNoBind: {
      type: Boolean,
      value: false,
    },
    transparent: {
      type: Boolean,
      value: false,
    },
    frontColor: {
      type: String,
      value: '',
    },
    backgroundColor: {
      type: String,
      value: '',
    },
  },
  created: function () {


  },
  ready: function () {

  },
  /**
   * 组件的初始数据
   */
  data: {
    
  },

  /**
   * 组件的方法列表
   */
  ready: function () {
    var that = this
    if (that.data.frontColor != '' && that.data.backgroundColor != '') {
      var yanSe = colorHunHe(that.data.backgroundColor)
      wx.setNavigationBarColor({
        frontColor: that.data.frontColor,
        backgroundColor: yanSe,
      })
      wx.hideTabBar({ animation: true })
    }

  },
  methods: {
    colse: function (e) {
      var that = this
      if (that.data.frontColor != '' && that.data.backgroundColor != '') {
        wx.setNavigationBarColor({
          frontColor: that.data.frontColor,
          backgroundColor: that.data.backgroundColor,
        })
        wx.showTabBar({ animation: true })
      }

      var change = false, cancel = false, confirm = false;
      if (e.currentTarget.dataset.pan==0){
        change=true
      }
      else if (e.currentTarget.dataset.pan == 1){
        cancel = true
      }
      else if (e.currentTarget.dataset.pan == 2){
        confirm = true
      }
      var that = this
      that.setData({
        showModal: false
      })
      return app.callback({ confirm: confirm, cancel: cancel, change: change })
    },
  }
})
