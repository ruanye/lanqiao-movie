const { runBrowser, goToPage, sleep } = require("../utils");
const { writeScoreFn } = require("../utils/writeScore");

const scoreObj = {
  skill_point_id: 5,
  title: "蓝桥电影",
  checker: "检测“点击购买跳转及传参”",
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
    params.get("cinemaId") !== "4" ||
    params.get("time") !== "1663776000000"
  ) {
    writeScore(3, "跳转到影院详情页失败");
    return;
  }
  console.log("测试通过");
  writeScore(5);
};
test();
