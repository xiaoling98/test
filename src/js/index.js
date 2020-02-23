var dWindow = window.screen.width //获取设备宽度
var documentElement = document.documentElement //获取文档宽度

function callback() {
    var clientWidth = documentElement.clientWidth
    clientWidth = clientWidth < 1440 ? clientWidth : 1440
    documentElement.style.fontSize = clientWidth / 100 + 'px'
    console.log(clientWidth / 100 + 'px')
}
document.addEventListener('DOMContentLoaded',callback);

$ = function (val) {
  switch(val.charAt(0)) {
    case '#' :
      return document.getElementById(val.substring(1))
    case '.' :
      val = val.replace('.','')
      return document.getElementsByClassName(val)
  }
}

//惰性函数
function addEvent(dom, handler){
  //根据设备宽度判断是否为移动端，绑定合适的单击事件
  if(dWindow > 768){
    //为dom绑定click事件
    dom.addEventListener('click', handler, false)
    //将该函数重新赋值为click事件，实现懒加载
    addEvent = function (dom, handler){
      dom.addEventListener('click',handler,false);  
    }
  }else{
    dom.addEventListener('touchend', handler, false)
    addEvent = function (dom, handler){
      dom.addEventListener('touchend', handler,false);  
    }
  }
}



// 监听滚轮滚动事件
window.addEventListener('scroll', roller, true)

function roller(){
  var scrollTop = document.documentElement.scrollTop || document.body.scrollTop || window.pageYOffset
  //如果滚轮高度大于99，则固定右侧栏
  Math.round(scrollTop) > 99 ? $('.main-right')[0].classList.add('fixed') : $('.main-right')[0].classList.remove('fixed')
}




//请求视频资源
getData('../mock/review.json', function(data){
  var data = JSON.parse(data)
  var html = ''
  var len 
  //判断是否是移动端
  dWindow > 768 ? len= data.length : len = 2
  
  //通过遍历得到的数据，生成html
  for(var i = 0;i<len;i++){
      html += `<div class="data" vudio="`+ data[i].vudio +`">
                  <div><img src="`+data[i].image+`"alt="这是图片"></div>
                  <p>`+ data[i].album +`</p>
                  <p>`+ data[i].time +`</p>
              </div>`
  }
  $('.content')[0].innerHTML = html
  //获取视频列表
  var list = $('.data')
  //将视频列表的第一个视频地址赋值给播放器的url
  video.setAttribute('src', data[0].vudio)
  video.setAttribute('poster', data[0].image)

  //遍历视频列表，将每个视频列表绑定对应视频地址  
  for(var i=0;i<list.length;i++){
    //绑定单击事件
    addEvent(list[i], function(){
      //getAttribute获取每个对应的自定义属性的值
      video.setAttribute('src', this.getAttribute("vudio"))
      video.setAttribute('poster', '')
      //触发视频单击事件，开始播放视频
      audioControl(true)
    })
  }
})

//请求评论列表
getData('../mock/message.json', function(data){
  var data = JSON.parse(data)
  var html = ''
  var len 
  //判断是否是移动端
  dWindow > 768 ? len= data.length : len = 1
  //通过遍历得到的数据，生成html
  for(var i = 0;i<len;i++){
    html += `<div class="comment">
                <div class="comment-left">` + data[i].like + `</div>
                <div class="comment-right">
                    <div class="photo"><img src="`+ data[i].photo +`"></div>
                    <div class="info">
                        <span>`+ data[i].name +`</span>
                        <span>`+ data[i].location +`</span>
                    </div>
                    <p>`+ data[i].text +`</p>
                    <div class="reply">
                        <i class="iconfont icon-pinglun"></i>
                        <span>回复</span>
                    </div>
                </div>
              </div>`
  }

  $('.comment-root')[0].innerHTML = html

  //评论点赞功能
  var list = $('.comment-left')
    //遍历视频列表，将每个视频列表绑定对应视频地址  
    for(let i = 0; i < list.length; i++){
      //绑定单击事件
      addEvent(list[i], function(){
      //判断初始点赞数和当前点赞数是否相同。如果相同自增，否则自减少
        if(data[i].like == this.innerText){
          ++this.innerText
          this.style.color = 'rgb(238, 135, 135)'
        }else{
          --this.innerText 
          this.style.color = ''
        }   
      })
    }
})



//封装请求
function getData(url, fn){
ajax({
  url: url,
  type: 'get',
  success: fn
})
}


//封装ajax请求
function ajax(json){

if(window.XMLHttpRequest){
    var ajax = new XMLHttpRequest()
}
else{
    var ajax = new ActiveXObject( "Microsoft.XMLHTTP" )
}

if(json.type=='get'){
    ajax.open('get',json.url+'?'+JsonToString(json.data),true)
    ajax.send()
}
else if(json.type=='post'){
    ajax.open('post',json.url,true)
    ajax.setRequestHeader("Content-Type","application/x-www-form-urlencoded")
    ajax.send(JsonToString(json.data))
}

ajax.onreadystatechange = function(){
    if(ajax.readyState == 4){
        if(ajax.status>=200 && ajax.status<300 || ajax.status == 304){
            json.success(ajax.responseText)
        }
        else{
            json.error && json.error()
        }
    }
}


function JsonToString(json){
    var arr = []
    for(var i in json){
        arr.push(i+'='+json[i])
    }
    return arr.join('&')
}
}

