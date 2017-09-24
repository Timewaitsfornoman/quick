var router = {

    registergetRoutes: function(app) {
        app.get('/address', function(req, res, next) {
            res.render('address');
        });

        app.get('/twitem', function(req, res, next) {
            res.render('twitem', {
                layout: 'mainmobile'
            });
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