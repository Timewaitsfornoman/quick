;(function($){

    $('#J_ua').text(window.navigator.userAgent);
    $('#J_app').text(lib.env.app.name);
    $('#J_os').text(lib.env.os.name);
    $('#J_browser').text(lib.env.browser.name);
    $('#J_version').text(lib.env.app.version.toString());
    $('#J_husor').text(lib.env.husorApp ? lib.env.husorApp.appname : '不在图加客户端里');


})(Zepto);