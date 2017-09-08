var ajax = require('../../unit/common/js/getApi');

var lock = false;

var index = {

    init: function() {
        this.addEvent();
    },

    sendApi: {

        login: function(data) {
            $J_login.html('登录中...');
            ajax.callAPI({
                type: 'post',
                url: '/api/mlogin',
                data: data,
                dataType: 'json',
                success: function(rsp) {

                    if (rsp.success === true) {
                        window.location.href = '/main';
                    } else {
                        $J_login.html('登录');
                    }
                    lock = false;
                },
                error: function(error) {
                    lock = false;
                    $J_login.html('登录');
                }
            });
        }
    },

    login: function() {

        var username = $('#J_username').val();
        var password = $('#J_password').val();

        if (username.length === 0 || password.length === 0) {
            alert('请填写用户名或密码');
        }

        var data = {
            'grant_type': 'password',
            'username': username,
            'password': password
        }

        if (!lock) {
            lock = true;
            this.sendApi.login(data);
        }
    },
    addEvent: function() {

        var $this = this;
        var $J_login = $('#J_login');

        $J_login.on('click', function(event) {
            event.preventDefault();
            $this.login();
            return false;
        })
    }
};

index.init();