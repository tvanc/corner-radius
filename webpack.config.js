module.exports = {
  entry: {
    main: {
      import: "./src/index.ts",
      filename: "./dist/index.js",
    },
    example: {
      import: "./example/menu/index.ts",
      filename: "./dist/example/menu/index.js",
    },
    gpcExample: {
      import: "./example/gpc/index.ts",
      filename: "./dist/example/gpc/index.js",
    },
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
        test: /\.scss$/,
        use: [
          // Creates `style` nodes from JS strings
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
