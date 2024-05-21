const arrayToString = (array) => {
  const stringList = array.map(e => e.join(','));
  return stringList.join('\n');
}

module.exports = arrayToString;