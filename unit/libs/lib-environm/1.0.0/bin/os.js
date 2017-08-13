;/**
 * @desc    系统检测
 * @author  lzc <llangzicao@Q163.com>
 * @date    2016-06-16
 */

var os =  {};

var ua = window.navigator.userAgent;
var matched;

if((matched = ua.match(/Android[\s\/]([\d\.]+)/))) {
    os = {
        name: 'Android',
        isAndroid: true,
        version: matched[1]
    }
} else if((matched = ua.match(/(iPhone|iPad|iPod)/))) {
    var name = matched[1];

    matched = ua.match(/OS ([\d_\.]+) like Mac OS X/);

    os = {
        name: name,
        isIPhone: (name === 'iPhone' || name === 'iPod'),
        isIPad: name === 'iPad',
        isIOS: true,
        version: matched[1].split('_').join('.')
    }
} else {
    os = {
        name:'unknown',
        version:'0.0.0'
    }
}
os.version = require('./version.js')(os.version);
module.exports = os;
