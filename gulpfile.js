var gulp = require('gulp'),
    server = require('gulp-express');

gulp.task('server', function () {
      server.run(['app.js']);
});

gulp.task('default', ['server']);
