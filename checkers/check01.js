console.log('检测首页“正在热映”数据读取加载');
const { runBrowser, goToPage } = require("../utils");
const { writeScoreFn } = require("../utils/writeScore");

const scoreObj = {
  skill_point_id: 1808,
  title: "AJAX操作",
  checker: "首页正在热映数据渲染",
  mark_id:2,
  user_score: 0,
  skill_score: 10,
  passed_score: 5,
};

const writeScore = writeScoreFn(scoreObj);

// 判题超时设置，成功或者失败时需要清除
let timeOut = setTimeout(() => {
  writeScore(0,`检测脚本超时`);
  clearTimeout(timeOut);
  process.exit(1);
}, 30000);
const test = async () => {
  const browser = await runBrowser();
  const page = await goToPage(browser);
  let movieItem = await page.$$(".best-movie-item");
  if (!movieItem || !movieItem.length) {
    clearTimeout(timeOut);
    writeScore(0,`没有找到 .best-movie-item 命名的元素`);
  }
  const movieItemList = await page.$$(".best-movie-item");
  if (!movieItemList?.length) {
    clearTimeout(timeOut);
    writeScore(0, "未获取到电影列表");
    return;
  }
  if (movieItemList.length !== 4) {
    clearTimeout(timeOut);
    writeScore(0, "电影列表数量不正确");
    return;
  }

  console.log("测试通过"); 
  clearTimeout(timeOut);
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
