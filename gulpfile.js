// Подключаем пакеты
var gulp = require('gulp');

// Создаем задачи
gulp.task('task-before-1', function () {
  return new Promise(function (resolve, reject) {
    console.log('Task before 1');
    resolve();
  })
})

gulp.task('task-before-2', ((done) => {
  console.log('Task before 2');
  done();
}))

gulp.task('start-1', gulp.series('task-before-1', 'task-before-2', function () {
  return new Promise(function (resolve, reject) {
    console.log('Start 1');
    resolve();
  })
})
)

gulp.task('start-2', gulp.series(['task-before-1', 'task-before-2'], function (done) {
  console.log("Start 2");
  done();
}))

// Урок 4: Обновление проекта с browsersync
var browserSync = require('browser-sync').create();
gulp.task('server', function (done) {
  browserSync.init({
    server: { baseDir: './src/' }
  });

  gulp.watch('src/**/*.html').on('change', browserSync.reload);
  gulp.watch('src/css/**/*.css').on('change', browserSync.reload);
  gulp.watch('src/js/**/*.js').on('change', browserSync.reload);
  done();
});

gulp.task('default', gulp.series(['server']));

// Урок 6: Task для компиляции Less
var less = require('gulp-less');

gulp.task('less', function() {
  return new Promise(function (resolve, reject) {
    return gulp.src('./src/less/main.less')
      .pipe(less())
      .pipe(gulp.dest('./src/css/'))
      .on('end', () => {
        resolve();
      });
  });
});