!function n(i,o,e){function r(a,s){if(!o[a]){if(!i[a]){var p="function"==typeof require&&require;if(!s&&p)return p(a,!0);if(t)return t(a,!0);var c=new Error("Cannot find module '"+a+"'");throw c.code="MODULE_NOT_FOUND",c}var u=o[a]={exports:{}};i[a][0].call(u.exports,function(n){var o=i[a][1][n];return r(o?o:n)},u,u.exports,n,i,o,e)}return o[a].exports}for(var t="function"==typeof require&&require,a=0;a<e.length;a++)r(e[a]);return r}({1:[function(n,i,o){var e=n("../../../../unit/libs/lib-backtop/1.0.0/backtop"),r=n("../../../../unit/libs/lib-environm/1.0.0/environm"),t=($(".J_ditu"),$("#J_item").html(),$(".J_navbar"),$(".J_imgview"),$(".J_popview"),$(".J_content"),$(".J_viewwapper"),r&&r.os),a=t&&t.isIOS,s=t&&t.isAndroid,p=r&&r.app&&r.app.isTujia,c=r&&r.app&&r.app.isWeixin,u={init:function(){var n=this;n.addEvent(),e()},addEvent:function(){var n=function(){var n="",i="http://a.app.qq.com/o/simple.jsp?pkgname=com.tujiaapp.tujia",o="https://itunes.apple.com/app/id1076081346";c?n=i:s?n=i:a?n=o:console.log("You have lost your way,boy!");var e=$("#J_download");e.length||$("body").append('<a target="_blank" id="J_download" href="'+n+'" style=" display:none;cursor:pointer;">直接下载</a>'),$("#J_download").trigger("click")};$(".J_goapp").off().on("click",function(){var i=$(this),o=i.data("id");s?p?scope.atlas(Number(o)):n():a?p?window.location.href="tujiaapp:id="+o:n():console.log("数据异常")})}};u.init()},{"../../../../unit/libs/lib-backtop/1.0.0/backtop":2,"../../../../unit/libs/lib-environm/1.0.0/environm":8}],2:[function(n,i,o){i.exports=function(n){var n=n||2*window.innerHeight+100,i=".backtop",o=$(window),e=$('<a href="javascript:;" class="backtop"></a>'),r="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACMAAAAkBAMAAADx8p7SAAAAKlBMVEUAAAD+/v7//f7//f7+/f3//////v///////v///////v///P3//v7///8rNLtqAAAADXRSTlMA/NocCb9OcbXoz4VlIaFugwAAAIlJREFUKM/tyrENg1AMRVFLKdKmSpcR0mSCDJEBskikjMAQtEi0bEAJBaLyLoDvt54EK/Aq++pY2eVZ224vn95cQu6fPfLChEYvTOjuM0zo68MvmJD5cA0mtCYLJrQlWKJIsEQkGIgUTIgEA5FgIFKyZkMk2N8CkWCV9aBM/ErsTIf0uB1S1+a1AEa7aZ7PHZ7sAAAAAElFTkSuQmCC";e.css({display:"none",position:"fixed",width:"1.6rem",height:"1.6rem",right:"0.67rem","border-radius":"50%",bottom:"2.9rem","z-index":"0",background:"rgba(0, 0, 0, 0.4) url("+r+") no-repeat center","background-size":"40% 40%"}),$("body").append(e),o.on("scroll",function(){o.scrollTop()<n?e.css("display","none"):e.css("display","block")}),$(document).on("click",i,function(){o.scrollTop(0),e.css("display","none")})}},{}],3:[function(n,i,o){var e,r={},t=window.navigator.userAgent;r=(e=t.match(/MicroMessenger\/([\d\.]+)/))?{name:"Weixin",isWeixin:!0,version:e[1]}:(e=t.match(/__weibo__([\d\.]+)/))?{name:"Weibo",isWeibo:!0,version:e[1]}:(e=t.match(/Tujia\/([\d\.]+)/))?{name:"Tujia",isTujia:!0,version:e[1]}:{name:"unknown",version:"0.0.0"},r.version=n("./version.js")(r.version),i.exports=r},{"./version.js":7}],4:[function(n,i,o){var e,r=window.navigator.userAgent,t={};(e=r.match(/(?:UCWEB|UCBrowser\/)([\d\.]+)/))?t={name:"UC",isUC:!0,version:e[1]}:(e=r.match(/MQQBrowser\/([\d\.]+)/))?t={name:"QQ",isQQ:!0,version:e[1]}:(e=r.match(/MiuiBrowser\/([\d\.]+)/))?t={name:"Xiaomi",isXiaomi:!0,version:e[1]}:(e=r.match(/(?:Chrome|CriOS)\/([\d\.]+)/))?t={name:"Chrome",isChrome:!0,version:e[1]}:r.match(/Mobile Safari/)&&(e=r.match(/Android[\s\/]([\d\.]+)/))?t={name:"Android",isAndroid:!0,version:e[1]}:r.match(/iPhone|iPad|iPod/)?r.match(/Safari/)?(e=r.match(/Version\/([\d\.]+)/),t={name:"Safari",isSafari:!0,version:e?e[1]:"0.0.0"}):(e=r.match(/OS ([\d_\.]+) like Mac OS X/),t={name:"iOS Webview",isWebview:!0,version:e[1].replace(/\_/,".")}):t={name:"unknown",version:"0.0.0"},t.version=n("./version.js")(t.version),i.exports=t},{"./version.js":7}],5:[function(n,i,o){var e,r={},t=window.navigator.userAgent;r=(e=t.match(/Mobile\/([\d\.]+)/))?{name:"Mobile",isMobile:!0,version:e[1]}:{name:"unknown",version:"0.0.0"},r.version=n("./version.js")(r.version),i.exports=r},{"./version.js":7}],6:[function(n,i,o){var e,r={},t=window.navigator.userAgent;if(e=t.match(/Android[\s\/]([\d\.]+)/))r={name:"Android",isAndroid:!0,version:e[1]};else if(e=t.match(/(iPhone|iPad|iPod)/)){var a=e[1];e=t.match(/OS ([\d_\.]+) like Mac OS X/),r={name:a,isIPhone:"iPhone"===a||"iPod"===a,isIPad:"iPad"===a,isIOS:!0,version:e[1].split("_").join(".")}}else r={name:"unknown",version:"0.0.0"};r.version=n("./version.js")(r.version),i.exports=r},{"./version.js":7}],7:[function(n,i,o){function e(n){this.string=n.toString()}e.prototype.toString=function(){return this.string},e.prototype.valueOf=function(){for(var n=this.toString().split("."),i=[],o=0;o<n.length;o++){var e=parseInt(n[o],10);window.isNaN(e)&&(e=0);var r=e.toString();r.length<5&&(r=Array(6-r.length).join("0")+r),i.push(r),1===i.length&&i.push(".")}return window.parseFloat(i.join(""))},e.prototype.gt=function(n){return e.compare(this,n)>0},e.prototype.gte=function(n){return e.compare(this,n)>=0},e.prototype.lt=function(n){return e.compare(this,n)<0},e.prototype.lte=function(n){return e.compare(this,n)<=0},e.prototype.eq=function(n){return 0===e.compare(this,n)},e.compare=function(n,i){n=n.toString().split("."),i=i.toString().split(".");for(var o=0;o<n.length||o<i.length;o++){var e=parseInt(n[o],10),r=parseInt(i[o],10);if(window.isNaN(e)&&(e=0),window.isNaN(r)&&(r=0),r>e)return-1;if(e>r)return 1}return 0},i.exports=function(n){return new e(n)}},{}],8:[function(n,i,o){var e={app:n("./bin/app.js"),browser:n("./bin/browser.js"),os:n("./bin/os.js"),version:n("./bin/version.js"),environ:n("./bin/environ.js")};"unknown"==e.app.name||e.app.isWeixin||e.app.isWeibo||(e.tujia={appname:e.app.name,platform:e.os.name,version:e.app.version}),i.exports=e},{"./bin/app.js":3,"./bin/browser.js":4,"./bin/environ.js":5,"./bin/os.js":6,"./bin/version.js":7}]},{},[1]);