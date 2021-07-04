const Encore = require("@symfony/webpack-encore")

// Manually configure the runtime environment if not already configured yet by the "encore" command.
// It's useful when you use tools that rely on webpack.config.js file.
if (!Encore.isRuntimeEnvironmentConfigured()) {
  Encore.configureRuntimeEnvironment(process.env.NODE_ENV || "dev")
}

Encore
  // directory where compiled assets will be stored
  .setOutputPath("dist/")
  // public path used by the web server to access the output path
  .setPublicPath("/dist")
  .addEntry("main", "./src/index.ts")
  .addEntry("menuExample", "example/menu/index.ts")
  .addEntry("gpcExample", "example/gpc/index.ts")
  .splitEntryChunks()

  // will require an extra script tag for runtime.js
  // but, you probably want this, unless you're building a single-page app
  .enableSingleRuntimeChunk()

  // region Features
  .cleanupOutputBeforeBuild()
  .enableBuildNotifications()
  .enableSourceMaps(!Encore.isProduction())
  // enables hashed filenames (e.g. app.abc123.css)
  .enableVersioning(Encore.isProduction())

  // enables @babel/preset-env polyfills
  .configureBabelPresetEnv((config) => {
    config.useBuiltIns = "usage"
    config.corejs = 3
  })

  // enables Sass/SCSS support
  .enableSassLoader()

  // uncomment if you use TypeScript
  .enableTypeScriptLoader()
// endregion features

module.exports = Encore.getWebpackConfig()
