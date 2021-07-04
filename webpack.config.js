const HtmlWebpackPlugin = require("html-webpack-plugin")
const path = require("path")
// const MiniCssExtractPlugin = require("mini-css-extract-plugin")

module.exports = {
  entry: {
    main: {
      import: "./src/index.ts",
    },
    menuExample: {
      import: "./example/menu/index.ts",
    },
    gpcExample: {
      import: "./example/gpc/index.ts",
    },
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "dist/[name].js",
  },
  // Enable sourcemaps for debugging webpack's output.
  devtool: "inline-source-map",
  resolve: {
    // Add '.ts' and '.tsx' as resolvable extensions.
    extensions: ["", ".ts", ".js"],
  },
  module: {
    // TS rules must come before JS
    rules: [
      // All files with a '.ts' or '.tsx' extension will be handled by 'ts-loader'.
      { test: /\.tsx?$/, loader: "ts-loader" },
      // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
      { test: /\.js$/, loader: "source-map-loader" },
      {
        test: /\.s?css$/,
        use: [
          // { loader: MiniCssExtractPlugin.loader },
          "style-loader",
          // Translates CSS into CommonJS
          "css-loader",
          // Compiles Sass to CSS
          "sass-loader",
        ],
      },
    ],
  },
}
