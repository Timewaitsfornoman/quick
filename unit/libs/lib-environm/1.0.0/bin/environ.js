;/**
 * @desc    检测移动端，还是pc端
 * @author  lzc <llangzicao@163.com>
 * @date    2016-06-16
 */

var app = {};
var ua = window.navigator.userAgent;
var matched;

if ((matched = ua.match(/Mobile\/([\d\.]+)/))) {
    app = {
        name: 'Mobile',
        isMobile: true,
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
