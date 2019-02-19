// Подключаем пакеты
var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var less = require('gulp-less');
var plumber = require('gulp-plumber');
var notify = require('gulp-notify');
var autoprefixer = require('gulp-autoprefixer');

// ********** Создаем тестовые задачи **********
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


// ********** Создаем задачи **********

// Task для компиляции Less (1 способ)

/* gulp.task('less', function() {
  return new Promise(function (resolve, reject) {
    return gulp.src('./src/less/main.less')
      .pipe(less())
      .pipe(gulp.dest('./src/css/'))
      // метод stream точечно обновляет только одни стили, а reload обновляет всю страницу
      .pipe(browserSync.stream())
      .pipe(resolve());
  });
}); */

// Task для компиляции Less (2 способ)
gulp.task('less', function(done) {
    return gulp.src('./src/less/main.less')
      // Обработка ошибок: перед тем как начать обработку, сначала запустим plumber
      .pipe(
        plumber({
          errorHandler: notify.onError( (err) => {
            return {
              title: 'Styles', // указываем свой title
              message: err.message
            }
          } )
        })
      )
      // Преобразование less в css
      .pipe(less())
      // Расстановка автопрефиксов
      .pipe(
        autoprefixer({
          browsers: ['last 6 versions'], // указываем количество последних браузеров, для которых нужно раставлять автопрефиксы
          cascade: false
        })
      )      
      .pipe(gulp.dest('./src/css/'))
      // метод stream точечно обновляет только одни стили, а reload обновляет всю страницу
      .pipe(browserSync.stream())
      .on('end', done);

});

// Создаем задачу
gulp.task('server', gulp.series(['less'], function (done) {
  browserSync.init({
    server: { baseDir: './src/' }
  });

  gulp.watch('src/**/*.html').on('change', browserSync.reload);
  gulp.watch('src/less/**/*.less', gulp.series(['less']));
  gulp.watch('src/js/**/*.js').on('change', browserSync.reload);
  done();
}));

// Создаем задачу по умолчанию
gulp.task('default', gulp.series(['server']));