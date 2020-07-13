module.exports = {
  chainWebpack: (config) => {
    const svgRule = config.module.rule("svg");
    const markdownRule = config.module.rule("md");

    svgRule.uses.clear();
    markdownRule.uses.clear();

    svgRule
      .use('babel-loader')
      .loader('babel-loader')
      .end()
      .use('vue-svg-loader')
      .loader('vue-svg-loader');

    markdownRule
      .test(/\.md/)
      .use('raw-loader')
      .loader('raw-loader')
  },
  devServer: {
    proxy: "https://nest.land",
  }
};