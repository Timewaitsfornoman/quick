var fs = require("fs");
var connection = require('../models/pagesdb');

var getAction = {

    index: function(req, res, next) {
        console.log('help');
        connection.index(req.query.id, function(err, rows, fields) {

            var data = req.body;

            if (err) {
                res.json({ 'success': false, 'msg': '数据库出错了', 'error': '数据库出错了' });
            }

            if (rows) {
                console.log('rows', rows);
                var length = rows.length;
                for (var i = 0; i < length; i++) {
                    console.log("%d\t%s\t%s", rows[i].id, rows[i].page_name, rows[i].create_date);
                }

                var page_lists = { page_lists: rows };
                res.render('index', page_lists);
            }
        });
    },

    createpage: function(req, res, next) {
        res.render('createpage');
    },

    editpage: function(req, res, next) {
        res.render('editpage');
    }
};

var postAction = {

    addPages: function(req, res, next) {

        var data = req.body;
        var page_address = data.page_address;

        if (!!page_address) {
            data.page_address = 'http://m.tujiamedia.com/html/app/activities/' + page_address + '.html';
        }

        connection.addPages(req.body, function(err, rows, fields) {

            var data = req.body;

            if (err) {
                res.json({ 'success': false, 'msg': '数据库出错了', 'error': '数据库出错了' });
            }

            if (rows) {
                console.log('rows', rows);
                console.log('fields', fields);
                res.json({ 'success': true, 'msg': '创建成功', 'id': rows.insertId });
                return;
            }
        });
    },

    deletePage: function(req, res, next) {

        console.log(req.body.id);

        connection.deletePage(req.body.id, function(err, rows, fields) {

            if (err) {
                res.json({ 'success': false, 'msg': '数据库出错了', 'error': '数据库出错了' });
            }

            if (rows) {
                console.log('rows', rows);
                console.log('fields', fields);
                res.json({ 'success': true, 'msg': '删除成功', 'id': rows.insertId });
                return;
            }
        });

    },

    updatePages: function(req, res, next) {

        var data = req.body;
        var page_address = data.page_address;

        if (!!page_address) {
            data.page_address = 'http://m.tujiamedia.com/html/app/activities/' + page_address + '.html';
        }

        connection.updatePages(data, function(err, rows, fields) {
            console.log('err', err);
            if (err) {
                res.json({ 'success': false, 'msg': '数据库出错了', 'error': '数据库出错了' });
            }

            if (rows) {
                console.log('rows', rows);
                console.log('fields', fields);

                if (!!data.html && !!page_address) {

                    fs.writeFile('./build/html/app/activities/' + page_address + '.html', data.html, function(err) {
                        if (err) {
                            return console.error(err);
                        }
                        console.log('html写入成功');
                    });

                }

                if (!!data.css && !!page_address) {

                    fs.writeFile('./build/assets/css/app/activities/' + page_address + '.css', data.css, function(err) {
                        if (err) {
                            return console.error(err);
                        }
                        console.log('css写入成功');
                    });
                }

                res.json({ 'success': true, 'msg': '操作成功' });
                return;
            }
        });
    }
};

module.exports = {

    registergetRoutes: function(app) {
        app.get('/index', getAction.index);
        app.get('/createpage', getAction.createpage);
        app.get('/editpage', getAction.editpage);
    },

    registerpostRoutes: function(app) {
        app.post('/addPages', postAction.addPages);
        app.post('/deletePage', postAction.deletePage);
        app.post('/updatePages', postAction.updatePages);
    },

    registerRoutes: function(app) {
        this.registergetRoutes(app);
        this.registerpostRoutes(app);
    }
};