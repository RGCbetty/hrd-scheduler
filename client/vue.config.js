module.exports = {
  publicPath: "/scheduler/",
  transpileDependencies: ["vuetify"],
  devServer: {
    host: '0.0.0.0',
    port: '9001', //name of port
    public: '0.0.0.0:9001',
    // disableHostCheck: true,
    // noInfo: true,
    // proxy: 'http://hrdproxy.hrd-s.com:81'
  },
  // chainWebpack: config => {
  //     config.module;
  //     config.plugin("VuetifyLoaderPlugin").tap(args => [
  //         {
  //             progressiveImages: true,
  //             sharp: true
  //         }
  //     ]);
  // }
};
