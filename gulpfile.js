"use strict";


var gulp        = require("gulp"),
    tsc         = require("gulp-typescript"),
    runSequence = require("run-sequence"),
    mocha       = require("gulp-mocha"),
    istanbul    = require("gulp-istanbul")

//******** BUILD *************

var tsProject = tsc.createProject("tsconfig.json");

gulp.task("build-source", function() {
    return gulp.src([
        "src/**/**.ts"
    ])
    .pipe(tsc(tsProject))
    .on("error", function (err) {
        process.exit(1);
    })
    .js.pipe(gulp.dest("src/"));
});

var tsTestProject = tsc.createProject("tsconfig.json");

gulp.task("build-test", function() {
    return gulp.src([
        "tests/**/*.ts"
    ])
    .pipe(tsc(tsTestProject))
    .on("error", function (err) {
        process.exit(1);
    })
    .js.pipe(gulp.dest("tests/"));
});

gulp.task("build", function(cb) {
  runSequence("build-source", "build-test", cb);
});


//******** TEST *************
gulp.task("mocha", function() {
  return gulp.src([
      "tests/**/*.test.js"
    ])
    .pipe(mocha({ui: "bdd"}))
    .pipe(istanbul.writeReports());
});

gulp.task("istanbul:hook", function() {
  return gulp.src(["src/**/*.js"])
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

//******** DISTRIBUTION *************
gulp.task("dist", function() {
  return gulp.src(["src/**/*.js", "src/**/*.d.ts"])
    .pipe(gulp.dest("dist/"));
});

//******** DEFAULT *************
gulp.task("default", function (cb) {
  runSequence(
    "build",
    "test",
    "dist",
    cb);
}); 