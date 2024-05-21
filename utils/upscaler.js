const { UPSCALE_COLUMN, UPSCALE_ROW, ROW, COLUMN, CUT_REF } = require('../config');
const randomInt = require('./randomInt');

const generateTargetAndMap = (initial, heightMap) => {
  const workAreaMetadata = {};
  const target = [];
  const rowScale = UPSCALE_ROW / ROW;
  const columnScale = UPSCALE_COLUMN / COLUMN;

  for(let r = 0; r < UPSCALE_ROW; r++){
    let columnMap = [];
    
    for(let c = 0; c < UPSCALE_COLUMN; c++){
      const rowByHeightMap = Math.floor(r / rowScale);
      const columnByHeightMap = Math.floor(c / columnScale);
      const workArea = heightMap[rowByHeightMap][columnByHeightMap];
      const isCut = workArea.includes(CUT_REF);
      let height = randomInt(5, 19);

      workAreaMetadata[workArea] = workAreaMetadata[workArea]
        ? workAreaMetadata[workArea] + height
        : height;

      if (isCut) {
        height = height * -1;
      }

      const surveyHeight = initial[r][c];
      columnMap.push(surveyHeight + height);
    }
    target.push(columnMap)
  }

  return { target, workAreaMetadata };
};

const upscaler = (heightMap) => {
  const initial = [];
  for(let r = 0; r < UPSCALE_ROW; r++){
    let columnMap = [];
    for(let c = 0; c < UPSCALE_COLUMN; c++){
      columnMap.push(randomInt(20, 40));
    }
    initial.push(columnMap)
  }

  const { target, workAreaMetadata } = generateTargetAndMap(
    initial,
    heightMap
  );
  return { target, initial, workAreaMetadata };
};

module.exports = upscaler;