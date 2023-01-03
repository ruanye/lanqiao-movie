let fs = require("fs");
const shell = require("shelljs");
let path = require("path");
let request = require("request");
let { toCheck } = require("./testFn.js");
const { writeLog } = require("../utils/writeScore");
const nowDate = new Date();

const devPathUser = "https://staging.shiyanlou.com"; // 测试接口域名
const pubPathUser = "https://www.lanqiao.cn"; // 线上接口域名

const box_id = shell.exec("hostname");
const url = `${pubPathUser}/api/v2/exam/user-data/?box_id=${box_id}`;
writeLog(url);
// 从文件 result.json 中读取当前判题结果
let data = fs.readFileSync(
  path.join(fs.realpathSync(process.cwd()), "./result.json"),
  "utf-8"
);
data = JSON.parse(data);

if (!data.user_id || !data.exam_id) {
  // 发送请求获取 user_id 和 exam_id
  request(
    {
      url: url,
      method: "GET",
    },
    function (error, response, body) {
      writeLog(response.statusCode + "-------" + error);
      if (!error && response.statusCode == 200) {
        let resData = JSON.parse(body);
        writeLog(resData);
        data.user_id = resData.user_id;
        data.exam_id = resData.exam_id;
        // 将当前文件夹的判断脚本写入 json 文件
        fs.writeFileSync(
          path.join(fs.realpathSync(process.cwd()), "./result.json"),
          JSON.stringify(data),
          "utf8",
          (err) => {
            if (err) writeLog("脚本运行错误，请重新运行");
            process.exit(1); // 结束进程，检测失败
          }
        );
      }
      // 检测
      toCheck();
    }
  );
} else {
  // 直接检测
  toCheck();
}
