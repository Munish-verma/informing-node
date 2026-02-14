const { Translate } = require("@google-cloud/translate").v2;
const config = require("config");
const mongoose = require("mongoose");

const translate = new Translate({
  key: config.get("googleApiKey"),
});

const SUPPORTED_LANGS = ["en", "ar"];

function isObjectId(value) {
  return (
    value instanceof mongoose.Types.ObjectId ||
    (value && value._bsontype === "ObjectID")
  );
}

async function deepTranslate(value, targetLang, seen = new WeakSet()) {
  if (value == null) return value;

  if (isObjectId(value)) return value.toString();
  if (value instanceof Date) return value;

  if (typeof value === "string") {
    try {
      let [translated] = await translate.translate(value, targetLang);
      return translated;
    } catch (e) {
      console.error("Translation error:", e.message);
      return value;
    }
  }

  if (typeof value === "number" || typeof value === "boolean") return value;

  if (Array.isArray(value)) {
    return Promise.all(value.map(item => deepTranslate(item, targetLang, seen)));
  }

  if (typeof value === "object") {
    if (seen.has(value)) return value; // ✅ prevent circular recursion
    seen.add(value);

    const result = {};
    for (const key of Object.keys(value)) {
      if (key === "_id" || key === "__v") {
        result[key] = value[key];
      } else {
        result[key] = await deepTranslate(value[key], targetLang, seen);
      }
    }
    return result;
  }

  return value;
}


/**
 * Original function improved with recursion
 */
async function translateData(data, targetLang) {
  if (!data) return data;

  if (targetLang === "en") {
    if (Array.isArray(data)) {
      return data.map(item => {
        if (typeof item === "object") {
          const plain = item.toObject ? item.toObject() : item;
          return { ...plain, display: { ...plain } };
        }
        return item;
      });
    }

    if (typeof data === "object") {
      const plain = data.toObject ? data.toObject() : data;
      return { ...plain, display: { ...plain } };
    }

    return data;
  }

  if (Array.isArray(data)) {
    return Promise.all(data.map(item => translateData(item, targetLang)));
  }

  if (typeof data === "object") {
    const plain = data.toObject ? data.toObject() : data;
    const display = await deepTranslate(plain, targetLang);
    return { ...plain, display };
  }

  return data;
}

/**
 * Pre-translate entire document into all supported languages
 */
async function preTranslateFields(fields) {
  const display = {};

  for (const lang of SUPPORTED_LANGS) {
    if (lang === "en") {
      // ✅ plain copy only
      display[lang] = { ...fields };
    } else {
      // ✅ deep translate only the original fields
      display[lang] = await deepTranslate(fields, lang);
    }
  }

  return { display };
}

module.exports = { preTranslateFields, translateData };
