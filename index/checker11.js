const { getScreenShot, getDiff, runBrowser, goToPage } = require("../utils/index");
const { writeScore } = require("../utils/writeScore");
const { sleep } = require("../utils");
const scoreObj = {
  skill_point_id: 1798,
  title: "静态页面布局",
  checker: "订单详情页”的静态布局还原度",
  user_score: 0,
  skill_score: 5,
  passed_score: 5,
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
    process.exit(1);
    return;
  }
  scoreObj.user_score = 5 * ((100 - diff) / 100);
  writeScore(scoreObj);
  browser.close();
};

getRenderDiff();
