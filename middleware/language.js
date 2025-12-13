const supportedLanguages = ['en', 'ar'];

module.exports = function (req, res, next) {
  let language = req.headers['language'] || req.headers['x-language'] || 'en';

  language = language.toLowerCase();
  if (!supportedLanguages.includes(language)) {
    language = 'en';
  }
  
  req.language = language;
  next();
};