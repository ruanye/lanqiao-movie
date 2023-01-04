const { runBrowser, goToPage, sleep } = require("../utils");
const { writeScoreFn } = require("../utils/writeScore");

const scoreObj = {
  skill_point_id: 1804,
  title: "JavaScript、ES6 基础语法",
  checker: "点击购票跳转",
  user_score: 0,
  skill_score: 5,
  passed_score: 5,
};
const writeScore = writeScoreFn(scoreObj);
const test = async () => {
  const browser = await runBrowser();
  const page = await goToPage(browser);
  const buyButtonList = await page.$$(".buy-button");
  const buyButton = buyButtonList[0];
  if (!buyButton) {
    writeScore(0, "未获取到购买按钮");
    return;
  }
  await buyButton.click();
  await sleep(500);
  const url = new URL(page.url());
  const queryString = url.href.split("?")[1] || "";
  const params = new URLSearchParams(queryString);
  if (
    !url.href.includes("/cinemaDetail") ||
    params.get("movieId") !== "168" 
  ) {
    writeScore(3, "跳转到影院详情页失败");
    return;
  }
  console.log("测试通过");
  writeScore(5);
  await browser.close();
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
