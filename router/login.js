var connection = require('../models/userdb');

var login = require('../server/login.js');
var main = require('../server/main.js');

var getAction = {

    login: function(req, res, next) {
        res.render('login');
    },

    register: function(req, res, next) {
        res.render('register');
    },

    update: function(req, res, next) {
        res.render('update');
    }
};

var postAction = {

    login: function(req, res, next) {

        connection.login(req.body, function(err, rows, fields) {

            var data = req.body;

            if (err) {
                res.json({
                    'success': false,
                    'error': '数据库出错了'
                });
            }

            if (rows) {
                console.log(rows);
                var length = rows.length;
                for (var i = 0; i < length; i++) {
                    if (rows[i].username === data.username && rows[i].password === data.password) {

                        res.json({
                            'success': true,
                            'msg': '登陆成功',
                            'id': rows[i].id
                        });
                        return;
                    }
                }
            }
        });
    },

    register: function(req, res, next) {

        connection.regist(req.body, function(err, results) {
            console.log(err);
            console.log(results);
            if (err) {
                res.json({
                    'success': false,
                    'error': '数据库出错了'
                });
                return;
            } else {
                results.success = true;
                res.json(results);
            }
            console.log('register', results);
        });
    },

    update: function(req, res, next) {}
};

module.exports = {

    registergetRoutes: function(app) {
        app.get('/', getAction.login);
        app.get('/register', getAction.register);
        app.get('/mlogin', function(req, res, next) {
            res.render('loginin', {
                layout: 'mainmobile'
            });
        });

        app.get('/main', function(req, res, next) {
            res.render('main', {
                layout: 'mainmobile'
            });
        });
    },

    registerpostRoutes: function(app) {
        app.post('/api/user/login', postAction.login);
        app.post('/api/user/regist', postAction.register);
        app.post('/api/login', function(req, res, next) {
            // login(req, res)
            res.json({
                success: true,
                msg: '登录成功'
            });;
        });
        app.post('/api/main', function(req, res, next) {
            main(req, res);
        });
    },

    registerRoutes: function(app) {
        this.registergetRoutes(app);
        this.registerpostRoutes(app);
    }
};