module.exports = {
  env: {
    NODE_ENV: '"development"'
  },
  defineConstants: {
    'process.env.AMAP_API': '"https://restapi.amap.com/v3/assistant/"',
    'process.env.CLOUD_URL': '"https://cloud.netfarmer.com.cn"',
    'process.env.ZOHO_URL': '"https://www.zohoapis.com.cn"',
  },
  mini: {},
  h5: {
    // devServer: {
    //   host: "localhost",
    //   port: 10086,
    //   proxy: [
    //     {
    //       context: ['/crm/v2', '/upload','/coach'],
    //       target: "https://www.zohoapis.com.cn",//域名
    //       pathRewrite: {
    //         "^/api": "/api",
    //         "^/coach": "/coach",
    //         "^/upload": "/upload" 
    //       },
    //       changeOrigin: true,

    //       secure: false,

    //     },

    //   ],

    // }
  }
}
