const { runBrowser, goToPage,sleep } = require("../utils");
const { writeScoreFn } = require("../utils/writeScore");
const scoreObj = {
  skill_point_id: 1804,
  title: "JavaScript、ES6 基础语法",
  checker: "检测“实现选座功能（选中，反选，删除）”",
  user_score: 0,
  skill_score: 5,
  passed_score: 5,
};
const writeScore = writeScoreFn(scoreObj);
const test = async () => {
  const getSeatSelected = async (seatEl) => {
    return await seatEl.evaluate((el) => el.classList.contains("selected"));
  };
  const browser = await runBrowser();
  const page = await goToPage(browser, {
    url: "seat",
  });
  const unSelectorSeatEls = await page.$$(".seat-selector-room-key");
  if (!unSelectorSeatEls?.length) {
    writeScore(0, "未获取到座位列表");
  }
  if (unSelectorSeatEls.length < 7) {
    writeScore(0, "座位数量不正确，至少为7个");
  }
  const selectedSeat = unSelectorSeatEls[0];
  await selectedSeat.click();
  if (!(await getSeatSelected(selectedSeat))) {
    writeScore(0, "座位未选中");
  }
  const seatChunkEl = await page.$$(".select-info-card-seat-chunk");
  if (seatChunkEl?.length !== 1) {
    writeScore(0, "座位信息块未正确渲染");
  }
  await selectedSeat.click();
  if (await getSeatSelected(selectedSeat)) {
    writeScore(0, "座位未取消选中");
  }
  const seatChunkNewEl = await page.$$(".select-info-card-seat-chunk");
  if (seatChunkNewEl?.length) {
    writeScore(0, "座位取消选中后，座位简介卡未删除");
  }
  await selectedSeat.click();
  const closeButtonEl = await page.$(".close");
  if (!closeButtonEl) {
    writeScore(0, "未找到座位简介卡关闭按钮");
  }
  await closeButtonEl.click();
  if (await getSeatSelected(selectedSeat)) {
    writeScore(0, "关闭座位简介卡后座位未取消选中");
  }
  if ((await page.$$(".select-info-card-seat-chunk"))?.length) {
    writeScore(0, "点击座位简介卡关闭后未删除座位简介卡");
  }
  let selectedSeat2 = unSelectorSeatEls[11];
  await selectedSeat2.click();
  let seatChunkElText = await page.$$eval(
    ".select-info-card-seat-chunk",
    (el) => el.map((item) => item.innerText)
  );
  if (seatChunkElText?.length && seatChunkElText[0]?.includes("2排3座")) {
    console.log("座位简介卡文字显示正确");
  }

  for (let i = 0; i < 7; i++) {
    await unSelectorSeatEls[i].click();
  }
  await sleep(500);
  const selectedSeatEls = await page.$$(".selected");
  if (selectedSeatEls?.length !== 6) {
    writeScore(0, "最多选择6个座位");
  }
  console.log("测试通过");
  writeScore(5);
  await browser.close();
};
test();
