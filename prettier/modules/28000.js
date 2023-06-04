Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.knownFileExtensions = exports.templateLanguageLimitations = exports.knownTemplateLanguageExtensions = void 0;
const r = require(49674);
exports.knownTemplateLanguageExtensions = [".ejs", ".erb", ".haml", ".hbs", ".j2", ".jinja", ".jinja2", ".liquid", ".mustache", ".njk", ".php", ".pug", ".slim", ".webc"];
exports.templateLanguageLimitations = {
  ".php": [".blade"]
};
exports.knownFileExtensions = Object.keys(r.knownLanguages).flatMap(e => r.knownLanguages[e].extensions);