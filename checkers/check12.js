const { runBrowser, goToPage, sleep } = require("../utils");
const { writeScoreFn } = require("../utils/writeScore");
const scoreObj = {
  skill_point_id: 1804,
  title: "JavaScript、ES6 基础语法",
  checker: "检测“实现确认选座检查，跳转”",
  user_score: 0,
  skill_score: 5,
  passed_score: 5,
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
    writeScore(0, "未找到购买按钮");
  }
  // 最多6个，最小1个
  if (page.url().includes("orderDetail")) {
    writeScore(0, "要设置最小选择一个座位");
  }
  await unSelectorSeatEls[1].click();
  await sleep(500);
  await buyButtonEl.click();
  await sleep(500);
  if (!page.url().includes("orderDetail")) {
    writeScore(0, "购买后未跳转到订单详情页");
  }
  console.log("测试通过");
  writeScore(5);
  await  browser.close()
};
test();
