const shell = require("shelljs");
const { writeScoreFn } = require("../utils/writeScore");
const nowDate = new Date();
// 判题超时设置，成功或者失败时需要清除
let timeOut = setTimeout(() => {
  writeScore(0,`检测脚本超时，请检查原因`)
  writeScore2(0,`检测脚本超时，请检查原因`)
  clearTimeout(timeOut);
  process.exit(1);
}, 30000);

const scoreObj1 = {
  skill_point_id: 1840,
  title: "前端构建工具 webpack",
  checker: "项目打包功能",
  user_score: 0,
  skill_score: 5,
  passed_score: 5,
  push_at: parseInt(nowDate.getTime() / 1000),
  passed: false,
};
const scoreObj2 = {
  skill_point_id: 1844,
  title: "npm 的使用",
  checker: "项目打包功能",
  user_score: 0,
  skill_score: 5,
  passed_score: 5,
  push_at: parseInt(nowDate.getTime() / 1000),
  passed: false,
};
let  writeScore = writeScoreFn(scoreObj1);
let  writeScore2 = writeScoreFn(scoreObj2);

// 13. 检测项目打包功能
let res1 = shell.exec(`test -f /home/project/dist/js/app*.js`);
let res2 = shell.exec(`test -f /home/project/dist/static/main*.js`);
let res3 = shell.exec(`test -f /home/project/build/static/main*.js`);

if (res1.code == 0 || res2.code == 0 || res3.code == 0) {
  writeLog("项目打包功能得分：5");
  writeScore(5,`项目打包功能得分：5`)
  writeScore2(5,`项目打包功能得分：5`)
  clearTimeout(timeOut);
} else {
  writeLog("项目打包功能失败");
  writeScore(scoreObj1);
  writeScore(scoreObj2);
  clearTimeout(timeOut);
}
