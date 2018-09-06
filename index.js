const Koa = require("koa");
const app = new Koa();
const wechat = require('co-wechat');
const p = require('./p')
const config = {
    token: 'hello',
    appid: 'wx99f71b2b053c5855',
  };
app.use(wechat(config).middleware(async (message, ctx) => {
  console.log("========")
    let res = await p.search(message.Content)
    return res;
  }));

app.listen(3000,()=>{
    console.log('app is runnnig......')
})