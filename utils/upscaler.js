const { UPSCALE_COLUMN, UPSCALE_ROW, ROW, COLUMN, CUT_REF } = require('../config');
const randomInt = require('./randomInt');

const generateTargetAndMap = (initialSurvey, heightMap) => {
  const workAreaMap = {};
  const targetHeight = [];
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

      workAreaMap[workArea] = workAreaMap[workArea]
        ? workAreaMap[workArea] + height
        : height;

      if (isCut) {
        height = height * -1;
      }

      const surveyHeight = initialSurvey[r][c];
      columnMap.push(surveyHeight + height);
    }
    targetHeight.push(columnMap)
  }

  return { targetHeight, workAreaMap };
};

const upscaler = (heightMap) => {
  const initialSurvey = [];
  for(let r = 0; r < UPSCALE_ROW; r++){
    let columnMap = [];
    for(let c = 0; c < UPSCALE_COLUMN; c++){
      columnMap.push(randomInt(20, 40));
    }
    initialSurvey.push(columnMap)
  }

  const { targetHeight, workAreaMap } = generateTargetAndMap(
    initialSurvey,
    heightMap
  );
  return { targetHeight, initialSurvey, workAreaMap };
};

module.exports = upscaler;