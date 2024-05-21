/* eslint-disable strict */
const {ROW, COLUMN, FILL_REF, CUT_REF} = require("./config");

const writer = require("./utils/writer");
const randomInt = require("./utils/randomInt");
const arrayToString = require("./utils/arrayToString");
const upscaler = require("./utils/upscaler");

const pool = require("./utils/draw/pool");
const flood = require("./utils/draw/flood");

const getRandomWorkAreaRef = () => {
  return randomInt(0, 1) ? CUT_REF : FILL_REF;
}

const generateHeightMap = () => {
  const heightMap = Array.from({ length: ROW }, () =>
    Array.from({ length: COLUMN })
  );

  const workAreaIndex = [0, 0];
  let cutCounter = 0;
  let fillCounter = 0;
  let workArea = getRandomWorkAreaRef();
  let isCut = workArea === CUT_REF;
  const initialWorkArea = `${workArea}0`;
  heightMap[0][0] = initialWorkArea;

  if (isCut) {
    cutCounter++;
  } else {
    fillCounter++;
  }

  // Generate the initial work area
  pool(heightMap, workAreaIndex, initialWorkArea);

  // Wrap work area around other work area
  while (workAreaIndex[0] + 1 < ROW || workAreaIndex[1] + 1 < COLUMN) {
   
    if (isCut) {
      workAreaRef = `${FILL_REF}${fillCounter}`;
      fillCounter++;
    } else {
      workAreaRef = `${CUT_REF}${cutCounter}`;
      cutCounter++;
    }

    isCut = !isCut;
    flood(workAreaIndex, workAreaRef, heightMap);
  }

  return heightMap;
};

const main = async () => {
  const heightMap = generateHeightMap();
  const { target, initial, workAreaMetadata } =
    upscaler(heightMap);

  await writer('CutAndFillMap.txt', arrayToString(heightMap));
   writer('target.txt', arrayToString(target)).then(async() => {
    await writer('initial.txt', arrayToString(initial));
  });

  await writer('workAreaMetadata.json', JSON.stringify(workAreaMetadata));
};

main();