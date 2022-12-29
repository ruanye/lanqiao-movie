const fs = require("fs");
const path = require("path");
const { getTimestamp } = require("./index");

/**
 * 更新每道题的得分到 result.json 中
 */
function writeScore(score) {
  const scoreObj = {
    ...score,
    push_at: getTimestamp(),
    passed: score.user_score >= score.passed_score,
  };
  // 从文件 result.json 中读取当前判题结果
  let data = fs.readFileSync(path.join(fs.realpathSync(process.cwd()), "./result.json"), "utf-8");
  data = JSON.parse(data);
  /**
   * 根据传参对象 scoreObj 更新对应题目的成绩
   */
  let isHad = false;
  data.pass_detail.forEach((item, i) => {
    if (item.skill_point_id === scoreObj.skill_point_id && item.checker === scoreObj.checker) {
      isHad = true;
      data.pass_detail[i] = scoreObj;
    }
  });
  if (!isHad) {
    data.pass_detail.push(scoreObj);
  }
  // 将当前文件夹的判断脚本写入 json 文件
  fs.writeFileSync(
    path.join(fs.realpathSync(process.cwd()), "./result.json"),
    JSON.stringify(data),
    "utf8",
  );
}

const writeScoreFn = scoreObj => {
  const obj = scoreObj;
  return (score, errorMsg = "") => {
    obj.user_score = score;
    writeScore(obj);
    if (errorMsg) {
      console.error(errorMsg);
      process.exit();
    }
  };
};

module.exports = { writeScore, writeScoreFn };
