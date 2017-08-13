;/**
 * @desc    App检测 目前支持微信检测 图加app检测
 * @author  lzc <llangzicao@163.com>
 * @date    2016-06-16
 */

var app = {};
var ua = window.navigator.userAgent;
var matched;

if ((matched = ua.match(/MicroMessenger\/([\d\.]+)/))) {
    app = {
        name: 'Weixin',
        isWeixin: true,
        version: matched[1]
    }
} else if ((matched = ua.match(/__weibo__([\d\.]+)/))) {
    app = {
        name: 'Weibo',
        isWeibo: true,
        version: matched[1]
    }
} else if ((matched = ua.match(/Tujia\/([\d\.]+)/))) {
    app = {
        name: 'Tujia',
        isTujia: true,
        version: matched[1]
    }
} else {
    app = {
        name:'unknown',
        version:'0.0.0'
    }
}

app.version = require('./version.js')(app.version);

module.exports = app;
