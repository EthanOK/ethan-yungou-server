const equalityStringIgnoreCase = (string1, string2) => {
  if (string1.toLowerCase() === string2.toLowerCase()) {
    return true;
  } else {
    return false;
  }
};
module.exports = { equalityStringIgnoreCase };
