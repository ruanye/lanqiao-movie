const { runBrowser, goToPage, getTextByEl, sleep } = require("../utils");
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
      movieId: 168
    },
  });
  const tabList = await page.$$(".tab-item");
  if (!tabList?.length) {
    clearTimeout(timeOut);
    writeScore(0, "未获取到选项卡");
    return;
  }
  await tabList[1].click();
  await sleep(500);
  const priceList = await page.$$(".session-price");
  if (!priceList?.length) {
    clearTimeout(timeOut);
    writeScore(1, "切换日期未获取对应场次");
    return;
  }
  const price = await getTextByEl(priceList[0]);
  if (!price.includes("43")) {
    clearTimeout(timeOut);
    writeScore(1, "场次数据不正确");
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
