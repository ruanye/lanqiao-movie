const { runBrowser, goToPage } = require("../utils");
const { writeScoreFn } = require("../utils/writeScore");

const scoreObj = {
  skill_point_id: 2,
  title: "蓝桥电影",
  checker: "检测首页“正在热映”数据读取加载",
  user_score: 0,
  skill_score: 5,
  passed_score: 5,
};
const writeScore = writeScoreFn(scoreObj);
const test = async () => {
  const browser = await runBrowser();
  const page = await goToPage(browser);
  let movieItem =await page.$$('.movie-item')
  if(!movieItem||!movieItem.length){
    process.exit(1)
  }
  const movieItemList = await page.$$(".movie-item");
  if (!movieItemList?.length) {
    writeScore(0, "未获取到电影列表");
    return;
  }
  if (movieItemList.length !== 10) {
    writeScore(0, "电影列表数量不正确");
    return;
  }
  const titleElem = await movieItemList[0].$(".movie-title");
  if (!titleElem) {
    writeScore(0, "未获取到电影标题");
    return;
  }
  const title = await titleElem.evaluate(node => node.innerText);
  if (title.trim() !== "长津湖之水门桥") {
    writeScore(0, "电影标题不正确");
    return;
  }
  console.log("测试通过");
  writeScore(5);
  await browser.close()
};
test();
