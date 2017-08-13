/**
 * 
 * @authors Your Name (you@example.org)
 * @date    2016-09-22 16:34:56
 * @version $Id$
 */

var ajax = require('../../unit/common/js/getApi');
var docookie = require('../../unit/common/js/cookie');
var popup = require('../../unit/libs/lib-popup/1.0.0/popup');

var $J_login = $('#J_login');

var login = {

    init: function() {
        this.addEvent();
    },

    sendApi: {

        login: function(data) {
            ajax.callAPI({
                type: 'post',
                url: 'user/login',
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
                        popup.note('恭喜你,等陆成功!', 1000);
                        docookie.setCookie('user_name', data.username);
                        docookie.setCookie('user_id', rsp.id);

                        setTimeout(function() {
                            window.location.href = '/index?id=' + rsp.id;
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

        $J_login.on('click', function() {

            event.preventDefault();

            var $J_username = $('#J_username');
            var $J_password = $('#J_password');

            var username = $J_username.val();
            var password = $J_password.val();

            var data = {
                'username': username,
                'password': password
            };

            var result = $this.formValidation(data);

            if (result === true) {
                $this.sendApi.login(data);
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
                'errorText': '公司名称不能为空'
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

login.init();