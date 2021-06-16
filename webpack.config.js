module.exports = {
  entry: {
    main: {
      import: "./src/index.ts",
      filename: "./dist/index.ts",
    },
    example: {
      import: "./src/example.ts",
      filename: "./dist/example.ts",
    },
    gpcExample: {
      import: "./src/gpc-example.ts",
      filename: "./dist/gpc-example.ts",
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
    ],
  },
}
