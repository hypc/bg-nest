const gulp = require('gulp');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const del = require('del');
const pump = require('pump');

const webpack = require('webpack');
const path = require('path');


gulp.task('clean:dist', function(cb){
    return del('dist/*');
});

gulp.task('webpack', ['clean:dist'], function(cb){
    webpack({
        entry: {
            'bg-nest': './src/bg-nest.js'
        },
        output: {
            filename: '[name].js',
            path: path.resolve(__dirname, 'dist'),
            library: 'BgNest',
            libraryTarget: 'umd'
        }
    }, function(err, stats){
        cb();
    });
});

gulp.task('minify', ['webpack'], function(cb){
    pump([
        gulp.src(['dist/*.js', '!dist/*.min.js']),
        uglify(),
        rename({ extname: '.min.js' }),
        gulp.dest('dist')
    ], cb);
});

gulp.task('default', ['minify']);

gulp.task('watch', ['minify'], function(){
    gulp.watch('src/*.js', ['minify']);
});
