
/**
 * 传入座位索引（0-62）则返回当前座位序号，数字为 9 个一组（0-9，10-18...，54-62），
 * 返回组别号以及当前数字所在位置，
 * 如:
 * 传入 0，因为 0 是第一组数据第一个，返回 1-1，
 * 传入 10，10 是第二组数组第一个，返回 2-1，
 * 传入 11 则返回 2-2，以此类推
 * @param {*} index  传入的座位索引
 */
const getSeatPosition = (index) => {
    let seatPos = index+1
    let first = Math.ceil(seatPos/9);
    let second = seatPos -((first-1)*9)
   
   return `${first}-${second}`
};


module.exports = getSeatPosition;


