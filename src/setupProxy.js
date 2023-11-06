const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://ceprj.gachon.ac.kr:60006',	
      changeOrigin: true,
    })
  );
};