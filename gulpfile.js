var gulp = require("gulp"); // 載入 gulp
var concat = require("gulp-concat"); // 合併文件
var browserSync = require("browser-sync").create(); // 瀏覽器同步
var cleanCSS = require("gulp-clean-css"); // 壓縮 css
var del = require("del"); // 刪除文件
var connect = require("gulp-connect"); // 本地服務器
var jshint = require("gulp-jshint"); // 檢查 js
var babel = require("gulp-babel"); // 轉換 ES6
var uglify = require("gulp-uglify"); // 壓縮 js
var gulpif = require("gulp-if"); // 條件判斷
var useref = require("gulp-useref"); // 合併檔案
// var replace = require("gulp-replace"); // 替換 dist 路徑
var webpack = require("webpack-stream"); // webpack 打包
var webpackConfig = require("./webpack.config.js"); // 導入 Webpack 配置
var nested = require("postcss-nested"); // scss 轉換

var autoprefixer = require("autoprefixer");
var sourcemaps = require("gulp-sourcemaps");
var postcss = require("gulp-postcss");
var tailwindcss = require("tailwindcss");

var tailwindConfig = {
  default: { config: "tailwind.config.cjs" },
  newDentist: { config: "tpl/js/new_dentist/new_dentist_tailwind_config.cjs" },
};

function createHtmlTask(taskName, srcFiles) {
  return gulp.task(taskName, function () {
    return gulp
      .src(srcFiles)
      .pipe(gulp.dest("tpl_c/"))
      .pipe(browserSync.stream());
  });
}

function createJsTask(taskName, srcFiles, outputFile) {
  return gulp.task(taskName, function () {
    return gulp
      .src(srcFiles)
      .pipe(concat(outputFile))
      .pipe(jshint())
      .pipe(babel())
      .pipe(gulp.dest("tpl_c/js/"))
      .pipe(browserSync.stream());
  });
}

function createCssTask(taskName, srcFiles, outputFile, tailwindConfig) {
  return gulp.task(taskName, function () {
    return gulp
      .src(srcFiles)
      .pipe(sourcemaps.init())
      .pipe(concat(outputFile))
      .pipe(postcss([tailwindcss(tailwindConfig), autoprefixer()]))
      .pipe(sourcemaps.write("."))
      .pipe(gulp.dest("tpl_c/css/"))
      .pipe(browserSync.stream());
  });
}

function createVariableTask(taskName, srcFiles, outputDir) {
  return gulp.task(taskName, function () {
    return (
      gulp
        .src(srcFiles)
        .pipe(gulp.dest(outputDir))
    );
  });
}

function createCleanTask(taskName, srcFiles) {
  return gulp.task(taskName, function () {
    return del(srcFiles);
  });
}

function createConnectTask(taskName, baseDir, indexPage = "index.html") {
  return gulp.task(taskName, function (cb) {
    browserSync.init(
      {
        server: {
          baseDir: baseDir,
          index: indexPage,
          // routes: {
          //   "/images": "./images",
          //   "/css": "css",
          //   "/assets": "./assets",
          //   "/api": "./api",
          // },
        },
      },
      function (err, bs) {
        if (err) {
          cb(err);
        } else {
          cb();
        }
      }
    );
  });
}

// function createConnectTask(taskName, baseDir, indexPage = "new_index.html") {
//   return gulp.task(taskName, function (cb) {
//     browserSync.init({
//       server: {
//         // 資源存取的來源資料夾，相對於 baseDir
//         baseDir: baseDir,
//         index: indexPage,
//         routes: {
//           "/images": "./images",
//           "/css": "css",
//           "/assets": "./assets",
//           "/api": "./api",
//         },
//       },
//     });
//     cb();
//   });
// }

// function createWebpackTask(taskName, srcFiles, outputFile) {
//   return gulp.task(taskName, function () {
//     return gulp
//       .src(srcFiles)
//       .pipe(webpack(webpackConfig))
//       .pipe(gulp.dest(outputFile))
//       .pipe(browserSync.stream());
//   });
// }

// function createWebpackTask(
//   taskName,
//   srcFiles,
//   outputFile,
//   isProduction = false
// ) {
//   return gulp.task(taskName, function () {
//     // 複製 webpackConfig
//     const config = Object.assign({}, webpackConfig);
//     // 根據環境設置 mode
//     config.mode = isProduction ? "production" : "development";
//     // dev 環境可做其他修改
//     // if (isProduction) {
//     //   // 可以在這裡添加其他 dev 環境特定的配置
//     //   config.optimization = config.optimization || {};
//     //   config.optimization.minimize = true;
//     // }
//     return gulp
//       .src(srcFiles)
//       .pipe(webpack(config))
//       .pipe(gulp.dest(outputFile))
//       .pipe(browserSync.stream());
//   });
// }

function createWebpackTask(
  taskName,
  srcFiles,
  outputFile,
  isProduction = false
) {
  return gulp.task(taskName, function () {
    // 複製 webpackConfig
    // const config = Object.assign({}, webpackConfig);
    // console.log(config);

    // // 根據環境設置 mode
    // config.mode = isProduction ? "production" : "development";

    // // 配置 optimization
    // config.optimization = config.optimization || {};
    // if (isProduction) {
    //   config.optimization.minimize = true; //
    //   config.optimization.minimizer = [
    //     new TerserPlugin({
    //       terserOptions: {
    //         // keep_fnames: /^renderStarRatings$/,
    //         keep_fnames: /^(renderStarRatings|get_api_admodule)$/,
    //         compress: {
    //           drop_console: true,
    //         },
    //       },
    //     }),
    //   ];
    // }
    // if (!isProduction) {
    //   config.output = config.output || {};
    //   config.output.library = "MyLibrary";
    //   config.output.libraryTarget = "window";
    //   config.output.libraryExport = "default";
    // }
    // // 設置適當的 devtool
    // config.devtool = isProduction ? "source-map" : "eval-source-map";

    return (
      gulp
        .src(srcFiles)
        // .pipe(webpack(config))
        .pipe(webpack(webpackConfig))
        .pipe(gulp.dest(outputFile))
        .pipe(browserSync.stream())
    );
  });
}

// 創建任務
createHtmlTask("new-html", ["tpl/*.html"]);
createHtmlTask("new-json", ["tpl/*.json"]);
createHtmlTask("new-php", ["tpl/*.php"]);

createJsTask(
  "new-js",
  [
    "tpl/js/jquery/jquery-1.11.0.min.js",
    "tpl/js/slider-pro/jquery.sliderPro.js",
    "tpl/js/lazysizes/lazysizes.min.js",
    "tpl/js/twd/twd.js",
  ],
  "twd.min.js"
);

createJsTask(
  "new-js-luxury",
  ["assets/2/js/luxury2.js", "assets/2/js/swiper.js"],
  "luxury2All.js"
);

createJsTask(
  "new-js-newDentist",
  [
    // "tpl/js/new_dentist/new_dentist.js",
    // "tpl/js/new_dentist/new_dentist_test.js",
    "tpl/js/new_dentist/new_dentist_test_2.js",
    "tpl/js/new_dentist/new_dentist_swiper.js",
  ],
  "new_dentist.js"
);

createJsTask(
  "new-js-test",
  [
    "tpl/js/test.js",
  ],
  "test.js"
);

createJsTask(
  "new-js-all",
  [
    "tpl/js/all.js"
  ],
  "all.js"
);

createCssTask(
  "new-css",
  [
    "tpl/css/tailwind/tailwind.base.css",
    "tpl/css/tailwind/layout.intro.css",
    "tpl/css/tailwind/layout.content.css",
    "tpl/css/tailwind/module.card.css",
    "tpl/css/tailwind/module.title.css",
    "tpl/css/tailwind/module.nav.css",
    "tpl/css/tailwind/module.score.css",
    "tpl/css/tailwind/theme.contact.css",
    "tpl/css/tailwind/theme.slider.css",
    "tpl/css/tailwind/theme.sp.css",
    "tpl/css/tailwind/theme.sp.bigwave.css",
    "tpl/css/tailwind/theme.sp.bubble.css",
    "tpl/css/tailwind/theme.sp.curtain.css",
    "tpl/css/tailwind/theme.sp.soreal.css",
  ],
  "twd.min.css",
  tailwindConfig.default
);

createCssTask(
  "new-css-luxury",
  ["assets/2/css/tailwind.luxury2.base.css", "assets/2/css/luxury2.css"],
  "luxury2All.css",
  tailwindConfig.default
);

createCssTask(
  "new-css-newDentist",
  [
    "tpl/css/new_dentist/new_dentist_tailwind_base.css",
    "tpl/css/new_dentist/new_dentist_layout.css",
    "tpl/css/new_dentist/new_dentist_module.css",
    "tpl/css/new_dentist/new_index.css",
    "tpl/css/new_dentist/new_rank.css",
    "tpl/css/new_dentist/new_normal.css",
    "tpl/css/new_dentist/new_knowledge.css",
    "tpl/css/new_dentist/new_article.css",
    "tpl/css/new_dentist/new_contact.css",
  ],
  "new_dentist.css",
  tailwindConfig.newDentist
);

createCssTask(
  "new-css-all",
  [
    "tpl/css/new_contact.css",
  ],
  "all.css",
  tailwindConfig.js
);

createVariableTask(
  "new-css-variable",
  [
    "tpl/css/variable.css",
    // "tpl/css/variable.dentist.css",
    // "tpl/css/new_dentist/new_dentist_variable.css",
  ],
  "tpl_c/css/"
);

createVariableTask(
  "new-css-variable-build",
  ["tpl/css/variable.css"],
  "dist/css/"
);

// 開發任務
createWebpackTask("webpack:dev", "tpl_c/js/all.js", "tpl_c/js/", false);
// 生產任務
createWebpackTask("webpack:prod", "tpl_c/js/all.js", "tpl_c/js/", true);

createCleanTask("clean:tpl_c", ["tpl_c/**/*"]);
createCleanTask("clean:dist", ["dist/**/*"]);

createConnectTask("connect:tpl_c", "./tpl_c");
createConnectTask("connect:index", "./tpl_c");
createConnectTask("connect:dist", "./dist");

gulp.task("new-watches-dev", function () {
  // gulp.watch("assets/**/js/*.{js, cjs}", gulp.series("new-init"));
  // gulp.watch("assets/**/css/*.css", gulp.series("new-init"));
  gulp.watch("tpl/*.html", gulp.series("new-init"));
  gulp.watch("tpl/js/**/*.{js, cjs}", gulp.series("new-init"));
  // gulp.watch("tpl_c/js/**/*.{js, cjs}", gulp.series("dev"));
  gulp.watch("tpl/css/**/*.css", gulp.series("new-init"));
  // gulp.watch(
  //   [
  //     "tpl/css/variable.css",
  //     "tpl/css/variable.dentist.css",
  //     "tpl/css/new_dentist/new_dentist_variable.css",
  //   ],
  //   gulp.series("new-css-variable")
  // );
  // gulp.watch(["images/**/*", "assets/**/images/*"], gulp.series("new-init"));
  // gulp.watch("gulpfile.js", gulp.series("dev"));
});

gulp.task("new-minFs", function () {
  return gulp
    .src("tpl_c/*.html")
    .pipe(useref())
    .pipe(gulpif("*.js", uglify()))
    .pipe(gulpif("*.css", cleanCSS()))
    .pipe(gulp.dest("dist"));
});

// gulp.task(
//   "new-init",
//   gulp.series(
//     "clean:tpl_c",
//     gulp.series(
//       "new-html",
//       "new-js",
//       "new-js-luxury",
//       "new-js-newDentist",
//       "webpack:dev",
//       "new-css",
//       "new-css-luxury",
//       "new-css-newDentist",
//       "new-css-variable"
//     )
//   )
// );

const commonTasks = [
  "clean:tpl_c",
  "new-html",
  "new-js-test",
  "new-js-all",
  // "new-js-luxury",
  // "new-js-newDentist",
  "new-css-all",
  // "new-css-luxury",
  // "new-css-newDentist",
  "new-css-variable",
  "new-json",
  "new-php",
];

gulp.task("new-init", gulp.series(...commonTasks, "webpack:dev"));
gulp.task("new-init-build", gulp.series(...commonTasks, "webpack:prod"));

gulp.task(
  "new-dev",
  gulp.series("new-init", "connect:tpl_c", "new-watches-dev")
);
gulp.task(
  "new-build",
  gulp.series(
    "clean:dist",
    gulp.series(
      "new-init-build",
      "new-css-variable-build",
      "new-minFs",
      "clean:tpl_c"
    )
  )
);
gulp.task("new-serve", gulp.series("new-build", "connect:dist"));

// gulp.task("dev", gulp.series("new-html", "css", "js", "connect:index"));
