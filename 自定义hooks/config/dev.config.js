const ReactRefreshPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

module.exports = {
  mode: 'development',
  devtool: 'source-map',
  devServer: {
    host: '0.0.0.0',
    port: 5200, // 不设置，自动累加
    compress: true, // 服务器压缩
    open: false, // 自动打开页面
    hot: true, // 热更新(默认开启)
    historyApiFallback: {
      index: '/index.html'
    },
  },
  plugins: [
    new ReactRefreshPlugin(),
  ]
};