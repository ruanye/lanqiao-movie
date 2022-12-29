const { runBrowser, goToPage, getTextByEl, sleep } = require("../utils");
const { writeScoreFn } = require("../utils/writeScore");
const scoreObj = {
  skill_point_id: 7,
  title: "蓝桥电影",
  checker: "检测“点击不同日期选项卡后正确渲染”",
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
      cinemaId: 4,
      movieId: 168,
      time: 1663776000000,
    },
  });
  const tabList = await page.$$(".tab-item");
  if (!tabList?.length) {
    writeScore(0, "未获取到选项卡");
    return;
  }
  await tabList[1].click();
  await sleep(500);
  const priceList = await page.$$(".session-price");
  if (!priceList?.length) {
    writeScore(1, "切换日期未获取对应场次");
    return;
  }
  const price = await getTextByEl(priceList[0]);
  if (!price.includes("43")) {
    writeScore(1, "场次数据不正确");
  }
  console.log("测试通过");
  writeScore(5);
};
test();
