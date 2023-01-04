const { runBrowser, goToPage, getTextByEl, sleep } = require("../utils");
const { writeScoreFn } = require("../utils/writeScore");

// 判题超时设置，成功或者失败时需要清除
let timeOut = setTimeout(() => {
  writeScore(0,`检测脚本超时`);
  clearTimeout(timeOut);
  process.exit(1);
}, 30000);

const scoreObj = {
  skill_point_id: 1804,
  title: "JavaScript、ES6 基础语法",
  checker: "点击购票跳转至选座页面",
  mark_id:1,
  user_score: 0,
  skill_score: 10,
  passed_score: 5,
};
const writeScore = writeScoreFn(scoreObj);
const test = async () => {
  const browser = await runBrowser();
  const page = await goToPage(browser, {
    url: "cinemaDetail",
    query: {
      movieId: 168
    },
  });
  const buyButtonEl = await page.$(".buy-button");
  if (!buyButtonEl) {
    clearTimeout(timeOut);
    writeScore(0, "未获取到购买按钮");
    return;
  }
  await buyButtonEl.click();
  await sleep(500);
  if (!page.url().includes("seat")) {
    clearTimeout(timeOut);
    writeScore(0, "未跳转到选座页面");
  }
  console.log("测试通过");
  clearTimeout(timeOut);
  writeScore(5);
  await browser.close()
};

//执行检测

try {
  test().catch((err) => {
    clearTimeout(timeOut);
    writeScore(0, `判题发生了错误，信息如下${err}`);
  });
} catch (err) {
  clearTimeout(timeOut);
  writeScore(0, `判题发生了错误，信息如下${err}`);
}
