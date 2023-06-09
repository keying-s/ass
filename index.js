const Koa = require("koa");
const Router = require("koa-router");
const logger = require("koa-logger");
const bodyParser = require("koa-bodyparser");
const fs = require("fs");
const path = require("path");

const wx = require("./wxAuth");


const app = new Koa();
const router = new Router();

const homePage = fs.readFileSync(path.join(__dirname, "index.html"), "utf-8");


let count = 0;

//读取本地json文件且转为对象
let QA = JSON.parse(fs.readFileSync('./data.json', "utf-8"));

app.use(async (ctx, next) => {
  console.log(111);
  ctx.set("Access-Control-Allow-Origin", "*");
  ctx.set('Access-Control-Allow-Headers','Content-Type, Authorization');
  await next()
})
// 首页
router.get("/api/getSign", async (ctx) => {
  let config = await wx.getSign();
  ctx.body = {
    type: "config",
    data: config
  }
});

router.get("/api/getSign1", async (ctx) => {
  let config = await wx.getSign('https://prod-3g8h83m1a0675dc6-1318474116.tcloudbaseapp.com/main1/index.html');
  ctx.body = {
    type: "config",
    data: config
  }
});

router.post("/api/getAnswer", async (ctx) => {

  const { request } = ctx;
  const ques = request.body.data;
  try {
    let response = await fetch('https://thevim.club/api/dangan', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: ques,
        type: 'question'
      })
    });
    let data = await response.json();
    let index=data.index;
    //如果index是数字，说明是答案，否则是错误信息
    if(isNaN(index)){
      ctx.body = {
        type: "answer",
        index: -1,
        answer: "网络错误，请稍后再试"
      };
      return;
    }
    let answer=QA[index].answer+QA[index].link;

    ctx.body = {
      type: "answer",
      index: index,
      answer: answer
    };
  } catch (err) {
    console.log(err)
    ctx.body = {
      type: "answer",
      index: -1,
      answer: "网络错误，请稍后再试"
    };
    return;
  }
  return;
});

// 更新计数
router.post("/api/c", async (ctx) => {
  const { request } = ctx;
  const { action } = request.body;
  if (action === "inc") {
    count++;
  } else if (action === "clear") {
    count = 0;
  }

  ctx.body = {
    code: 0,
    data: count,
  };
});

// 获取计数
router.get("/api/count", async (ctx) => {
  ctx.body = {
    code: 0,
    data: count
  };
});

// 小程序调用，获取微信 Open ID
router.get("/api/wx_openid", async (ctx) => {
  if (ctx.request.headers["x-wx-source"]) {
    ctx.body = ctx.request.headers["x-wx-openid"];
  }
});


app
  .use(logger())
  .use(bodyParser())
  .use(router.routes())
  .use(router.allowedMethods());

const port = process.env.PORT || 80;
async function bootstrap() {
  app.listen(port, () => {
    console.log("启动成功", port);
  });
}
bootstrap();



