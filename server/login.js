/**
 * @synopsis 登录
 * @param fn, 回调
 */

var request = require('request');
var main = require('./main');
var baseUrl = require('../config/config.js');

var superLogin = function(req, res) {

    var body = req.body;

    var optoion = {
        method: 'POST',
        url: baseUrl.url + '/v1/login',
        form: {
            grant_type: 'password',
            username: body.username,
            password: body.password
        },
        headers: {
            'Authorization': 'Basic c2V5bW91ci13ZWI6YVJiYXoyOWR2aUIlITpxLTBwMTV0',
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    };

    request(optoion, function(error, body, data) {

        if (data) {

            try {
                console.log('data',data);
                typeof data === 'string' && (data = JSON.parse(data));

                if (data.token_type && data.access_token) {
                    req.session.token = data.token_type + ' ' + data.access_token;

                    console.log(req.session);

                    res.json({
                        success: true,
                        msg: '登录成功'
                    });
                } else {
                    res.json({
                        success: false,
                        msg: '登录失败'
                    });
                }

            } catch (e) {
                res.status(500);
                res.json({
                    'status': 'error',
                    'msg': '服务器异常'
                });
                console.log('catch',e);
            }
        } else {
            res.status(500);
            res.json({
                'status': 'error',
                'msg': '服务器异常'
            });
            console.log('superLogin error!');
        }
    });
};

module.exports = superLogin;