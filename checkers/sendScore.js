let fs = require("fs");
let path = require("path");
let request = require("request");
const shell = require("shelljs");
let { writeLog, writeScore } = require("./writeScore.js");
// 2、判断是否是 hash 模式
let hashRes = shell.exec(
  "cat /home/project/package.json | grep -E 'vue|react'"
);
let isHash = hashRes.code == 0;
let scoreObj = {
  skill_point_id: 1815,
  title: "Vue 或 React 框架",
  checker: "是否使用 hash 模式",
  user_score: 0,
  skill_score: 10,
  passed_score: 10,
  push_at: parseInt(new Date().getTime() / 1000),
  passed: false,
};
let scoreObj2 = {
  skill_point_id: 1864,
  title: "代码书写习惯和质量",
  checker: "开发规范",
  user_score: 0,
  skill_score: 5,
  passed_score: 5,
  push_at: parseInt(new Date().getTime() / 1000),
  passed: false,
};
// 从文件 result.json 中读取当前判题结果
let data = fs.readFileSync(
  path.join(fs.realpathSync(process.cwd()), "./result.json"),
  "utf-8"
);
data = JSON.parse(data);
let newD = data.pass_detail;
let hash = new Map();
// 去除重复得分项，判断标注为 id 相同，则只有一个得分
let RemoveDuplicates = (newD) => {
  let newArr = [];
  newD.forEach((item) => {
    if (item.mark_id) {
      // 判断是否有重复得分的标注信息
      let key = hash.get(item.mark_id);
      if (!key) {
        hash.set(item.mark_id, item);
        newArr.push(item);
      } else if (key && item.user_score > 0) {
        //如果数组中有这项，判断是否有得分，有则替换
        let score = item.user_score;
        newArr.map((item) => {
          if (item.id == key.id) {
            item.user_score = score;
          }
          return item;
        });
      }
    } else {
      // 如果没有重复得分的标注信息，则直接添加进数组
      newArr.push(item);
    }
  });
  return newArr;
};

let lastdata = RemoveDuplicates(newD);
const exam_id = data.exam_id; // 考试id

// 发送成绩到后台服务器
const devPath = "https://evaluation.shiyanlou.com"; // 测试接口域名
const pubPath = "https://evaluation.lanqiao.cn"; // 线上接口域名

const url = `${pubPath}/api/v1/evaluation/exams/${exam_id}/results/`;
writeLog(url);
const nowDate = new Date();
const sendScore = () => {
  let sendData = {
    user_id: data.user_id,
    pass_detail: [],
  };
  let skillPointIdList = lastdata.reduce((temp, item) => {
    temp.push(item.skill_point_id);
    return temp;
  }, []);
  skillPointIdList = Array.from(new Set(skillPointIdList));
  skillPointIdList;
  let status1804 = false;
  let codeStatusList = [];
  skillPointIdList.forEach((item) => {
    ///  item   和 技能 id 一一对应，把 id 相同的放在一个数组里面
    let oneSkillInfo = lastdata.filter((info) => info.skill_point_id == item);
    // 定义最终返回的格式
    let skillPassDetail = {
      skill_point_id: oneSkillInfo[0].skill_point_id,
      user_score: 0,
      skill_score: 0,
      push_at: parseInt(nowDate.getTime() / 1000),
      passed: false,
    };
    let passedScore = oneSkillInfo[0].passed_score;
    //  登录注册跳转最多 5分  登录注册表单验证最多5分  登录注册接口最多5分
    oneSkillInfo.forEach((skill) => {
      if (skill.passed) {
        skillPassDetail.user_score += skill.user_score;
      }
      skillPassDetail.skill_score += skill.skill_score;
    });

    if (skillPassDetail.user_score >= passedScore) {
      skillPassDetail.passed = true;
    }
    // 特殊处理，如果涉及到编码的技能点有一个被点亮，则代码质量技能点将被点亮。
    if (
      skillPassDetail.skill_point_id == 1804 ||
      skillPassDetail.skill_point_id == 1798 ||
      skillPassDetail.skill_point_id == 1808 ||
      skillPassDetail.skill_point_id == 1837 ||
      skillPassDetail.skill_point_id == 1813
    ) {
      codeStatusList.push(skillPassDetail.passed);
    }
    // 特殊处理，两个跳转功能最多只能得 5 分
    if (skillPassDetail.skill_point_id == 1804) {
      skillPassDetail.skill_score -= 5;
      status1804 = skillPassDetail.passed;
    }
    sendData.pass_detail.push(skillPassDetail);
  });
  // 特殊处理，如果 1804 未通过，则 1815 最终无分未通过
  if (!status1804) {
    sendData.pass_detail.forEach((item) => {
      if (item.skill_point_id == 1815) {
        item.passed = false;
        item.user_score = 0;
      }
    });
  } else {
    // 判断是否使用框架，如果使用框架则给框架分
    if (isHash) {
      sendData.pass_detail.forEach((item) => {
        if (item.skill_point_id == 1815) {
          item.passed = true;
          item.user_score = 10;
        }
      });
      scoreObj.passed = true;
      scoreObj.user_score = 10;
      writeScore(scoreObj);
    }
  }
  // 特殊处理，如果涉及到编码的技能点有一个被点亮，则代码质量技能点将被点亮。
  if (codeStatusList.some((item) => item == true)) {
    sendData.pass_detail.forEach((item) => {
      if (item.skill_point_id == 1864) {
        item.passed = true;
        item.user_score = item.skill_score;
      }
    });
    scoreObj2.passed = true;
    scoreObj2.user_score = 5;
    writeScore(scoreObj2);
  }

  console.log(sendData);
  writeLog(JSON.stringify(sendData));
  // 发送请求
  request(
    {
      url: url,
      method: "POST",
      json: true,
      headers: {
        "content-type": "application/json",
      },
      body: sendData,
    },
    function (error, response, body) {
      writeLog(response.statusCode + "------" + error);
      if (!error && response.statusCode == 200) {
        writeLog(JSON.stringify(body)); // 请求成功的处理逻辑
      }
      // 答案备份
      writeLog("18. 答案备份。");
      const execStr = `bash upload-files.sh`; // 如果使用框架开发
      let res = shell.exec(execStr);
      writeLog(res.code);
      // 答案备份
      writeLog("19. 机器人发消息到群。");
      res = shell.exec(`/usr/sbin/nodejs/bin/node sendMsgUseAI.js`);
      writeLog(res.code);
    }
  );
};

sendScore();
