Object.defineProperty(exports, "__esModule", {
  value: !0,
});
exports.completionsFromGhostTextResults = void 0;
const r = require(42600);
const locationfactory = require("./location-factory");
const getghosttext = require("./get-ghost-text");
const normalizeindent = require("./normalize-indent");
exports.completionsFromGhostTextResults = function (
  ctx,
  texts,
  resultType,
  document,
  position,
  textEditorOptions,
  u
) {
  const LocationFactory = ctx.get(locationfactory.LocationFactory);
  const line = document.lineAt(position);
  let h = texts.map((text) => {
    let range;
    let newText = "";
    if (textEditorOptions) {
      // 处理tab问题
      text.completion = normalizeindent.normalizeIndentCharacter(
        textEditorOptions,
        text.completion,
        line.isEmptyOrWhitespace
      );
    }
    if (text.completion.displayNeedsWsOffset && line.isEmptyOrWhitespace)
      (range = LocationFactory.range(
        LocationFactory.position(position.line, 0),
        position
      )),
        (newText = text.completion.completionText);
    else if (
      line.isEmptyOrWhitespace &&
      text.completion.completionText.startsWith(line.text)
    )
      (range = LocationFactory.range(
        LocationFactory.position(position.line, 0),
        position
      ))
        (newText = text.completion.completionText);
    else {
      const wordRange = document.getWordRangeAtPosition(position);
      // 如果是中间的话
      if (text.isMiddleOfTheLine) {
        const line = document.lineAt(position);
        const lineRange = LocationFactory.range(
          LocationFactory.position(position.line, 0),
          position
        );
        const lineText = document.getText(lineRange);
        range = text.coversSuffix ? line.range : lineRange;
        newText = lineText + text.completion.displayText;
      }
      // 如果当前光标刚好在单词上
      else if (wordRange) {
        const word = document.getText(wordRange);
        range = LocationFactory.range(wordRange.start, position);
        newText = word + text.completion.completionText;
      } 
      // 正常就是在行尾补全
      else {
        range = LocationFactory.range(
          LocationFactory.position(position.line, 0),
          position
        );
        newText = document.getText(range) + text.completion.displayText;
      }
    }
    return {
      uuid: r.v4(),
      text: newText,
      range: range,
      file: document.uri,
      index: text.completion.completionIndex,
      telemetry: text.telemetry,
      displayText: text.completion.displayText,
      position: position,
      offset: document.offsetAt(position),
      resultType: resultType,
    };
  });
  if (
    resultType === getghosttext.ResultType.TypingAsSuggested &&
    void 0 !== u
  ) {
    const e = h.find((e) => e.index === u);
    if (e) {
      const t = h.filter((e) => e.index !== u);
      h = [e, ...t];
    }
  }
  return h;
};
