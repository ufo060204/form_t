const path = require("path");
const TerserPlugin = require("terser-webpack-plugin");
const webpack = require("webpack"); // 確保添加這行

module.exports = {
  mode: "development", // 或 'production'，根據需求設定
  // mode: 'production', // 或 'production'，根據需求設定
  optimization: {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          // keep_fnames: /^renderStarRatings$/,
          keep_fnames: /^(renderStarRatings|get_api_admodule)$/,
          compress: {
            drop_console: true,
          },
        },
      }),
    ],
  },
  entry: {
    all: "./tpl_c/js/all.js",
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[name].[ext]",
              outputPath: "fonts/",
            },
          },
        ],
      },
    ],
  },
  output: {
    filename: "all.js", // 更改輸出的檔名
    path: path.resolve(__dirname, "./tpl_c/js/"), // 輸出目錄
    // library: "all",
    // libraryTarget: "window",
    // libraryExport: "default",
    library: {
      name: "myLibrary",
      type: "window",
    },
    libraryTarget: "umd",
  },
  // plugins: [
  //   // 添加這個 plugins 數組
  //   new webpack.ProvidePlugin({
  //     api: ["MyLibrary", "api"],
  //   }),
  // ],
};
