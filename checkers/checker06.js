const { runBrowser, goToPage, getTextByEl } = require("../utils");
const { writeScoreFn } = require("../utils/writeScore");
const scoreObj = {
  skill_point_id: 6,
  title: "蓝桥电影",
  checker: "检测“排片列表页正常加载”",
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
  const movieNameEl = await page.$(".movie-name");
  if (!movieNameEl) {
    writeScore(0, "无法找到电影名称");
  }
  const movieName = await getTextByEl(movieNameEl);
  if (!movieName.includes("长津湖之水门桥")) {
    writeScore(0, "电影名称不正确");
  }
  const cinemaNameEl = await page.$(".cinema-name");
  if (!cinemaNameEl) {
    writeScore(0, "无法找到影院名称");
  }
  const cinemaName = await getTextByEl(cinemaNameEl);
  if (cinemaName !== "卓鑫电影城（广州店）") {
    writeScore(0, "影院名称不正确");
  }
  const tabList = await page.$$(".tab-item");
  if (!tabList?.length) {
    writeScore(0, "未获取到选项卡");
    return;
  }
  const sessionList = await page.$$(".session-price");
  if (sessionList?.length !== 3) {
    writeScore(0, "未找到标记4（场次价格）");
  }
  const date = await getTextByEl(tabList[0]);
  if (date !== "9月22日") {
    writeScore(1, "起始日期不正确");
  }
  if (tabList.length < 7) {
    writeScore(1, "选项卡数量不正确");
  }
  console.log("测试通过");
  writeScore(5);
};
test();