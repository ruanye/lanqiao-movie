const shell = require("shelljs");
const { writeScoreFn} = require("../utils/writeScore");
const scoreObj = {
  skill_point_id: 1847,
  title: "使用 Git 管理代码版本",
  checker: "版本控制功能",
  user_score: 0,
  skill_score: 5,
  passed_score: 5,
  passed: false,
};
let writeScore = writeScoreFn(scoreObj)
// 检测版本控制
res = shell.exec(
  "cat /home/project/.git/logs/HEAD | grep 0000000000000000000000000000000000000000 | grep commit | grep initial | grep :"
);
console.log(12, res.code);
if (res.code !== 0) {
  writeScore(0,'检测版本控制得分失败')
} else {
  writeScore(5,'版本控制得分5分')
}
