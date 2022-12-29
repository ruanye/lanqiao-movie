const {
  sleep,
  runBrowser,
  goToPage,
  getScreenShot,
  getDiff,
  checkAll,
  querySelector,
  querySelectorAll,
  getTextByEl,
} = require("../utils/index");

const run = async () => {
  const browser = await runBrowser();
  const page = await goToPage(browser, {
    url: "http://101.35.151.218/",
  });

  // test1 检查首页的渲染差异
  const getRenderDiff = async () => {
    await getScreenShot(page, {
      filename: "newShots.png",
    });

    const diff = await getDiff({ aImage: "screenshots.png", bImage: "newShots.png" });

    if (diff > 20) {
      return { status: false, msg: "差异过大" };
    }

    return { status: true, msg: "pass" };
  };

  // test2 检查tab
  const testTab = async () => {
    const firstTitle = await querySelector(page, ".movie-detail > .movie-title");
    const firstText = await getTextByEl(firstTitle);

    const tabOne = await querySelector(page, "#van-tabs-1-1");
    await tabOne.click();
    await sleep();

    const secondTitle = await querySelector(page, ".movie-detail > .movie-title");
    const secondText = await getTextByEl(secondTitle);
    console.log(firstText, secondText);
    if (firstText === secondText) {
      return { status: false, msg: "tab切换未通过" };
    }

    return { status: true, msg: "pass" };
  };

  // test3 检查滚动
  const testScroll = async () => {
    await page.evaluate(async () => {
      const app = document.querySelector("#app");

      app.scrollBy(0, 999);
    });

    await sleep();
    const chunks = await querySelectorAll(page, ".movie-detail-chunk");
    const allEle = new Array(...chunks);

    if (allEle.length < 10) {
      return { status: false, msg: "滚动检查失败" };
    }

    return { status: true, msg: "pass" };
  };

  // test4 检查购买的跳转
  const testJump = async () => {
    const buyButton = await querySelector(page, ".movie-detail-chunk > .van-button");
    buyButton.click();
    await sleep();

    const curUrl = await page.url();
    console.log(curUrl);
    if (curUrl.includes("cinema")) {
      return { status: true, msg: "pass" };
    }

    return { status: false, msg: "跳转检查失败" };
  };

  await checkAll([getRenderDiff, testTab, testScroll, testJump]);

  browser.close();
};

run();
