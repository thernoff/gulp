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