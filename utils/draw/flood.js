const flood = (workAreaIndex, workAreaRef, heightMap) => {
  const row = heightMap.length;
  const column = heightMap[0].length;
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

module.exports = flood;