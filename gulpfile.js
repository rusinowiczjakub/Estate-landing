var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var serve = require('gulp-serve');
var sass = require('gulp-sass');

gulp.watch('files-to-watch', ['tasks', 'to', 'run']);

gulp.task('watch', function(){
  gulp.watch('app/scss/**/*.scss', ['sass']);
  // Other watchers
})

gulp.task('browserSync', function() {
  browserSync.init({
      injectChanges: true,
      server: "./app"
  });
})

gulp.task('sass', function() {
  return gulp.src('app/scss/**/*.scss') // Gets all files ending with .scss in app/scss
    .pipe(sass())
    .pipe(gulp.dest('app/css'))
    .pipe(browserSync.reload({
      stream: true
    }))
});

gulp.task('serve', ['sass'], function() {

    browserSync.init({
        server: "./app",
        port: 4200
    });

    gulp.watch("app/scss/*.scss", ['sass']);
    gulp.watch("app/scss/admin_partials/*.scss", ['sass']);
    // gulp.watch("app/js/*.js", ['sass']);
    gulp.watch("app/*.html").on('change', browserSync.reload);
});

gulp.task('serve-build', serve(['app', 'build']));
gulp.task('serve-prod', serve({
  root: ['app', 'build'],
  port: 4200,
  middleware: function(req, res) {
    // custom optional middleware
  }
}));
