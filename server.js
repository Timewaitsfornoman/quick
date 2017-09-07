var http = require('http');
var express = require('express');
var opn = require('opn');
// var proxy = require('http-proxy-middleware');
var session = require('express-session');

var app = express();

var credentials = require('./config/credentials.js');

// set up handlebars view engine
var handlebars = require('express3-handlebars').create({
    defaultLayout: 'main',
    helpers: {
        section: function(name, options) {
            if (!this._sections) this._sections = {};
            this._sections[name] = options.fn(this);
            return null;
        }
    }
});

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', process.env.PORT || 3000);

// logging
switch (app.get('env')) {
    case 'development':
        // compact, colorful dev logging
        app.use(require('morgan')('dev'));
        break;
    case 'production':
        // module 'express-logger' supports daily log rotation
        app.use(require('express-logger')({
            path: __dirname + '/log/requests.log'
        }));
        break;
}

app.use(express.static(__dirname + '/public'));
app.use(require('body-parser')());
app.use(require('cookie-parser')(credentials.cookieSecret));
app.use(session({
    secret: credentials.cookieSecret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        path: '/',
        maxAge: 1800000,
        secure: false
    }
}));

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', 'http://localhost:8080');
    res.header('Access-Control-Allow-Headers', 'Destination, Content-Type, User-Agent, X-Requested-With, If-Modified-Since');
    res.header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    res.header('Access-Control-Allow-Credentials', 'true');
    if (req.method == 'OPTIONS') {
        res.send(200);
    } else {
        next();
    }
};

app.use(allowCrossDomain);

// app.use(require('connect-history-api-fallback')());
//路由处理
require('./router/routes.js')(app);

// 404 catch-all handler (middleware)
app.use(function(req, res, next) {
    res.status(404);
    res.render('404');
});

// 500 error handler (middleware)
app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.status(500);
    res.render('500');
});

var startServer = function() {
    var server = http.createServer(app).listen(app.get('port'), function() {
        console.log('Express started in ' + app.get('env') +
            ' mode on port ' + app.get('port') +
            '; press Ctrl-C to terminate.');
        // opn('http://localhost');
    });
}

if (require.main === module) {
    // application run directly; start app server
    startServer();
} else {
    // application imported as a module via "require": export function to create server
    module.exports = startServer;
}