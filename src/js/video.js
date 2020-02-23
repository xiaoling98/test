//播放器功能实现
var video = $('.video')[0]
var playShow = $('.play')[0]
var zanting = $('.zanting')[0]
var contro1 = $('.contro1')[0]
var box = $('.box')[0]
var starTime = $('#starTime')
var curTime = $('#curTime')
var isFull = false





video.addEventListener('timeupdate', timeupdate, false)
addEvent(video, audioControl)
addEvent(zanting, audioControl)
// addEvent('zanting', audioControl)
//视频单击事件
function audioControl(e,info) {
    //判断是否有传入参数。如果有参数则直接播放。否则进入判断
    if (info || video.paused) {
      zanting.classList.add("icon-zanting")
      zanting.classList.remove("icon-play")
      video.play()
      playShow.style.display = "none"
      contro1.style.display = "flex"   
    } else {
        zanting.classList.remove("icon-zanting")
        zanting.classList.add("icon-play")
        video.pause()
        playShow.style.display = "block"
        contro1.style.display = "none"
    }
}


//当时视频开始播放时渲染视频总时长
video.oncanplay = function(){
    //将视频播放总时长戳转换为分秒格式
    var durTime = formatTime(this.duration)
    // 插入视频播放总时长
    curTime.innerText = durTime
}

  // 点击进度条,更新处理
$(".progress")[0].onmousedown = function (target) {
    updata.call(this, target)
    this.addEventListener('mousemove', updata, false)
    this.addEventListener('mouseup', function(){
        this.removeEventListener('mousemove', updata, false)
    }, true)
}

//更新进度
function updata(target){
     // 拿到进度条的宽度
     var width = this.offsetWidth;
     // 拿到当前点击位置的x坐标
     var x = target.offsetX;
     video.currentTime = x / width * video.duration;
}



//将时间转化为分秒格式
function formatTime(time) {
  time = Math.round(time)
  var minute = Math.floor(time / 60)
  var second = time - minute * 60
  if (minute < 10) {
      minute = "0" + minute
  }
  if (second < 10) {
      second = "0" + second
  }
  return minute + ":" + second
}

function timeupdate() {
  var percent = video.currentTime / video.duration * 100 + "%"
  $(".current")[0].style.width = percent
  //将当前播放的时间戳转换为分秒格式
  var startTime = formatTime(video.currentTime)
  // 插入当前播放时间
  starTime.innerText = startTime
}


//全屏的功能的实现
function full() {
  //判断当前状态是否全屏
  if(!isFull){
    //开启全屏，隐藏边框，控制栏
    requestFullScreen(box)
    box.style.border = 'none'
    //监听全屏后鼠标是否移动。
    box.addEventListener('mousemove', debounce(hide, 2000), false)
  }else{
    //恢复边框，退出全屏
    box.style.border = '10px solid rgb(198,84,76)'
    exitFull()
  }
  isFull = !isFull 
}

//设置一个定时器。如果鼠标移动显示控制栏，否则等待两秒后隐藏
function debounce(handlen, delay) {
  var timer = null;
  return function () {
    //显示控制栏
      contro1.style.opacity = "1"
      this.style.cursor = "auto"
      var _self = this,
          _arg = arguments;
      clearTimeout(timer);
      timer = setTimeout(function () {
          //为了正确传递oInp的值，所以需要使用apply修改this指向
          handlen.apply(_self, _arg)
      }, delay)
  }
}
//隐藏控制栏
function hide() {
  contro1.style.opacity = "0"
  this.style.cursor = "none"
}


// 开启全屏
function requestFullScreen(element) {
  var requestMethod = element.requestFullScreen || //W3C
      element.webkitRequestFullScreen || //FireFox
      element.mozRequestFullScreen || //Chrome等
      element.msRequestFullScreen //IE11
  if (requestMethod) {
      requestMethod.call(element)
  } else if (typeof window.ActiveXObject !== "undefined") {
      var wscript = new ActiveXObject("WScript.Shell");
      if (wscript !== null) {
          wscript.SendKeys("{F11}")
      }
  }
}
//退出全屏 判断浏览器种类
function exitFull() {
var exitMethod = document.exitFullscreen || //W3C
  document.mozCancelFullScreen || //FireFox
  document.webkitExitFullscreen || //Chrome等
  document.msExitFullscreen //IE11
if (exitMethod) {
  exitMethod.call(document)
}  else if (typeof window.ActiveXObject !== "undefined") {
  var wscript = new ActiveXObject("WScript.Shell");
  if (wscript !== null) {
      wscript.SendKeys("{F11}")
  }
}
}