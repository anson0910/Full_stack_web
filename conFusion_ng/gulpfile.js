var gulp = require('gulp'),
    minifycss = require('gulp-minify-css'),
    jshint = require('gulp-jshint'),
    stylish = require('jshint-stylish'),
    uglify = require('gulp-uglify'),
    usemin = require('gulp-usemin'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    changed = require('gulp-changed'),
    rev = require('gulp-rev'),
    ngannotate = require('gulp-ng-annotate'),
    browserSync = require('browser-sync'),
    del = require('del');


gulp.task('jshint', function() {
  return gulp.src('app/scripts/**/*.js')
  .pipe(jshint())
  .pipe(jshint.reporter(stylish));
});

gulp.task('usemin',['jshint'], function () {
  return gulp.src('app/**/*.html')
      .pipe(usemin({
        css:[minifycss(),rev()],
        js: [ngannotate(),uglify(),rev()]
      }))
      .pipe(gulp.dest('dist/'))
      .pipe(gulp.dest('json-server/public/'));
});

// Views
gulp.task('copyviews', function() {
return gulp.src('app/views/*')
    .pipe(gulp.dest('dist/views'))
    .pipe(gulp.dest('json-server/public/views'));
});

// Images
gulp.task('imagemin', function() {
  return del(['dist/images']), del(['json-server/public/images']), gulp.src('app/images/**/*')
    .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
    .pipe(gulp.dest('dist/images'))
    .pipe(gulp.dest('json-server/public/images'))
    .pipe(notify({ message: 'Images task complete' }));
});

gulp.task('copyfonts', ['clean'], function() {
   gulp.src('./bower_components/font-awesome/fonts/**/*.{ttf,woff,eof,svg}*')
   .pipe(gulp.dest('./dist/fonts'))
   .pipe(gulp.dest('json-server/public/fonts'));
   gulp.src('./bower_components/bootstrap/dist/fonts/**/*.{ttf,woff,eof,svg}*')
   .pipe(gulp.dest('./dist/fonts'))
   .pipe(gulp.dest('json-server/public/fonts'));
});

// Watch
gulp.task('watch', ['browser-sync'], function() {
    // Watch .js files
    gulp.watch('{app/scripts/**/*.js,app/styles/**/*.css,app/**/*.html}', ['usemin']);
      // Watch image files
    gulp.watch('app/images/**/*', ['imagemin']);
});

gulp.task('browser-sync', ['default'], function () {
    var files = [
      'app/**/*.html',
      'app/styles/**/*.css',
      'app/images/**/*.png',
      'app/scripts/**/*.js',
      'dist/**/*'
    ];

    browserSync.init(files, {
      server: {
         baseDir: "dist",
         index: "index.html"
     },
     reloadDelay: 1000
    });
        // Watch any files in dist/, reload on change
    gulp.watch(['dist/**']).on('change', browserSync.reload);
});

// Clean
gulp.task('clean', function() {
    del(['json-server/public']);
    return del(['dist']);
});

// Clear task, use when images do not get copied to destination folder
gulp.task('clear', function(done){
  return cache.clearAll(done);
});

// Default task
gulp.task('default', ['clean'], function() {
    gulp.start('usemin', 'imagemin','copyfonts', 'copyviews');
});
