String.prototype.trim = function() {
    return this.replace(/(^\s*)|(\s*$)/g, "");
};
var docookie = {

    getCookie: function(name) {
        var cookieitem = [];
        var cookiestring = document.cookie.split(';');
        for (var i = 0; i < cookiestring.length; i++) {
            cookieitem = cookiestring[i].split("=");
            if (cookieitem[0].trim() == name) {
                return unescape(cookieitem[1]);
            }
        }
        return '';
    },

    setCookie: function(name, value, expiredays) {

        var cookie = name + "=" + escape(value);
        var expiredays = expiredays&&Number(expiredays);
        if (!!expiredays && expiredays > 0) {
            var date = new Date();
            date.setDate(date.getDate() + expiredays)
            cookie += ";expires=" + date.toGMTString();
        }
        document.cookie = cookie;
    },

    delCookie: function(name) {
        document.cookie = name + "=;expires=" + (new Date(0)).toGMTString();
    }
};

module.exports = docookie;
