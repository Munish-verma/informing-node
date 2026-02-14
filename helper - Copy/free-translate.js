const translatte = require('translatte');


async function translateData(data, targetLang) {
  if (!data) return data;

    if (targetLang === "en") {
    if (Array.isArray(data)) {
      return data.map(item => {
        if (typeof item === "object") {
          return { ...item, display: { ...item } };
        }
        return item;
      });
    }

    if (typeof data === "object") {
      return { ...data, display: { ...data } };
    }

    return data;
  }

  if (Array.isArray(data)) {
    return Promise.all(data.map(item => translateData(item, targetLang)));
  }

  if (typeof data === "object") {
    let display = {};
    for (let key of Object.keys(data)) {
      let value = data[key];
      if (typeof value === "string") {
        try {
          let result = await translatte(value, { to: targetLang });
          display[key] = result.text;
        } catch (e) {
          display[key] = value;
        }
      } else {
        display[key] = value;
      }
    }
    return { ...data, display };
  }

  return data; // If primitive
}
module.exports.translateData = translateData
