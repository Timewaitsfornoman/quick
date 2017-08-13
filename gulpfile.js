//@note 上线前的打包
//@author LZC

var less = require('less');
var fs = require('fs');
var browserify = require('browserify');
var path = require('path');
var gulp = require('gulp');
var util = require('gulp-util');
var through = require('through2');
var concat =require('gulp-concat');
var uglify = require('gulp-uglify');
var minify = require('gulp-minify-css');
var tinypng = require('gulp-tinypng-compress');

var srcpath = {
    css: './src/less/**/*.less',
    js: './src/js/**/*.js',
    images: 'src/images/**/*.{png,jpg,jpeg}'
};

// 流错误处理
var errStream = function(stream, err) {

    // 输出错误信息
    util.log(err);

    stream.emit('error', err);
    // 结束流
    stream.emit('end');

};

// browserify -> gulp
var getBrowserifyStream = function() {

    var errorJsMsg = function(err) {
        return 'console.log("' + err + '")';
    };

    return through.obj(function(file, env, callback) {

        // browserify解析js
        var b = browserify({
            entries: file.path
        });

        var self = this;

        b.bundle(function(err, buffer) {

            if (err) {
                errStream(self, err);
                return;
            }

            file.contents = buffer;
            callback(null, file);

        });

    });
};

// 生成css from less文件
var parseChangeextName = function(extName, originExtName) {

    return through.obj(function(file, env, callback) {

        // 修改path的扩展名为debug.css或debug.js 
        var cssPath = file.path.replace('.' + (originExtName || extName), '.' + extName);
        file.path = cssPath;
        callback(null, file);

    });
};

var logStream = function(text) {
    return through.obj(function(file, env, callback) {

        // 输出log
        util.log(util.colors.blue(file.relative) + ' ' + text);
        callback(null, file);

    });
};

// 打包js
gulp.task('js', function() {

    return gulp.src(srcpath.js)
        // 任务开始log
        .pipe(logStream('task start'))
        // 使用browserify解析
        .pipe(getBrowserifyStream())

        .pipe(gulp.dest('./public/js/'))
        // 任务结束log
        .pipe(logStream('js task finish'));

});

// less -> gulp
var getLessStream = function() {

    // less解析出错时的替换内容
    var errCssMsg = [
        "body:before{",
        "content:'这个文件打包出了问题，请检查相应less文件';",
        "position:fixed;",
        "background:#000;",
        "left:0;top:0;padding:1rem;",
        "}"
    ].join('');

    return through.obj(function(file, env, callback) {

        var self = this;
        var content = file.contents.toString();

        // 使用less解析文件内容
        less.render(content, {
            filename: file.path
        }, function(e, output) {
            if (e) {
                // 错误处理
                //errStream(self,e);

                // less解析出错 输出错误提示
                file.contents = new Buffer(errCssMsg, 'utf8');
                callback(null, file);

            } else {
                // 将解析的内容塞到流内
                file.contents = new Buffer(output.css, 'utf8');
                callback(null, file);
            }
        });
    });

};

// 打包css
gulp.task('css', function() {

    return gulp.src(srcpath.css)
        // 任务开始log
        .pipe(logStream('task start'))
        // 处理less文件
        .pipe(getLessStream())
        .pipe(parseChangeextName('css', 'less'))
        .pipe(minify())
        // 生成线上代码
        .pipe(gulp.dest('./public/css/'))
        // 任务结束log
        .pipe(logStream('less task finish'));

});

gulp.task('tinypng', function() {
    return gulp.src(srcpath.images)
        .pipe(tinypng({
            key: 'DKKh31uvqUv4I8KCGHibzzC_sYcQGWRK',
            //sigFile: 'images/.tinypng-sigs',
            log: true
        }))
        .pipe(gulp.dest('public/images'));
});

//静态资源
gulp.task('copyjs', function() {
    var copy = ['./public/js/**/*.js'];

    return gulp.src(copy)
           .pipe(logStream('task start'))
           .pipe(uglify())
           .pipe(gulp.dest('./build/public/js/'))
           .pipe(logStream('task finish'));
});

gulp.task('copycss', function() {
    var copy = ['./public/css/**/*.css'];

    return gulp.src(copy)
           .pipe(logStream('task start'))
           .pipe(minify())
           .pipe(gulp.dest('./build/public/css/'))
           .pipe(logStream('task finish'));
});

gulp.task('copyimages', function() {
    var copy = [
               './public/images/**/*.png',
                './public/images/**/*.jpg',
                './public/images/**/*.gif',
                './public/images/*.ico'
            ];
    return gulp.src(copy)
           .pipe(logStream('task start'))
           .pipe(gulp.dest('./build/public/images/'))
           .pipe(logStream('task finish'));
});

//服务器资源

gulp.task('copybin', function() {
    var copy = ['./bin/*.js'];
    return gulp.src(copy)
           .pipe(logStream('task start'))
           .pipe(uglify())
           .pipe(gulp.dest('./build/bin/'))
           .pipe(logStream('task finish'));
});

gulp.task('copyconfig', function() {
    var copy = [ './config/*.js'];
    return gulp.src(copy)
           .pipe(logStream('task start'))
           .pipe(gulp.dest('./build/config/'))
           .pipe(logStream('task finish'));
});

gulp.task('copymodels', function() {
    var copy = ['./models/**/*.js'];
    return gulp.src(copy)
           .pipe(logStream('task start'))
           .pipe(uglify())
           .pipe(gulp.dest('./build/models/'))
           .pipe(logStream('task finish'));
});

gulp.task('copyrouter', function() {
    var copy = ['./router/**/*.js'];
    return gulp.src(copy)
           .pipe(logStream('task start'))
           .pipe(uglify())
           .pipe(gulp.dest('./build/router/'))
           .pipe(logStream('task finish'));
});

gulp.task('copyserver', function() {
    var copy = ['./server/**/*.js'];
    return gulp.src(copy)
           .pipe(logStream('task start'))
           .pipe(uglify())
           .pipe(gulp.dest('./build/server/'))
           .pipe(logStream('task finish'));
});

gulp.task('copyview', function() {
    var copy = ['./views/**/*.handlebars'];
    return gulp.src(copy)
           .pipe(logStream('task start'))
           .pipe(gulp.dest('./build/views/'))
           .pipe(logStream('task finish'));
});

gulp.task('copyrun', function() {
    var copy = ['./server.js'];
    return gulp.src(copy)
           .pipe(logStream('task start'))
           .pipe(uglify())
           .pipe(gulp.dest('./build/'))
           .pipe(logStream('task finish'));
});

gulp.task('copy', ['copyjs','copycss','copyimages','copybin','copyconfig','copymodels','copyrouter', 'copyserver','copyview','copyrun']);

gulp.task('default', ['js', 'css']);

gulp.task('pub', ['default', 'copy']);

gulp.task('watch', function() {
    gulp.watch(srcpath.css, ['css']);
    gulp.watch(srcpath.js, ['js']);
});