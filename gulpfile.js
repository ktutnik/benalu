"use strict";


var gulp        = require("gulp"),
    tsc         = require("gulp-typescript"),
    runSequence = require("run-sequence"),
    mocha       = require("gulp-mocha"),
    istanbul    = require("gulp-istanbul");

//******** BUILD *************

var tsProject = tsc.createProject("tsconfig.json");

gulp.task("build-source", function() {
    return gulp.src([
        "src/**/**.ts"
    ])
    .pipe(tsTestProject())
    .on("error", function (err) {
        process.exit(1);
    })
    .pipe(gulp.dest("src/"));
});

var tsTestProject = tsc.createProject("tsconfig.json", {
    declaration: false
});

gulp.task("build-test", function() {
    return gulp.src([
        "test/*.ts"
    ])
    .pipe(tsTestProject())
    .on("error", function (err) {
        process.exit(1);
    })
    .pipe(gulp.dest("test"));
});

var tsEs6 = tsc.createProject("tsconfig.json", {
    target: "es6",
    declaration: false
});

gulp.task("build-test-es6", function() {
    return gulp.src([
        "test/benaluproxy.es6.test.ts"
    ])
    .pipe(tsEs6())
    .on("error", function (err) {
        process.exit(1);
    })
    .pipe(gulp.dest("test"));
});

gulp.task("build", function(cb) {
  runSequence("build-source", "build-test", "build-test-es6", cb);
});


//******** TEST *************
gulp.task("mocha", function() {
  return gulp.src([
      "test/**/*.test.js"
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

gulp.task("test", function(cb) {
  runSequence("istanbul:hook", "mocha", cb);
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