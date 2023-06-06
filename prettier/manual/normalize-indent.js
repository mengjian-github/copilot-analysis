exports.normalizeIndentCharacter = function (textEditorOptions, completion, isEmptyOrWhitespace) {
  
  function r(text, patten, n) {
    const reg = new RegExp(`^(${patten})+`, "g");
    return text
      .split("\n")
      .map((line) => {
        const newLine = line.replace(reg, "");
        const i = line.length - patten.length;
        return n(i) + newLine;
      })
      .join("\n");
  }

  let tabSize;
  tabSize = void 0 === textEditorOptions.tabSize || "string" == typeof textEditorOptions.tabSize ? 4 : textEditorOptions.tabSize;
  
  if (false === textEditorOptions.insertSpaces) {
    const e = (text) =>
      r(text, " ", (e) => "\t".repeat(Math.floor(e / tabSize)) + " ".repeat(e % tabSize));
    completion.displayText = e(completion.displayText);
    completion.completionText = e(completion.completionText);
  } else if (true === textEditorOptions.insertSpaces) {
    const e = (e) => r(e, "\t", (e) => " ".repeat(e * tabSize));
    if (
      ((completion.displayText = e(completion.displayText)),
      (completion.completionText = e(completion.completionText)),
      isEmptyOrWhitespace)
    ) {
      const e = (e) => {
        const t = e.length - e.trimLeft().length,
          n = t % tabSize;
        return 0 !== n && t > 0
          ? r(e, " ".repeat(n), (e) => " ".repeat((Math.floor(e / tabSize) + 1) * tabSize))
          : e;
      };
      (completion.displayText = e(completion.displayText)),
        (completion.completionText = e(completion.completionText));
    }
  }
  return completion;
};
