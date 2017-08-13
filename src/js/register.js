/**
 * 
 * @authors Your Name (you@example.org)
 * @date    2016-09-22 16:34:56
 * @version $Id$
 */

var ajax = require('../../unit/common/js/getApi');
var popup = require('../../unit/libs/lib-popup/1.0.0/popup');

var $J_regist = $('#J_regist');

var regist = {

    init: function() {
        this.addEvent();
    },

    sendApi: {

        regist: function(data) {
            ajax.callAPI({
                type: 'post',
                url: 'user/regist',
                data: data,
                dataType: 'json',
                success: function(rsp) {
                    if (typeof rsp === 'string') {
                        try {
                            rsp = JSON.parse(rsp);
                        } catch (e) {
                            popup.note('网络异常，稍后重试!', 1500);
                        }
                    };

                    if (rsp.success === true) {
                        popup.note('恭喜你，注册成功,现在可以去登陆了!', 1000);
                        setTimeout(function() {
                            window.location.href = '/';
                        }, 1000);

                    } else {
                        popup.note(rsp.msg || '网络异常，稍后再试！', 1500);
                    }
                },
                error: function() {
                    popup.note('网络异常，稍后重试', 1500);
                }
            });
        }
    },

    addEvent: function() {
        var $this = this;
        $J_regist.on('click', function(event) {

            event.preventDefault();

            var $J_username = $('#J_username');
            var $J_password = $('#J_password');
            var $J_passwordonse = $('#J_passwordonse');

            var username = $J_username.val();
            var password = $J_password.val();
            var passwordonse = $J_passwordonse.val();

            var data = {
                'username': username,
                'password': password
            };

            var result = $this.formValidation(data);

            if (result === true) {

                if (password != passwordonse) {
                    popup.note('两次输入的密码不一致', 1500);
                    return false;
                }

                $this.sendApi.regist(data);
            }
        })
    },

    formValidation: function(data) {

        var result = true,
            username = data.username,
            password = data.password;

        if (username != undefined && username.length === 0) {
            result = {
                'errorType': 'username',
                'errorText': '用户名不能为空'
            };
        } else if (password != undefined) {

            if (password.length === 0) {

                result = {
                    'errorType': 'password',
                    'errorText': '密码不能为空'
                };

            } else if (password.length < 6) {

                result = {
                    'errorType': 'password',
                    'errorText': '密码至少6位数'
                };
            }
        };

        if (result !== true) {
            popup.note(result.errorText, 1500);
        };

        return result;
    }
};

regist.init();
