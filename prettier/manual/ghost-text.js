const vscode = require("vscode");
const config = require("./config");
const completionsfromghost = require("./completions-from-ghost");
const getghosttext = require("./get-ghost-text");
const telemetryutils = require("./telemetry-utils");
const logger = require("./logger");
const tasks = require("./tasks");
const telemetry = require("./telemetry");
const main = require("./main");
const ignoredocument = require("./ignore-document");

function getInsertionTextFromCompletion(e) {
  return e.insertText;
}

let m;
let g;

exports.getInsertionTextFromCompletion = getInsertionTextFromCompletion;
exports.ghostTextLogger = new logger.Logger(logger.LogLevel.INFO, "ghostText");

let y;
let _;
let v = [];


async function provideInlineCompletions(
  ctx,
  document,
  position,
  context,
  token
) {
  const b = await (async function (ctx, document, position, context, token) {
    // 代码提示入口逻辑
    if (config.getConfig(ctx, config.ConfigKey.InlineSuggestEnable))
      return {
        type: "abortedBeforeIssued",
        reason: "ghost text is disabled",
      };

    if (ignoredocument.ignoreDocument(ctx, document))
      return {
        type: "abortedBeforeIssued",
        reason: "document is ignored",
      };

    if (token.isCancellationRequested)
      return (
        exports.ghostTextLogger.info(ctx, "Cancelled before extractPrompt"),
        {
          type: "abortedBeforeIssued",
          reason: "cancelled before extractPrompt",
        }
      );

    // 这里拿到整个代码提示的结果
    const ghostText = await getghosttext.getGhostText(
      ctx,
      document,
      position,
      context.triggerKind === vscode.InlineCompletionTriggerKind.Invoke,
      f,  // 一个不重要的上报
      token
    );

    const [texts, resultType] = ghostText.value;
    
    if (token.isCancellationRequested)
      return (
        exports.ghostTextLogger.info(ctx, "Cancelled after getGhostText"),
        {
          type: "canceled",
          reason: "after getGhostText",
          telemetryData: {
            telemetryBlob: b.telemetryBlob,
          },
        }
      );

    const completions = completionsfromghost.completionsFromGhostTextResults(
      ctx,
      texts,
      resultType,
      document,
      position,
      vscode.window.visibleTextEditors.find(
        (t) => t.document === document
      )?.options,
      y
    );
    const newCompletions = completions.map((completion) => {
      const { text, range: i } = completion;
      const range = new vscode.Range(
        new vscode.Position(i.start.line, i.start.character),
        new vscode.Position(i.end.line, i.end.character)
      );
      const s = new vscode.InlineCompletionItem(text, range);
      s.index = completion.index;
      s.telemetry = completion.telemetry;
      s.displayText = completion.displayText;
      s.resultType = completion.resultType;
      s.id = completion.uuid;
      s.uri = document.uri;
      s.insertOffset = document.offsetAt(
        new vscode.Position(completion.position.line, completion.position.character)
      );
      s.command = {
        title: "PostInsertTask",
        command: h,
        arguments: [s],
      };
      return s;
    });
    return 0 === newCompletions.length
      ? {
          type: "empty",
          reason: "no completions in final result",
          telemetryData: b.telemetryData,
        }
      : {
          ...ghostText,
          value: newCompletions,
        };
  })(ctx, document, position, context, token);
  return await telemetryutils.handleGhostTextResultTelemetry(ctx, b);
}

exports.provideInlineCompletions = provideInlineCompletions;

class InlineCompletionItemProvider {
  constructor(context) {
    this.ctx = context;
  }

  async provideInlineCompletionItems(document, position, context, token) {
    if (
      context.triggerKind === vscode.InlineCompletionTriggerKind.Automatic &&
      !config.getConfig(this.ctx, config.ConfigKey.EnableAutoCompletions)
    )
      return;
    const items = await provideInlineCompletions(
      this.ctx,
      document,
      position,
      context,
      token
    );
    return items
      ? {
          items: items,
          suppressSuggestions: true,
        }
      : void 0;
  }
  handleDidShowCompletionItem(e) {
    handleGhostTextShown(this.ctx, e);
  }
  handleDidPartiallyAcceptCompletionItem(e, t) {
    handlePartialGhostTextPostInsert(this.ctx, e, t);
  }
}
async function handlePartialGhostTextPostInsert(e, n, r) {
  if (r === getInsertionTextFromCompletion(n).length) {
    resetStateForLastCompletion();
  }
  exports.ghostTextLogger.debug(e, "Ghost text partial post insert");
  if (
    n.telemetry &&
    n.uri &&
    n.displayText &&
    n.insertOffset &&
    n.range &&
    n.id
  ) {
    const t = (function (e, t) {
      if (!e.range || !e.range.start || !e.range.end) return;
      const n = getInsertionTextFromCompletion(e);
      return e.displayText !== n && n.trim() === e.displayText
        ? t
        : t - e.range.end.character + e.range.start.character;
    })(n, r);
    if (t) {
      const i = n.telemetry.extendedBy(
        {
          compType: "partial",
        },
        {
          compCharLen: t,
        }
      );
      _ = r;
      const o = n.displayText.substring(0, t);
      await (0, tasks.postInsertionTasks)(
        e,
        "ghostText",
        o,
        n.insertOffset,
        n.uri,
        i,
        n.id,
        n.range.start
      );
    }
  }
}
function resetStateForLastCompletion() {
  v = [];
  g = void 0;
  m = void 0;
}
function resetPartialAcceptanceState() {
  _ = void 0;
}
function handleGhostTextShown(e, n) {
  y = n.index;
  if (
    !v.find((e) => e.index === n.index) &&
    (v.push(n), n.telemetry && n.displayText)
  ) {
    const r = !(n.resultType === getghosttext.ResultType.Network);
    exports.ghostTextLogger.debug(
      e,
      `[${n.telemetry.properties.headerRequestId}] shown choiceIndex: ${n.telemetry.properties.choiceIndex}, fromCache ${r}`
    ),
      (n.telemetry.measurements.compCharLen = n.displayText.length),
      (0, telemetryutils.telemetryShown)(e, "ghostText", n.telemetry, r);
  }
}
async function handleGhostTextPostInsert(e, n) {
  resetStateForLastCompletion();
  exports.ghostTextLogger.debug(e, "Ghost text post insert");
  if (
    n.telemetry &&
    n.uri &&
    n.displayText &&
    void 0 !== n.insertOffset &&
    n.range &&
    n.id
  ) {
    const t = n.telemetry.extendedBy(
      {
        compType: _ ? "partial" : "full",
      },
      {
        compCharLen: n.displayText.length,
      }
    );
    resetPartialAcceptanceState(),
      await (0, tasks.postInsertionTasks)(
        e,
        "ghostText",
        n.displayText,
        n.insertOffset,
        n.uri,
        t,
        n.id,
        n.range.start
      );
  }
}
exports.handlePartialGhostTextPostInsert = handlePartialGhostTextPostInsert;
exports.resetStateForLastCompletion = resetStateForLastCompletion;
exports.resetPartialAcceptanceState = resetPartialAcceptanceState;
exports.handleGhostTextShown = handleGhostTextShown;
exports.handleGhostTextPostInsert = handleGhostTextPostInsert;
exports.registerGhostText = function (context) {
  context.get(main.VsCodeExtensionContext).subscriptions.push(
    vscode.languages.registerInlineCompletionItemProvider(
      {
        pattern: "**",
      },
      new InlineCompletionItemProvider(context)
    ),
    vscode.commands.registerCommand("_ghostTextPostInsert", async (t) =>
      handleGhostTextPostInsert(context, t)
    )
  );
};
