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
  checker: "首页滚动加载",
  user_score: 0,
  skill_score: 10,
  passed_score: 5,
};
const scoreObj2 = {
  skill_point_id: 1808,
  title: "AJAX操作",
  checker: "首页滚动加载",
  user_score: 0,
  skill_score: 10,
  passed_score: 5,
};

const writeScore = writeScoreFn(scoreObj);
const writeScore2 = writeScoreFn(scoreObj2);
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
    clearTimeout(timeOut);
    writeScore(0, "滚动到底没有加载更多数据");
    writeScore2(0, "滚动到底没有加载更多数据")
    return;
  }
  await sleep(500);
  const moreMovieItemList = await page.$$(".movie-item");
  if (moreMovieItemList?.length !== 20) {
    clearTimeout(timeOut);
    writeScore(0, "加载更多数据后电影列表数量不正确");
    writeScore2(0, "加载更多数据后电影列表数量不正确")
    return;
  }
  console.log("测试通过");
  clearTimeout(timeOut);
  writeScore(5);
  writeScore2(10);
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

