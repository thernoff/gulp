// Подключаем пакеты
var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var less = require('gulp-less');
// Предотвратите разрыв трубы, вызванный ошибками от плагинов gulp
var plumber = require('gulp-plumber');
// Отправляет сообщения в Mac Notification Center, Linux notifications (используя notify-send) или Windows >= 8 (using native toaster) 
var notify = require('gulp-notify');
var autoprefixer = require('gulp-autoprefixer');
var scss = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');

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

// Таск для компиляции Less (1 способ)

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

// Таск для компиляции Less (2 способ)
gulp.task('less', function(done) {
    return gulp.src('./src/less/main.less')
      // Обработка ошибок: перед тем как начать обработку, сначала запустим plumber
      .pipe(
        // plumber будет обрабатывать ошибки и выводить их в консоль, 
        // причем в errorHandler вызываем notify.onError(), что по сути аналогично записи notify('message') - вывод сообщения в трей системы
        plumber({
          errorHandler: notify.onError( (err) => {
            return {
              title: 'Styles', // указываем свой title
              message: err.message
            }
          } )
        })
      )
      .pipe(
        sourcemaps.init()
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
      .pipe(sourcemaps.write())
      .pipe(gulp.dest('./src/css/'))
      // метод stream точечно обновляет только одни стили, а reload обновляет всю страницу
      .pipe(browserSync.stream())
      .on('end', done);

});

/* Таск для компиляции Scss */
gulp.task('scss', function(done) {
  return gulp.src('./src/scss/main.scss')
    .pipe(
      plumber({
        errorHandler: notify.onError( (err) => {
          return {
            title: 'Compile Scss',
            message: err.message
          }
        })
      })
    )
    .pipe(
      sourcemaps.init()
    )
    .pipe(scss())
    .pipe(
      autoprefixer({
        browsers: ['last 6 versions'],
        cascade: false
      })
    )
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./src/css/'))
    .pipe(browserSync.stream())
    .on('end', done);
})

// Создаем задачу
gulp.task('server', gulp.series(['less'], function (done) {
  browserSync.init({
    server: { baseDir: './src/' }
  });

  gulp.watch('src/**/*.html').on('change', browserSync.reload);
  gulp.watch('src/less/**/*.less', gulp.series(['less']));
  //gulp.watch('src/scss/**/*.scss', gulp.series(['scss']));
  gulp.watch('src/js/**/*.js').on('change', browserSync.reload);
  done();
}));

// Создаем задачу по умолчанию
gulp.task('default', gulp.series(['server']));