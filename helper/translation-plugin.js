const { preTranslateFields } = require("../helper/google-translate");

function translationPlugin(schema, options = {}) {
  const fieldsToTranslate = options.fields || [];

  if (!schema.path("display")) {
    schema.add({ display: { type: Object, default: {} } });
  }

  // Pre-save middleware
  schema.pre("save", async function (next) {
    try {
      const toTranslate = {};
      fieldsToTranslate.forEach(f => {
        if (this[f]) toTranslate[f] = this[f];   // ✅ directly use `this`
      });

      if (Object.keys(toTranslate).length > 0) {
        const { display } = await preTranslateFields(toTranslate);
        this.display = display;
      }

      next();
    } catch (err) {
      next(err);
    }
  });

  // Pre-update middleware
  schema.pre("findOneAndUpdate", async function (next) {
    try {
      const update = this.getUpdate();

      const toTranslate = {};
      fieldsToTranslate.forEach(f => {
        if (update[f]) toTranslate[f] = update[f];   // ✅ no recursion here
      });

      if (Object.keys(toTranslate).length > 0) {
        const { display } = await preTranslateFields(toTranslate);
        update.display = display;
        this.setUpdate(update);
      }

      next();
    } catch (err) {
      next(err);
    }
  });
}

module.exports = translationPlugin;
