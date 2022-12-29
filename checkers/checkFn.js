// 检测独立封装常用工具方法
console.log("检测独立封装常用工具方法");
let getSeatPosition;
try{
   getSeatPosition = require("./common.js");
}catch(e){
  console.log('引入时发生了错误')
}

const nowDate = new Date();
const scoreObj = {
  skill_point_id: 1813,
  title: "独立封装常用工具方法",
  checker: "独立封装常用工具方法",
  user_score: 0,
  skill_score: 5,
  passed_score: 5,
  push_at: parseInt(nowDate.getTime() / 1000),
  passed: false,
};

const getSeatPositionRight = (index) => {
  let seatPos = index + 1;
  let first = Math.ceil(seatPos / 9);
  let second = seatPos - (first - 1) * 9;
  return `${first}-${second}`;
};
try {
  if (typeof getSeatPosition != "function") {
    console.log(`找不到封装函数，得分 0`);
  } else {
    let res = []
    for (let index = 0; index < 63; index++) {
      let isSame = getSeatPositionRight(index) == getSeatPosition(index) 
        res.push(isSame) 
    }
    let isFnRight = res.every(item=>item===true)
    if (isFnRight) {
      console.log("检测通过");
    }
  }
} catch (err) {
  console.log('发生了错误--------------------------------')
  process.exit(1); // 结束进程，检测失败
}
