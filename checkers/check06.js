const { runBrowser, goToPage, getTextByEl } = require("../utils");
const { writeScoreFn } = require("../utils/writeScore");

// 判题超时设置，成功或者失败时需要清除
let timeOut = setTimeout(() => {
    writeScore(0,`检测脚本超时`);
    clearTimeout(timeOut);
    process.exit(1);
  }, 30000);

const scoreObj = {
  skill_point_id: 1808,
  title: "AJAX操作",
  checker: "排片列表默认排片数据渲染",
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
      movieId: 168,
    },
  });
  const tabList = await page.$$(".tab-item");
  if (!tabList?.length) {
    clearTimeout(timeOut);
    writeScore(0, "未获取到选项卡");
    return;
  }
  const sessionList = await page.$$(".session-price");
  if (sessionList?.length !== 3) {
    clearTimeout(timeOut);
    writeScore(0, "未找到标记4（场次价格）");
  }
  const date = await getTextByEl(tabList[0]);
  if (date !== "9月22日") {
    clearTimeout(timeOut);
    writeScore(1, "起始日期不正确");
  }
  if (tabList.length !== 3) {
    clearTimeout(timeOut);
    writeScore(1, "选项卡数量不正确");
  }
  console.log("测试通过");
  clearTimeout(timeOut);
  writeScore(5);
  await browser.close()

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