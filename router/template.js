var connection = require('../models/templatesdb');

var getAction = {

    index: function(req, res, next) {

        connection.index(req.query.id, function(err, rows, fields) {

            var data = req.body;

            if (err) {
                res.json({ 'success': false, 'error': '数据库出错了' });
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

    getTempList: function(req, res, next) {

        if (!req.body.type) {
            res.json({ 'success': false, 'msg': '模板类型不能为空!' });
            return;
        }

        connection.getTempList(req.body.type, function(err, rows, fields) {

            var data = req.body;

            if (err) {
                res.json({ 'success': false, 'error': '数据库出错了' });
            }

            rows && res.json({ 'success': true, 'msg': '模板查询成功', 'template': rows});
        });
    },

    addTemplate: function(req, res, next) {

        connection.login(req.body, function(err, rows, fields) {

            var data = req.body;

            if (err) {
                res.json({ 'success': false, 'error': '数据库出错了' });
            }

            if (rows) {
                console.log(rows);
                var length = rows.length;
                for (var i = 0; i < length; i++) {
                    if (rows[i].username === data.username && rows[i].password === data.password) {

                        res.json({ 'success': true, 'msg': '登陆成功', 'id': rows[i].id });
                        return;
                    }
                }
            }
        });
    },

    deleteTemplate: function(req, res, next) {
    },

    updateTemplate: function(req, res, next) {
    }
}

module.exports = {

    registergetRoutes: function(app) {
        // app.get('/index', getAction.index);
        // app.get('/createpage', getAction.createpage);
        // app.get('/editpage', getAction.editpage);
    },

    registerpostRoutes: function(app) {
        app.post('/getTempList', postAction.getTempList);
        // app.post('/deletePages', postAction.deletePages);
        // app.post('/adupdatePagesdPages', postAction.updatePages);
    },

    registerRoutes: function(app) {
        // this.registergetRoutes(app);
        this.registerpostRoutes(app);
    }
};
