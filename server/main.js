/**
 * @synopsis 登录
 * @param fn, 回调
 */

var request = require('request');
var baseUrl = require('../config/config.js');

var main = function(req, res, header) {
    
    console.log('req.session', req.session);

    header = {
        'Authorization': req.session.token,
        'Content-Type': 'application/x-www-form-urlencoded'
    };

    var body = req.body;

    var optoion = {
        method: 'get',
        url: baseUrl.url + '/v1/features/home/3',
        form: {},
        headers: header
    };

    request(optoion, function(error, body, data) {

        if (data) {

            try {

                if (typeof data === 'string') {
                    data = JSON.parse(data);
                }
                
                console.log('catch string!');

                res.json(data);
            } catch (e) {
                res.status(500);
                res.json({
                    'status': 'error',
                    'msg': '服务器异常'
                });
                console.log('catch error!');
            }
        } else {
            res.status(500);
            res.json({
                'status': 'error',
                'msg': '服务器异常'
            });
        }
    });
};

module.exports = main;