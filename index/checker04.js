const { runBrowser, goToPage, sleep } = require("../utils");
const { writeScoreFn } = require("../utils/writeScore");

const scoreObj = {
  skill_point_id: 4,
  title: "蓝桥电影",
  checker: "检测首页“滚动加载”",
  user_score: 0,
  skill_score: 5,
  passed_score: 4,
};
const writeScore = writeScoreFn(scoreObj);
const test = async () => {
  const browser = await runBrowser();
  const page = await goToPage(browser);
  await page.evaluate(() => {
    const app = document.querySelector("#app");
    app.scrollBy(0, 9999);
  });
  try {
    await page.waitForResponse(response => response.url().includes("/movie/page"), {
      timeout: 2000,
    });
  } catch (e) {
    writeScore(0, "滚动到底没有加载更多数据");
    return;
  }
  await sleep(500);
  const moreMovieItemList = await page.$$(".movie-item");
  if (moreMovieItemList?.length !== 20) {
    writeScore(4, "加载更多数据后电影列表数量不正确");
    return;
  }
  console.log("测试通过");
  writeScore(5);
};
test();
