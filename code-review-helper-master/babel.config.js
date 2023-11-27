const path = require('path')

module.exports = {
  only: [path.resolve(__dirname, 'src')],
  sourceMaps: "inline",
  presets: ['@babel/preset-typescript'],
  plugins: [
    [
      'babel-plugin-tsconfig-paths',
      {
        relative: true,
        extensions: ['.ts'],
        rootDir: path.resolve(__dirname),
      }
    ],
    [
      '@babel/plugin-transform-modules-commonjs', {
        allowTopLevelThis: true
      }
    ]
  ]
}
