var gulp = require('gulp'),
    babel = require('gulp-babel'),
    del = require('del');

gulp.task('clean', function(next){
    del(['./dist'], next);
});

gulp.task('manifest', ['clean'], function(next){
    gulp.src('./manifest.json')
        .pipe(gulp.dest('./dist'))
        .on('end', next);
});

gulp.task('static', ['clean'], function(next){
    gulp.src('./static/**/*.*')
        .pipe(gulp.dest('./dist/static'))
        .on('end', next);
});

function buildTask(next) {
    gulp.src('./src/**/*.js')
        .pipe(babel())
        .on(
            'error',
            function(e) {
                console.error(e);
                next();
            }
        )
        .pipe(gulp.dest('./dist'))
        .on('end', next);
}

gulp.task('build', ['clean'], buildTask);
gulp.task('build-w', buildTask);

gulp.task('default', ['clean', 'static', 'manifest', 'build']);

gulp.task('watch', ['default'], function(){
    var cwd = process.cwd() + '/';

    var watcher = gulp.watch('./src/**/*.js', ['build-w']);
    watcher.on('change', function(event) {
        console.log('JS file ' + event.path.replace(cwd, '') + ' was ' + event.type + ', rebuild...');
    });
});