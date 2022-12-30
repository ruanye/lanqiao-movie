// 检测是否使用第三方库
console.log("检测是否使用第三方库");
const puppeteer = require("puppeteer");
const shell = require("shelljs");
const { writeScoreFn} = require("../utils/writeScore");
let fs = require("fs");
let path = require("path");
const pageURL = "http://localhost:8081/";
const ajax_skill_point_id = 1808;
const scoreObj = {
  skill_point_id: 1826,
  title: "使用第三方库",
  checker: "使用第三方库",
  user_score: 0,
  skill_score: 5,
  passed_score: 5,
  push_at: null,
  passed: false,
};
const writeScore = writeScoreFn(scoreObj);
// 判题超时设置，成功或者失败时需要清除
let timeOut = setTimeout(() => {
  console.log(`检测脚本超时，请检查原因`);
  writeScore(0,'检测三方库超时');
  clearTimeout(timeOut);
  process.exit(1);
}, 30000);
try {
  (async () => {
    const browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 375, height: 667 });
    // 1、打开首页，获取到当前浏览器中所有 page 对象的 url
    await page.goto(pageURL);
    // console.log(pageUrlList);

    // 2、通过判断是否包含 /#/ 确定是基于原生还是基于框架的开发，进而确定即将访问的路径形式（shop.html?id=1 还是 #/shop/1）
    let res = shell.exec(
      "cat /home/project/package.json | grep -E 'vue|react'"
    );
    let isHash = res.code == 0;
    // console.log(isHash);

    if (!isHash) {
      // 如果使用原生开发
      const pageContent = await page.content(); // 获取首页内容
      if (
        // 判断是否包含 axios 或 jQuery 的引用
        pageContent.indexOf("axios.min.js") == -1 &&
        pageContent.indexOf("jquery-3.6.0.min.js") == -1
      ) {
        writeScore(0,`未使用第三方库，得分：0`);
      } else {
        writeScore(5,`使用第三方库，得分：5`);
        clearTimeout(timeOut);
      }
    } else {
      // 从文件 result.json 中读取当前判题结果
      let data = fs.readFileSync(
        path.join(fs.realpathSync(process.cwd()), "./result.json"),
        "utf-8"
      );
      data = JSON.parse(data);
      // console.log(data);
      const oneSkillInfo = data.pass_detail.filter(
        (info) => info.skill_point_id == ajax_skill_point_id
      );
      let skillPassDetail = {
        skill_point_id: oneSkillInfo[0].skill_point_id,
        user_score: 0,
        skill_score: 0,
        push_at: oneSkillInfo[0].push_at,
        passed: false,
      };
      let passedScore = oneSkillInfo[0].passed_score;
      oneSkillInfo.forEach((skill) => {
        // console.log(skill);
        if (skill.passed) {
          skillPassDetail.user_score += skill.user_score;
        }
        skillPassDetail.skill_score += skill.skill_score;
      });
      if (skillPassDetail.user_score >= passedScore) {
        skillPassDetail.passed = true;
      }
      if (skillPassDetail.passed) {
        writeScore(5,`使用第三方库，得分：5`);
        clearTimeout(timeOut);
      }
    }
    clearTimeout(timeOut);
    // 关闭 puppeteer
    await browser.close();
  })().catch((err) => {
    writeScore(0,`脚本运行发生报错${err}`);
    clearTimeout(timeOut);
    process.exit(1); // 结束进程，检测失败
  });
} catch (err) {
  writeScore(0,`脚本运行发生报错${err}`);
  clearTimeout(timeOut);
  process.exit(1); // 结束进程，检测失败
}
