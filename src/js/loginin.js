var ajax = require('../../unit/common/js/getApi');

var lock = false;

var index = {

    init: function() {
        this.addEvent();
    },

    sendApi: {

        login: function(data) {

            ajax.callAPI({
                type: 'post',
                url: '/api/login',
                data: data,
                dataType: 'json',
                success: function(rsp) {

                    if (rsp.success === true) {
                        window.location.href = '/main';
                    } else {

                    }
                    lock = false;
                },
                error: function(error) {
                    lock = false;
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