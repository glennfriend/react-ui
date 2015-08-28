var path        = require("path");

var gulp        = require("gulp"),
    connect     = require('gulp-connect'),
    notify      = require('gulp-notify'),
    babel       = require("gulp-babel"),
    jsx         = require('react-jsx-anywhere/gulp')
    concat      = require('gulp-concat');

var config = require("./config/config.json");

var watchList = [
    'dist/utils.js',
    'src/**/*.js',
    'src/**/*.jsx',
    'src/**/*.php',
    '!src/**/compile.tmp.js',
];

// listen
gulp.task('connect', function() {
    connect.server({
        root: './',
        livereload: true
    });
});

gulp.task('list', function () {
    gulp.src(watchList)
        .pipe(connect.reload());
});
gulp.task('watch', function () {
    gulp.watch( watchList, ['list', 'developerDemo']);
});

gulp.task('compile', function () {
    return gulp.src(['dist/utils.js', 'src/**/*.jsx', '!src/**/main.jsx'])
        .pipe(jsx())
        .pipe(babel())
        .on('error', notify.onError({
            title: 'babel ES6 to ES5:',
            message: 'Failed'
        }))
        .pipe(concat(getBundleName()))
        .pipe(gulp.dest("build"));
});

/**
 *  開發時使用的 compile.tmp.js
 *      - 不需存到 git
 *      - 不需打包
 *      - 開發者才需要該檔案
 *      - main.js 必須要 compile 在所有元件的最後面
 */
gulp.task('developerDemo', function () {

    if ( !config ) {
        console.log('Custom Error: config not found!');
        return false;
    }
    if ( !config.menu ) {
        console.log('Custom Error: config.menu not found!');
        return false;
    }

    var compileFile = 'compile.tmp.js';

    config.menu.forEach(function(item) {
        var title   = item[0];
        var sub     = item[1];
        var pathway = item[2];

        gulp
            .src([
                pathway + '/*.jsx',
                pathway + '/*.js',
                '!' + pathway + '/' + compileFile
            ])
            .pipe(jsx())
            .pipe(babel())
            .on('error', notify.onError({
                title: 'babel ES6 to ES5:',
                message: 'Failed'
            }))
            .pipe(concat(compileFile))
            .pipe(gulp.dest(pathway));

    });

});

/**
 *  公用程式
 *  注意, 這些檔案 "沒有" watch
 */
gulp.task('toAssets', function () {
    gulp.src('./node_modules/react/dist/**')        .pipe(gulp.dest("build/assets/react/"));
    gulp.src('./node_modules/bootstrap/dist/**')    .pipe(gulp.dest("build/assets/bootstrap/"));
    gulp.src('./node_modules/font-awesome/css/**')  .pipe(gulp.dest("build/assets/font-awesome/css/"));
    gulp.src('./node_modules/font-awesome/fonts/**').pipe(gulp.dest("build/assets/font-awesome/fonts/"));
    gulp.src('./node_modules/jquery/dist/*')        .pipe(gulp.dest("build/assets/jquery/"));
});

// --------------------------------------------------------------------------------

gulp.task('default', function() {
    console.log('---- bundle name ----');
    console.log(getBundleName());
    gulp.run('connect','watch','developerDemo','compile','toAssets');
});

// --------------------------------------------------------------------------------

var getBundleName = function () {
    var name = require('./package.json').bundleName;
    return name + '.' + 'js';
};

