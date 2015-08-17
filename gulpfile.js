const
  gulp = require('gulp'),
  babel = require('gulp-babel'),
  del = require('del'),
  watch = require('gulp-watch'),
  plumber = require('gulp-plumber');

gulp.task('clean',
  function (next) {
    del(['./dist'], next);
  }
);

const TASKS = [];

function task(path, handlers) {
  TASKS.push({
    path: path,
    handlers: handlers
  });
}

task('manifest.json', [gulp.dest('./dist')]);

task('static/**/*.*', [gulp.dest('./dist/static')]);

task('src/**/*.js', [
  babel({
    blacklist: [
      'regenerator',
      'es6.blockScoping',
      'es6.constants',
      'es6.forOf',
      'es6.templateLiterals'
    ],
    optional: ['asyncToGenerator'],
    comments: false
  }),
  gulp.dest('./dist')
]);

gulp.task('default', ['clean'], function (cb) {
  var counter = 0;

  console.log('start');

  function count() {
    ++counter;
    if (counter == TASKS.length) {
      cb()
    }
  }

  for (var i = 0; i < TASKS.length; i++) {
    var task = TASKS[i];
    var stream = gulp.src('./' + task.path);
    console.log(task.path);

    for (var j = 0; j < task.handlers.length; j++) {
      console.log('before');
      stream = stream.pipe(task.handlers[j]);
      console.log('after');
    }

    stream.on('end', count);
  }
});

gulp.task(
  'watch', ['clean'], function () {
    for (var i = 0; i < TASKS.length; i++) {
      var
        task = TASKS[i];

      var stream = gulp
        .src('./' + task.path)
        .pipe(watch(task.path, {verbose: true}))
        .pipe(plumber());

      for (var j = 0; j < task.handlers.length; j++) {
        stream = stream.pipe(task.handlers[j]);
      }
    }
  }
);