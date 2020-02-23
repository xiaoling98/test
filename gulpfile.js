var gulp = require('gulp');
var imagemin = require('gulp-imagemin');//压缩img插件
var newer = require('gulp-newer');//判断img图片是否需要重新压缩
var htmlClean = require('gulp-htmlclean');//压缩html代码
var uglify = require("gulp-uglify");//压缩js代码
var strip = require("gulp-strip-debug");//将js中的调试语句移除
var concat = require("gulp-concat");//将多个js文件合并
var less = require("gulp-less");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");//自动添加css3属性兼容写法
var cssnano = require("cssnano");
var connect = require("gulp-connect");//开启服务器

//判断当前是否为生产模式
var devMode = process.env.NODE_ENV == "development";

var folder = {
    src: 'src/',
    build: 'build/'
}

//流读取文件  
gulp.task('images', function () {
    gulp.src(folder.src + "images/*")
        .pipe(newer(folder.build + 'images'))
        .pipe(imagemin())
        .pipe(gulp.dest(folder.build + "images"))
})

gulp.task('html', function () {
    var page = gulp.src(folder.src + 'html/*')
    .pipe(connect.reload())
    if (!devMode) {
        page.pipe(htmlClean())
    }
    page.pipe(gulp.dest(folder.build + 'html'))
})

gulp.task("js", function () {
    var page = gulp.src(folder.src + "js/*")
    .pipe(connect.reload())
    // if (!devMode) {
    //     page.pipe(strip())
    //         .pipe(uglify())
    // }
    page.pipe(concat("main.js"))
    page.pipe(gulp.dest(folder.build + "js/"))
})

gulp.task("css", function () {
    var options = [autoprefixer(), cssnano()];
    var page = gulp.src(folder.src + "css/*")
    .pipe(less())
    .pipe(connect.reload())
    if (!devMode) {
        page.pipe(postcss(options))
    }

    page.pipe(gulp.dest(folder.build + "css/"))
})


gulp.task("server",function(){
    connect.server({
        livereload: true,
		port: 8080
    })
})

gulp.task("watch", function () {
    gulp.watch(folder.src + "html/*", ["html"]);
    gulp.watch(folder.src + "css/*", ["css"]);
    gulp.watch(folder.src + "js/*", ["js"]);
    gulp.watch(folder.src + "images/*", ["images"]);
})
gulp.task("default", ["html", "images", "js", "css", "watch","server"]);