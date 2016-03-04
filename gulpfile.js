var gulp        = require("gulp"),
    tsc         = require("gulp-typescript"),
    mocha       = require("gulp-mocha"),
    runSequence = require("run-sequence"),
    istanbul    = require("gulp-istanbul");
    
gulp.task("mocha", function() {
  return gulp.src([
      'node_modules/reflect-metadata/Reflect.js',
      'test/**/*.test.js'
    ])
    .pipe(mocha({ui: 'bdd'}))
    .pipe(istanbul.writeReports());
});

gulp.task("istanbul:hook", function() {
  return gulp.src(['src/**/*.js'])
      // Covering files
      .pipe(istanbul())
      // Force `require` to return covered files
      .pipe(istanbul.hookRequire());
});

gulp.task("cover", function() {
  if (!process.env.CI) return;
  return gulp.src("coverage/**/lcov.info")
      .pipe(coveralls());
});

gulp.task("test", function(cb) {
  runSequence("istanbul:hook", "mocha", "cover", cb);
});


gulp.task("default", function (cb) {
  runSequence(
    "test",
    cb);
});