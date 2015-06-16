var gulp = require('gulp'),
    babel = require('gulp-babel'),
    del = require('del');

gulp.task('clean', function(next){
    del(['./dist'], next);
});

var WATCHERS = [];

function createWatchTask(name, watchPath, defaultDepends, func) {
    gulp.task(name, defaultDepends, func);
    gulp.task(name + '-watch', func);
    WATCHERS.push({
        path: watchPath,
        task: name + '-watch'
    })
}

createWatchTask('manifest', './manifest.json', ['clean'], function(next){
    gulp.src('./manifest.json')
        .pipe(gulp.dest('./dist'))
        .on('end', next);
});

createWatchTask('static', './static/**/*.*', ['clean'], function(next){
    gulp.src('./static/**/*.*')
        .pipe(gulp.dest('./dist/static'))
        .on('end', next);
});

createWatchTask('build', './src/**/*.js', ['clean'], function buildTask(next) {
    gulp.src('./src/**/*.js')
        .pipe(
            babel({
                blacklist: ['regenerator'],
                optional: ['asyncToGenerator'],
                comments: false
            })
        )
        .on(
            'error',
            function(e) {
                console.error(e);
                next();
            }
        )
        .pipe(gulp.dest('./dist'))
        .on('end', next);
});

gulp.task('default', ['clean', 'static', 'manifest', 'build']);

function notifier(event) {
    console.log(
        'File',
        event.path.replace(process.cwd() + '/', ''),
        'was',
        event.type + ', rebuild...'
    );
}

gulp.task('watch', ['default'], function(){
    WATCHERS.forEach(function (el) {
        var watcher = gulp.watch(el.path, [el.task]);
        watcher.on(
            'change',
            notifier
        );
    });
});