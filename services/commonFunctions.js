"use strict"

function valMsgFormatter(msg) {
  msg = msg.replace(/"/g, "");
  msg = msg.replace(/([a-z])([A-Z])/g, "$1 $2");
  msg = msg.toLowerCase();
  msg = msg.charAt(0).toUpperCase() + msg.slice(1);
  return msg;
}

function formatter(stringData, dataObject) {
  // Ensure dataObject is a valid object, if not, use an empty object
  if (!dataObject || typeof dataObject !== 'object') {
    dataObject = {};
  }

  let keyArray = Object.keys(dataObject);
  let valueArray = Object.values(dataObject);

  let newString = stringData;
  keyArray.forEach(function (element, index) {
    let text = new RegExp("\\$" + element + "\\$", "g");
    newString = newString.replace(text, valueArray[index]);
  });
  return newString;
}


module.exports = {
  valMsgFormatter,
  formatter
}




