const { runBrowser, goToPage, sleep } = require("../utils");
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
  checker: "点击确认选座跳转",
  user_score: 0,
  skill_score: 10,
  passed_score: 5,
  markId:1  
};
const writeScore = writeScoreFn(scoreObj);
const test = async () => {
  const browser = await runBrowser();
  const page = await goToPage(browser, {
    url: "seat"
  });
  const unSelectorSeatEls = await page.$$(".seat-selector-room-key");
  const buyButtonEl = await page.$(".buy-button");
  if (!buyButtonEl) {
    clearTimeout(timeOut);
    writeScore(0, "未找到购买按钮");
  }
  // 最多6个，最小1个
  if (page.url().includes("orderDetail")) {
    clearTimeout(timeOut);
    writeScore(0, "要设置最小选择一个座位");
  }
  await unSelectorSeatEls[1].click();
  await sleep(500);
  await buyButtonEl.click();
  await sleep(500);
  if (!page.url().includes("orderDetail")) {
    clearTimeout(timeOut);
    writeScore(0, "购买后未跳转到订单详情页");
  }
  console.log("测试通过");
  clearTimeout(timeOut);
  writeScore(5);
  await  browser.close()
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
