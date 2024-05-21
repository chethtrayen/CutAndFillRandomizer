const { ROW, COLUMN } = require('../../config');
const randomInt = require('../randomInt');

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
    currentRowIndex + 1 < ROW &&
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
    currentColumnIndex + 1 < COLUMN &&
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

const pool = (heightMap, workAreaIndex, workAreaRef) => {
  const workAreaSize = randomInt(2, 4);

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
    heightMap[workAreaIndex[0]][workAreaIndex[1]] = workAreaRef;
  }
}

module.exports = pool;