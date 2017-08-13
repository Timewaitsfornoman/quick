
var environm = {
    app: require('./bin/app.js'),
    browser: require('./bin/browser.js'),
    os:require('./bin/os.js'),
    version: require('./bin/version.js'),
    environ: require('./bin/environ.js')
} ;

if (environm.app.name != 'unknown' && !environm.app.isWeixin && !environm.app.isWeibo) {

    environm.tujia = {
        appname: environm.app.name,
        platform: environm.os.name,
        version: environm.app.version
    }
}

module.exports = environm;