/* eslint-disable strict */
const writer = require("./utils/writer");
const randomInt = require("./utils/randomInt");

const row = 5;
const column = 5;
const upscaleRow = 500;
const upscaleColumn = 500;

const DIRECTIONS = {
  up: [0, -1],
  down: [0, 1],
  left: [-1, 0],
  right: [1, 0],
};


const findOpenSpace = (currentRowIndex, currentColumnIndex, heightMap) => {
  const directionOptions = [];
  if (
    currentRowIndex - 1 > 0 &&
    !heightMap[currentRowIndex - 1][currentColumnIndex]
  ) {
    directionOptions.push(DIRECTIONS.up);
  }

  if (
    currentRowIndex + 1 < row &&
    !heightMap[currentRowIndex + 1][currentColumnIndex]
  ) {
    directionOptions.push(DIRECTIONS.down);
  }

  if (
    currentColumnIndex - 1 > 0 &&
    !heightMap[currentRowIndex][currentColumnIndex - 1]
  ) {
    directionOptions.push(DIRECTIONS.left);
  }

  if (
    currentColumnIndex + 1 < column &&
    !heightMap[currentRowIndex][currentColumnIndex + 1]
  ) {
    directionOptions.push(DIRECTIONS.right);
  }

  return directionOptions;
};

const selectOpenSpace = (directionOptions) => {
  const index = randomInt(0, directionOptions.length - 1);
  return directionOptions[index];
};

const wrapWorkArea = (workAreaIndex, workAreaRef, heightMap) => {
  let [workAreaRow, workAreaColumn] = [...workAreaIndex];

  if (workAreaColumn + 1 < column) {
    workAreaColumn++;
    workAreaIndex[1]++;
  }

  if (workAreaRow + 1 < row) {
    workAreaRow++;
    workAreaIndex[0]++;
  }

  while (workAreaColumn >= 0) {
    let rowCounter = workAreaRow;
    while (rowCounter >= 0) {
      if (!heightMap[rowCounter][workAreaColumn]) {
        heightMap[rowCounter][workAreaColumn] = workAreaRef;
      }
      rowCounter--;
    }
    workAreaColumn--;
  }
};

const generateHeightMap = () => {
  const heightMap = Array.from({ length: row }, () =>
    Array.from({ length: column })
  );

  const workAreaIndex = [0, 0];
  let cutCounter = 0;
  let fillCounter = 0;
  const workAreaSize = randomInt(2, 4);
  let isCut = true;
  const initialWorkArea = `c${cutCounter}`;
  heightMap[0][0] = initialWorkArea;

  // Generate the initial work area
  for (let j = 0; j < workAreaSize; j++) {
    const [workAreaRow, workAreaColumn] = workAreaIndex;
    const directionOptions = findOpenSpace(
      workAreaRow,
      workAreaColumn,
      heightMap
    );
    const direction = selectOpenSpace(directionOptions);
    workAreaIndex[0] += direction[0];
    workAreaIndex[1] += direction[1];
    heightMap[workAreaIndex[0]][workAreaIndex[1]] = initialWorkArea;
  }
  cutCounter++;

  // Wrap work area around other work area
  while (workAreaIndex[0] + 1 < row || workAreaIndex[1] + 1 < column) {
    let workAreaRef;
    if (isCut) {
      workAreaRef = `f${fillCounter}`;
      fillCounter++;
    } else {
      workAreaRef = `c${cutCounter}`;
      cutCounter++;
    }

    isCut = !isCut;
    wrapWorkArea(workAreaIndex, workAreaRef, heightMap);
  }

  return heightMap;
};

const generateTargetAndMap = (initialSurvey, heightMap) => {
  const rowScale = upscaleRow / row;
  const columnScale = upscaleColumn / column;
  const workAreaMap = {};
  const targetHeight = [];

  for(let r = 0; r < upscaleRow; r++){
    let columnMap = [];
    for(let c = 0; c < upscaleColumn; c++){
      const rowByHeightMap = Math.floor(r / rowScale);
      const columnByHeightMap = Math.floor(c / columnScale);
      const workArea = heightMap[rowByHeightMap][columnByHeightMap];
      const isCut = workArea.includes("c");
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

const generateUpscaleData = (heightMap) => {
  const initialSurvey = [];
  for(let r = 0; r < upscaleRow; r++){
    let columnMap = [];
    for(let c = 0; c < upscaleColumn; c++){
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

const arrayToString = (array) => {
  const stringList = []; 
  array.forEach(e => stringList.push(e.join(',')));
  return stringList.join('\n');
  
}

const main = async () => {
  const heightMap = generateHeightMap();
  const { targetHeight, initialSurvey, workAreaMap } =
    generateUpscaleData(heightMap);

  await writer('heightMap.txt', arrayToString(heightMap));
   writer('targetHeight.txt', arrayToString(targetHeight)).then(async() => {
    await writer('initialSurvey.txt', arrayToString(initialSurvey));
  });

  await writer('workAreaMap.json', JSON.stringify(workAreaMap));
};

main();