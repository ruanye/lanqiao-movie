const { runBrowser, goToPage, getTextByEl, sleep } = require("../utils");
const { writeScoreFn } = require("../utils/writeScore");
const scoreObj = {
  skill_point_id: 8,
  title: "蓝桥电影",
  checker: "检测“点击购票正确跳转至选座页面”",
  user_score: 0,
  skill_score: 5,
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
    writeScore(1, "未获取到购买按钮");
    return;
  }
  await buyButtonEl.click();
  await sleep(500);
  if (!page.url().includes("seat")) {
    writeScore(1, "未跳转到选座页面");
  }
  console.log("测试通过");
  writeScore(5);
  await browser.close()
};
test();
