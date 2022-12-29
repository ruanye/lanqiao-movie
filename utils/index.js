const puppeteer = require("puppeteer");
const blinkDiff = require("blink-diff");
const qs = require("qs");
const shell = require("shelljs");

const sleep = (time = 2000) => new Promise(resolve => setTimeout(resolve, time));

const waitForSomething = async ({ func, timeout }, sleepTime) => {
  if (timeout) {
    if (sleepTime >= timeout) {
      return false;
    }
  }

  const r = await func();

  if (r) {
    return r;
  }

  await sleep(50);

  return waitForSomething({ func, timeout }, 50 + sleepTime);
};

const runBrowser = async () => {
  return await puppeteer.launch({ 
    args: ["--no-sandbox", "--disable-setuid-sandbox"] ,
    headless:false
  });
};

// const isReactOrVue = () => {
//   if (Array.from(document.querySelectorAll("*")).some(e => e._reactRootContainer !== undefined))
//     return true;
//   const all = document.querySelectorAll("*");
//   let el;
//   for (let i = 0; i < all.length; i++) {
//     if (all[i].__vue__) {
//       el = all[i];
//       break;
//     }
//   }
//   return !!el;
// };

const goToPage = async (
  browser,
  {
    url = "",
    query = {},
    viewport = {
      width: 375,
      height: 667,
      isMobile: true,
    },
  } = {},
) => {
  const host = "http://localhost:8081/";
  const page = await browser.newPage();
  page.setDefaultTimeout(10000);
  await page.setViewport(viewport);
  const queryStr = Object.keys(query).length ? `?${qs.stringify(query)}` : "";
  const nativeUrl = `${host}${url}.html${queryStr}`;
  const hashUrl = `${host}#/${url}${queryStr}`;
  // const isFramework = shell.exec("cat /home/project/package.json | grep -E 'vue|react'");
  isFramework = true;
  console.log(hashUrl,'hashUrl')
  if (isFramework) {
    await page.goto(hashUrl, {
      waitUntil: "networkidle2",
      timeout: 30000,
    });
    return page;
  } else {
    await page.goto(nativeUrl, {
      waitUntil: "networkidle2",
      timeout: 30000,
    });
    return page;
  }
};

const getScreenShot = async (page, { filename = "screenshots.png" } = {}) => {
  await page.screenshot({ path: filename, fullPage: true });
  return true;
};

const getDiff = async ({ aImage, bImage, outPath = "diff.png" }) => {
  const diff = new blinkDiff({
    imageAPath: aImage, // 设计图
    imageBPath: bImage, //页面截图
    threshold: 0.02, // 1% threshold
    imageOutputPath: outPath, //Diff路径
  });

  let res;

  diff.run(function (error, result) {
    if (error) {
      throw error;
    } else {
      res = Math.round((result.differences / result.dimension) * 100);
      // console.log(diff.hasPassed(result.code) ? "通过" : "失败");
      console.log("总像素:" + result.dimension);
      console.log("发现:" + result.differences + " 差异，差异占比" + res + "%");
    }
  });

  await waitForSomething({ func: () => res !== undefined, timeout: 30 });
  return res;
};

const checkAll = async processes => {
  for (const pro of processes) {
    console.log("===");
    const result = await pro();

    if (!result.status) {
      console.error(result.msg);
      process.exit(1);
    }
    console.log("===");
  }
};

const querySelector = async (page, selector) => {
  return await page.waitForSelector(selector);
};

const querySelectorAll = async (page, selector) => {
  return await page.$$(selector);
};

// 入参为querySelector的结果
const getTextByEl = async ele => {
  return await ele.evaluate(el => el.textContent);
};
const getTimestamp = () => parseInt(new Date().getTime() / 1000);

module.exports = {
  sleep,
  waitForSomething,
  runBrowser,
  goToPage,
  getScreenShot,
  getDiff,
  checkAll,
  querySelector,
  querySelectorAll,
  getTextByEl,
  getTimestamp,
};
