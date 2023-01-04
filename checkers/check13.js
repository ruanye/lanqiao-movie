const { getScreenShot, getDiff, runBrowser, goToPage } = require("../utils/index");
const { writeScore } = require("../utils/writeScore");
const { sleep } = require("../utils");


// 判题超时设置，成功或者失败时需要清除
let timeOut = setTimeout(() => {
  writeScore(0,`检测脚本超时`);
  clearTimeout(timeOut);
  process.exit(1);
}, 30000);

const scoreObj = {
  skill_point_id: 1798,
  title: "静态页面布局",
  checker: "订单详情页的静态布局",
  user_score: 0,
  skill_score: 10,
  passed_score: 10,
};
const getRenderDiff = async () => {
  const browser = await runBrowser();
  const page = await goToPage(browser, {
    url: "orderDetail",
  });
  await getScreenShot(page, {
    filename: "newShots.png",
  });
  await sleep(1000);

  const diff = await getDiff({ aImage: "screenshots.png", bImage: "newShots.png" });

  if (diff > 50) {
    scoreObj.user_score = 0;
    writeScore(scoreObj);
    clearTimeout(timeOut);
    process.exit(1);
  }
  scoreObj.user_score = 10 * ((100 - diff) / 100);
  writeScore(scoreObj);
  clearTimeout(timeOut);
  browser.close();
};


//执行检测

try {
  getRenderDiff().catch((err) => {
    clearTimeout(timeOut);
    writeScore(0, `判题发生了错误，信息如下${err}`);
  });
} catch (err) {
  clearTimeout(timeOut);
  writeScore(0, `判题发生了错误，信息如下${err}`);
}