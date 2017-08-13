
var login = require('./login.js');
var pages = require('./pages.js');
var template = require('./template.js');

module.exports = function(app) {
    login.registerRoutes(app);
    pages.registerRoutes(app);
    template.registerRoutes(app);
};