const { runBrowser, goToPage, sleep } = require("../utils");
const { writeScoreFn } = require("../utils/writeScore");
const scoreObj = {
  skill_point_id: 9,
  title: "蓝桥电影",
  checker: "检测“实现确认选座检查，跳转”",
  user_score: 0,
  skill_score: 5,
  passed_score: 5,
};
const writeScore = writeScoreFn(scoreObj);
const test = async () => {
  const browser = await runBrowser();
  const page = await goToPage(browser, {
    url: "seat",
    query: {
      id: 1278,
      movieId: 168,
    },
  });
  const unSelectorSeatEls = await page.$$(".seat-selector-room-key");
  const buyButtonEl = await page.$(".buy-button");
  if (!buyButtonEl) {
    writeScore(0, "未找到购买按钮");
  }
  // 最多6个，最小1个
  if (page.url().includes("orderDetail")) {
    writeScore(2, "要设置最小选择一个座位");
  }
  for (let i = 0; i < 7; i++) {
    await unSelectorSeatEls[i].click();
  }
  await sleep(500);
  const selectedSeatEls = await page.$$(".selected");
  if (selectedSeatEls?.length !== 6) {
    writeScore(3, "最多选择6个座位");
  }
  await buyButtonEl.click();
  await sleep(500);
  if (!page.url().includes("orderDetail")) {
    writeScore(4, "购买后未跳转到订单详情页");
  }
  console.log("测试通过");
  writeScore(5);
};
test();
