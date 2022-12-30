const shell = require("shelljs");
let { writeScore, writeLog } = require("./writeScore.js");
const nowDate = new Date();
const scoreObj = {
  skill_point_id: 1847,
  title: "使用 Git 管理代码版本",
  checker: "版本控制功能",
  user_score: 0,
  skill_score: 5,
  passed_score: 5,
  push_at: parseInt(nowDate.getTime() / 1000),
  passed: false,
};
// 检测版本控制
res = shell.exec(
  "cat /home/project/.git/logs/HEAD | grep 0000000000000000000000000000000000000000 | grep commit | grep initial | grep :"
);
console.log(12, res.code);
if (res.code !== 0) {
  writeScore(scoreObj);
  writeLog("检测版本控制失败");
  // process.exit(1); // 结束进程，检测失败
} else {
  scoreObj.user_score = 5;
  scoreObj.passed = true;
  writeScore(scoreObj);
}
