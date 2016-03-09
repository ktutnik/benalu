"use strict";


var gulp        = require("gulp"),
    tslint      = require("gulp-tslint"),
    tsc         = require("gulp-typescript"),
    runSequence = require("run-sequence"),
    mocha       = require("gulp-mocha"),
    istanbul    = require("gulp-istanbul")


gulp.task("lint", function() {
    
    var config =  { emitError: (process.env.CI) ? true : false };
    
    return gulp.src([
        "src/**/**.ts",
        "test/**/**.test.ts",
        "type_definitions/**/**.ts"
    ])
    .pipe(tslint())
    .pipe(tslint.report("verbose", config));
});


var tsProject = tsc.createProject("tsconfig.json");

gulp.task("build-source", function() {
    return gulp.src([
        "src/**/**.ts",
        "typings/tsd.d.ts"
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
        "tests/**/*.ts",
        "typings/tsd.d.ts"
    ])
    .pipe(tsc(tsTestProject))
    .on("error", function (err) {
        process.exit(1);
    })
    .js.pipe(gulp.dest("tests/"));
});

var tsTypeDefinitionsProject = tsc.createProject("tsconfig.json");

gulp.task("build-type-definitions", function() {
  return gulp.src("type_definitions/**/*.ts")
             .pipe(tsc(tsTypeDefinitionsProject))
             .on("error", function (err) {
                 process.exit(1);
             })
             .js.pipe(gulp.dest("type_definitions/"));
});

gulp.task("build", function(cb) {
  runSequence("lint", "build-source", "build-test", "build-type-definitions", cb);
});


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


gulp.task("dist", function() {
  return gulp.src("src/benalu.js")
    .pipe(gulp.dest("dist/"));
});


gulp.task("default", function (cb) {
  runSequence(
    "build",
    "test",
    "dist",
    cb);
});