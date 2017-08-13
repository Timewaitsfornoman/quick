;/**
 * @desc    浏览器检测
 * @author  lzc <llangzicao@163.com>
 * @date    2016-06-016
 */

var ua = window.navigator.userAgent;
var matched;
var browser = {} ;
if((matched = ua.match(/(?:UCWEB|UCBrowser\/)([\d\.]+)/))) {
    browser = {
        name: 'UC',
        isUC: true,
        version: matched[1]
    }
} else if((matched = ua.match(/MQQBrowser\/([\d\.]+)/))) {
    browser = {
        name: 'QQ',
        isQQ: true,
        version: matched[1]
    }
} else if((matched = ua.match(/MiuiBrowser\/([\d\.]+)/))) {
    browser = {
        name: 'Xiaomi',
        isXiaomi: true,
        version: matched[1]
    }
} else if((matched = ua.match(/(?:Chrome|CriOS)\/([\d\.]+)/))) {
    browser = {
        name: 'Chrome',
        isChrome: true,
        version: matched[1]
    }
} else if(ua.match(/Mobile Safari/) && (matched = ua.match(/Android[\s\/]([\d\.]+)/))) {
    browser = {
        name: 'Android',
        isAndroid: true,
        version: matched[1]
    }
} else if(ua.match(/iPhone|iPad|iPod/)) {
    if(ua.match(/Safari/)) {
        matched = ua.match(/Version\/([\d\.]+)/)
        browser = {
            name: 'Safari',
            isSafari: true,
            version: matched ? matched[1] : '0.0.0'
        }
    } else {
        matched = ua.match(/OS ([\d_\.]+) like Mac OS X/);
        browser = {
            name: 'iOS Webview',
            isWebview: true,
            version: matched[1].replace(/\_/, '.')
        }
    }
} else {
    browser = {
        name:'unknown',
        version:'0.0.0'
    }
}

browser.version = require('./version.js')(browser.version);

module.exports = browser;
