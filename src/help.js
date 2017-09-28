var clientName = getCookie("ASG_DisplayName");
if (clientName === null) {
    clientName = '';
}
var _365call_memberID = clientName; //  char(20)  账号(会员号)   
var _365call_clientName = clientName; //  char(50)  用户名(姓名)
var _365call_email = ""; //  char(50)  邮件地址
var _365call_phone = ""; //  char(20)  联系电话
var _365call_msn = ""; //  char(50)  MSN
var _365call_qq = ""; //  char(20)  QQ
var _365call_note = ""; //  char(100) 其他
function getCookie(name) {
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");

    if (arr = document.cookie.match(reg))

        return unescape(arr[2]);
    else
        return null;
}
var doChat = function(way) {

    var _bdhmProtocol = (("https:" == document.location.protocol) ? " https://" : " http://");

    jQuery('body').append('<div class="bridgehead"></div>');
    jQuery(".bridgehead").css("width", "42px")
        .css("height", "155px")
        .css("position", "fixed")
        .css("background", "url(https://statics.ys7.com/mall/themes/images/client.jpg) left top no-repeat")
        .css("top", "300px")
        .css("right", "10px")
        .css("cursor", "pointer");
    if (way == 2) {

        if (window.location.pathname == "/product-mall.html") {
            jQuery('.bridgehead').on('click', function() {
                var left = (window.screen.availWidth - 10 - 638) / 2;
                var top = (window.screen.availHeight - 30 - 470) / 2;
                window.open(_bdhmProtocol + 'chat.ys7.com/chat/ChatWin3.aspx?settings=mw7m6m0N0mm0666mz3Amm0666mz3Amm0666Nz3A66mmwN&UserID=-1', 'newwindow', 'height=510, width=738, top=' + top + ',left=' + left + ', toolbar=no, menubar=no, scrollbars=no, resizable=no,location=no, status=no');
            });
        } else {
            jQuery('.bridgehead').on('click', function() {
                var left = (window.screen.availWidth - 10 - 638) / 2;
                var top = (window.screen.availHeight - 30 - 470) / 2;
                window.open(_bdhmProtocol + 'chat.ys7.com/chat/ChatWin3.aspx?settings=mw76IXXN0mm0666mz3Amm0666mz3Amm0666Nz3A66mmP6&memberid=' + _365call_memberID + '&name=' + _365call_memberID + '&note=', 'newwindow', 'height=510, width=738, top=' + top + ',left=' + left + ', toolbar=no, menubar=no, scrollbars=no, resizable=no,location=no, status=no');
            });
        }
    } else {
        jQuery('.bridgehead').on('click', function() {
            var left = (window.screen.availWidth - 10 - 774) / 2;
            var top = (window.screen.availHeight - 30 - 536) / 2;
            window.open('http://qiao.baidu.com/v3/?module=default&controller=im&action=index&ucid=7168838&type=n&siteid=4932461', 'newwindow', 'height=536, width=774, top=' + top + ',left=' + left + ', toolbar=no, menubar=no, scrollbars=no, resizable=no,location=no, status=no');
        });
    }
};

(clienttype != undefined) && doChat(clienttype);

jQuery(function() {
    var bdlogo = jQuery('img[src="http://eiv.baidu.com/hmt/icon/21.gif"]');
    if (bdlogo) {
        jQuery('img[src="http://eiv.baidu.com/hmt/icon/21.gif"]').hide();
    }
})