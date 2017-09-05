var router = {

    registergetRoutes: function(app) { 
        app.get('/address',function(req, res, next) {
            res.render('address');
        });
    },

    registerpostRoutes: function(app) {

    },

    registerRoutes: function(app) {
        this.registergetRoutes(app);
        this.registerpostRoutes(app);
    }
};

module.exports = router;