const { runBrowser, goToPage, sleep } = require("../utils");
const { writeScoreFn } = require("../utils/writeScore");

const scoreObj = {
  skill_point_id:1808,
  title: "AJAX操作",
  checker: "首页Tab切换",
  user_score: 0,
  skill_score: 5,
  passed_score: 5,
};
const writeScore = writeScoreFn(scoreObj);
const test = async () => {
  const browser = await runBrowser();
  const page = await goToPage(browser);
  const tabs = await page.$$(".movie-tab");
  if (!tabs?.length || tabs.length < 2) {
    writeScore(0, "无法找到选项卡");
    return;
  }
  const firstTab = tabs[0];
  const secondTab = tabs[1];
  await secondTab.click();
  try {
   let res =  await page.waitForResponse(response => response.url().includes("/movie/recent"), {
      timeout: 2000,
    });
  } catch (e) {
    writeScore(0, "切换第二个 tab 后未发起请求");
    return;
  }
  await sleep(500);
  await firstTab.click();
  try {
    await page.waitForResponse(response => response.url().includes("/movie/page"), {
      timeout: 2000,
    });
  } catch (e) {
    writeScore(0, "切换第一个 tab 后未发起请求");
    return;
  }
  console.log("测试通过");
  writeScore(5);
  await browser.close();
};
test();
