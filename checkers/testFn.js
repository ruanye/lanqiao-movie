const shell = require("shelljs");
const { writeScore,writeLog } = require("../utils/writeScore");
const nowDate = new Date();

const toCheck = () => {
  // 1. 检测项目是否能正常访问
  writeLog("1. 检测项目是否能正常访问。");
  let res = shell.exec("curl 0.0.0.0:8080");
  console.log('1.检测项目是否能正常访问',res.code);
  if (res.code !== 0) {
    // shell 未运行成功
    console.error("项目不能通过 8080 端口访问");
  } else {
    writeScore({
      skill_point_id: 1842,
      title: "前端开发工具",
      checker: "开发规范",
      user_score: 5,
      skill_score: 5,
      passed_score: 5,
      push_at: parseInt(nowDate.getTime() / 1000),
      passed: true,
    });
    writeLog("检测项目是否能正常访问成功！");
  }

  // 2. 检测首页功能1数据的请求与渲染
   
  let res2 = shell.exec(
    "/usr/sbin/nodejs/bin/node check01.js"
  );
  writeLog('检测首页功能1数据的请求与渲染',res2.code);
  if (res2.code !== 0) {
    writeScore({
      skill_point_id: 1808,
      title: "AJAX操作",
      checker: "首页“正在热映”数据读取加载",
      user_score: 0,
      skill_score: 10,
      passed_score: 5,
      push_at: parseInt(nowDate.getTime() / 1000),
      passed: false,
    });
    writeLog("testFn中check01.js 检测首页功能 1 数据的请求与渲染脚本执行失败");
  }
  

  // 12. 检测版本控制
  res = shell.exec(
    "cat /home/project/.git/logs/HEAD | grep 0000000000000000000000000000000000000000 | grep commit | grep initial | grep :"
  );
  console.log(12, res.code);
  if (res.code !== 0) {
    console.error("检测版本控制失败");
    writeScore({
      skill_point_id: 1847,
      title: "使用 Git 管理代码版本",
      checker: "版本控制功能",
      user_score: 0,
      skill_score: 5,
      passed_score: 5,
      push_at: parseInt(nowDate.getTime() / 1000),
      passed: false,
    });
    writeLog("检测版本控制失败");
  } else {
    writeScore({
      skill_point_id: 1847,
      title: "使用 Git 管理代码版本",
      checker: "版本控制功能",
      user_score: 5,
      skill_score: 5,
      passed_score: 5,
      push_at: parseInt(nowDate.getTime() / 1000),
      passed: true,
    });
    writeLog("检测版本控制成功");
  }

  // 14. 检测是否使用第三方库
  res = shell.exec(`/usr/sbin/nodejs/bin/node checkLibrary.js`);
  console.log(14, res.code);
  if (res.code !== 0) {
    writeLog("检测是否使用第三方库失败");
    writeScore({
      skill_point_id: 1826,
      title: "使用第三方库",
      checker: "使用第三方库",
      user_score: 0,
      skill_score: 5,
      passed_score: 5,
      push_at: parseInt(nowDate.getTime() / 1000),
      passed: false,
    });
    writeLog("检测是否使用第三方库失败");
  }

  // 15. 检测独立封装常用工具方法
  let execStr = "rm -rf common.js && cp /home/project/src/utils/common.js /tmp"; // 如果使用框架开发
  res = shell.exec(execStr);
  writeLog(res.code);
  if (res.code !== 0) {
    // 如果使用原生开发
    execStr = "rm -rf common.js && cp /home/project/js/common.js /tmp";
    res = shell.exec(execStr);
    writeLog(res.code);
    if (res.code !== 0) {
      writeScore({
        skill_point_id: 1813,
        title: "独立封装常用工具方法",
        checker: "独立封装常用工具方法",
        user_score: 0,
        skill_score: 5,
        passed_score: 5,
        push_at: parseInt(nowDate.getTime() / 1000),
        passed: false,
      });
      writeLog("1检测是否独立封装常用工具方法失败");
    } else {
      res = shell.exec("/usr/sbin/nodejs/bin/node checkFn.js");
      writeLog(res.code);
      if (res.code !== 0) {
        console.error("检测是否独立封装常用工具方法失败");
        writeScore({
          skill_point_id: 1813,
          title: "独立封装常用工具方法",
          checker: "独立封装常用工具方法",
          user_score: 0,
          skill_score: 5,
          passed_score: 5,
          push_at: parseInt(nowDate.getTime() / 1000),
          passed: false,
        });
        writeLog("2检测是否独立封装常用工具方法失败");
      }
    }
  } else {
    res = shell.exec("/usr/sbin/nodejs/bin/node checkFn.js");
    writeLog(res.code);
    if (res.code !== 0) {
      writeScore({
        skill_point_id: 1813,
        title: "独立封装常用工具方法",
        checker: "独立封装常用工具方法",
        user_score: 0,
        skill_score: 5,
        passed_score: 5,
        push_at: parseInt(nowDate.getTime() / 1000),
        passed: false,
      });
      writeLog("3检测是否独立封装常用工具方法失败");
    }
  }

  // 16. 检测前端单元测试
  const checkF = () => {
    writeLog("开始检测前端单元测试");
    res = shell.exec(
      "rm -rf common.js && wget -O common.js https://labfile.oss.aliyuncs.com/courses/9881/common-fail.js && /usr/sbin/nodejs/bin/node test.js"
    );
    writeLog(res.toString().indexOf("false") != -1);
    if (res.code == 0 && res.toString().indexOf("false") != -1) {
      res = shell.exec(
        "rm -rf common.js && wget -O common.js https://labfile.oss.aliyuncs.com/courses/9881/common-success.js && /usr/sbin/nodejs/bin/node test.js"
      );
      writeLog(res.toString().indexOf("true") != -1);
      if (res.code == 0 && res.toString().indexOf("true") != -1) {
        writeScore({
          skill_point_id: 1837,
          title: "前端单元测试",
          checker: "前端单元测试",
          user_score: 5,
          skill_score: 5,
          passed_score: 5,
          push_at: parseInt(nowDate.getTime() / 1000),
          passed: true,
        });
        writeLog("检测前端单元测试成功");
      } else {
        writeScore({
          skill_point_id: 1837,
          title: "前端单元测试",
          checker: "前端单元测试",
          user_score: 0,
          skill_score: 5,
          passed_score: 5,
          push_at: parseInt(nowDate.getTime() / 1000),
          passed: false,
        });
        writeLog("检测前端单元测试失败");
      }
    } else {
      writeScore({
        skill_point_id: 1837,
        title: "前端单元测试",
        checker: "前端单元测试",
        user_score: 0,
        skill_score: 5,
        passed_score: 5,
        push_at: parseInt(nowDate.getTime() / 1000),
        passed: false,
      });
      writeLog("检测前端单元测试失败");
    }
  };
  writeLog("16. 检测前端单元测试。");
  execStr = "rm -rf test.js  && cp /home/project/src/utils/test.js /tmp"; // 如果使用框架开发
  res = shell.exec(execStr);
  console.log(161, res.code);
  if (res.code !== 0) {
    // 如果使用原生开发
    execStr = "rm -rf test.js  && cp /home/project/js/test.js /tmp";
    res = shell.exec(execStr);
    console.log(162, res.code);
    if (res.code !== 0) {
      console.error("检测前端单元测试失败");
      writeScore({
        skill_point_id: 1837,
        title: "前端单元测试",
        checker: "前端单元测试",
        user_score: 0,
        skill_score: 5,
        passed_score: 5,
        push_at: parseInt(nowDate.getTime() / 1000),
        passed: false,
      });
      writeLog("复制文件失败");
    } else {
      checkF();
    }
  } else {
    checkF();
  }
  // 13. 检测项目打包功能
  res = shell.exec(`/usr/sbin/nodejs/bin/node checkBuild.js`);
  console.log(13, res.code);
  if (res.code !== 0) {
    console.error("检测项目打包功能失败");
    writeScore({
      skill_point_id: 1840,
      title: "前端构建工具 webpack",
      checker: "项目打包功能",
      user_score: 0,
      skill_score: 5,
      passed_score: 5,
      push_at: parseInt(nowDate.getTime() / 1000),
      passed: false,
    });
    writeScore({
      skill_point_id: 1844,
      title: "npm 的使用",
      checker: "项目打包功能",
      user_score: 0,
      skill_score: 5,
      passed_score: 5,
      push_at: parseInt(nowDate.getTime() / 1000),
      passed: false,
    });
    writeLog("检测项目打包功能失败");
  }

  // 上传成绩+答案备份
  writeLog("17. 上传成绩。");
  execStr = `/usr/sbin/nodejs/bin/node sendScore.js`; // 如果使用框架开发
  res = shell.exec(execStr);
  writeLog(res.code);
};
module.exports = { toCheck };
