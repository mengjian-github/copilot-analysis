Object.defineProperty(exports, "__esModule", {
    value: !0
  });
  exports.extractPrompt = exports.extractPromptForNotebook = exports.extractPromptForSource = exports.trimLastLine = exports._copilotNotAvailable = exports._contextTooShort = exports.MIN_PROMPT_CHARS = void 0;
  const utils = require("./utils");
  const config = require("./config");
  const o = require(54913);
  const utils2 = require("./utils2");
  const a = require(59189);
  const telemetry = require("./telemetry");
  const documentmanager = require("./document-manager");
  const u = require(31451);
  const promptlibproxy = require("./prompt-lib-proxy");
  const repo = require("./repo");
  const h = require(51470);
  const symbol = require("./symbol");
  function trimLastLine(e) {
    const t = e.split("\n");
    const n = t[t.length - 1];
    const r = n.length - n.trimRight().length;
    const i = e.slice(0, e.length - r);
    const o = e.slice(i.length);
    return [n.length == r ? i : e, o];
  }

  // ctx, document.getText(), document.offsetAt(position), relativePath, document.uri, document.languageId
  async function extractPromptForSource(ctx, source, offset, relativePath, uri, languageId) {
    if (ctx.get(o.CopilotIgnoreManager).isIgnored(uri)) return exports._copilotNotAvailable;
    const repoInfo = repo.extractRepoInfoInBackground(ctx, uri.fsPath);
    const repoNwo = repo.tryGetGitHubNWO(repoInfo) ?? "";
    const userKind = await repo.getUserKind(ctx);
    const w = {
      repoNwo: repoNwo,
      dogFood: repo.getDogFood(repoInfo),
      userKind: userKind,
      fileType: languageId
    };
    const suffixPercent = await ctx.get(a.Features).suffixPercent(w);
    const fimSuffixLengthThreshold = await ctx.get(a.Features).fimSuffixLengthThreshold(w);
    if ((suffixPercent > 0 ? source.length : offset) < exports.MIN_PROMPT_CHARS) return exports._contextTooShort;
    const x = Date.now();
    const {
      prefix: prefix,
      suffix: suffix,
      prefixLength: prefixLength,
      suffixLength: suffixLength,
      promptChoices: promptChoices,
      promptBackground: promptBackground,
      promptElementRanges: promptElementRanges,
      neighborSource: neighborSource
    } = await async function (ctx, source, offset, relativePath, uri, languageId) {
      const resourceInfo = {
        uri: uri.toString(),
        source: source,
        offset: offset,
        relativePath: relativePath,
        languageId: languageId
      };
      const repoInfo = repo.extractRepoInfoInBackground(ctx, uri.fsPath);
      const repoUserData = {
        repoNwo: repo.tryGetGitHubNWO(repoInfo) ?? "",
        userKind: await repo.getUserKind(ctx),
        dogFood: repo.getDogFood(repoInfo),
        fileType: languageId
      };
      const maxPromptLength = (await ctx.get(a.Features).maxPromptCompletionTokens(repoUserData)) - config.getConfig(ctx, config.ConfigKey.SolutionLength);
      const neighboringTabs = await ctx.get(a.Features).neighboringTabsOption(repoUserData);
      const neighboringSnippetTypes = await ctx.get(a.Features).neighboringSnippetTypes(repoUserData);
      const numberOfSnippets = await ctx.get(a.Features).numberOfSnippets(repoUserData);
      const snippetPercent = await ctx.get(a.Features).snippetPercent(repoUserData);
      const suffixStartMode = await ctx.get(a.Features).suffixStartMode(repoUserData);
      const tokenizerName = await ctx.get(a.Features).tokenizerName(repoUserData);
      const indentationMinLength = await ctx.get(a.Features).indentationMinLength(repoUserData);
      const indentationMaxLength = await ctx.get(a.Features).indentationMaxLength(repoUserData);
      const cursorContextFix = await ctx.get(a.Features).cursorContextFix(repoUserData);
      let k = {
        maxPromptLength: maxPromptLength,
        neighboringTabs: neighboringTabs,
        suffixStartMode: suffixStartMode,
        tokenizerName: tokenizerName,
        neighboringSnippetTypes: neighboringSnippetTypes,
        indentationMinLength: indentationMinLength,
        indentationMaxLength: indentationMaxLength,
        cursorSnippetsPickingStrategy: await ctx.get(a.Features).cursorSnippetsPickingStrategy(repoUserData),
        numberOfSnippets: numberOfSnippets,
        snippetPercent: snippetPercent,
        cursorContextFix: cursorContextFix
      };
      let neighborDocs = [];
      let neighborSource = new Map();
      try {
        const t = await u.NeighborSource.getNeighborFiles(ctx, uri, repoUserData);
        neighborDocs = t.docs;
        neighborSource = t.neighborSource;
      } catch (t) {
        telemetry.telemetryException(ctx, t, "prompt.getPromptForSource.exception");
      }
      let retrievalSnippets = [];
      const retrievalOptions = await h.getRetrievalOptions(ctx, repoUserData);
      if (retrievalOptions) {
        retrievalSnippets = await h.queryRetrievalSnippets(ctx, resourceInfo, retrievalOptions);
      }
      if (await ctx.get(a.Features).symbolDefinitionStrategy(repoUserData)) {
        const t = await (0, symbol.getSymbolDefSnippets)(ctx, resourceInfo);
        retrievalSnippets.push(...t);
      }
      const suffixPercent = await ctx.get(a.Features).suffixPercent(repoUserData);
      const suffixMatchThreshold = await ctx.get(a.Features).suffixMatchThreshold(repoUserData);
      const fimSuffixLengthThreshold = await ctx.get(a.Features).fimSuffixLengthThreshold(repoUserData);
      if (suffixPercent > 0) {
        k = {
          ...k,
          suffixPercent: suffixPercent,
          suffixMatchThreshold: suffixMatchThreshold,
          fimSuffixLengthThreshold: fimSuffixLengthThreshold
        };
      }
      const fileSystem = ctx.get(utils.FileSystem);
      let F;
      const lineCursorHistory = new Map();
      for (const e of utils2.cursorHistoryManager.lineCursorHistory.keys()) lineCursorHistory.set(e, utils2.cursorHistoryManager.lineCursorHistory.get(e) ?? new Map());
      try {
        F = await promptlibproxy.getPrompt(fileSystem, resourceInfo, k, neighborDocs, retrievalSnippets, lineCursorHistory);
      } catch (t) {
        throw await telemetry.telemetryException(ctx, t, "prompt.getPromptForSource.exception"), t;
      }
      return {
        neighborSource: neighborSource,
        ...F
      };
    }(ctx, source, offset, relativePath, uri, languageId);
    const [newPrefix, trailingWs] = trimLastLine(prefix);
    const now = Date.now();
    return {
      type: "prompt",
      prompt: {
        prefix: newPrefix,
        suffix: suffix,
        prefixTokens: prefixLength,
        suffixTokens: suffixLength,
        isFimEnabled: suffixPercent > 0 && suffix.length > fimSuffixLengthThreshold,
        promptElementRanges: promptElementRanges.ranges
      },
      trailingWs: trailingWs,
      promptChoices: promptChoices,
      computeTimeMs: now - x,
      promptBackground: promptBackground,
      neighborSource: neighborSource
    };
  }
  async function extractPrompt(ctx, document, position) {
    const relativePath = await ctx.get(documentmanager.TextDocumentManager).getRelativePath(document);
    return extractPromptForSource(ctx, document.getText(), document.offsetAt(position), relativePath, document.uri, document.languageId);
  }
  async function extractPromptForNotebook(e, t, n, i) {
    const o = repo.extractRepoInfoInBackground(e, t.uri.fsPath);
    const s = repo.tryGetGitHubNWO(o) ?? "";
    const c = await repo.getUserKind(e);
    const p = repo.getDogFood(o);
    const h = await e.get(a.Features).neighboringLanguageType({
      repoNwo: s,
      userKind: c,
      fileType: t.languageId,
      dogFood: p
    });
    const f = n.getCells().find(e => e.document.uri === t.uri);
    if (f) {
      const o = n.getCells().filter(e => e.index < f.index && u.considerNeighborFile(f.document.languageId, e.document.languageId, h));
      const s = o.length > 0 ? o.map(e => function (e, t) {
        const n = e.document.languageId;
        const i = e.document.getText();
        return n === t ? i : utils.commentBlockAsSingles(i, t);
      }(e, f.document.languageId)).join("\n\n") + "\n\n" : "";
      const a = s + t.getText();
      const c = s.length + t.offsetAt(i);
      const p = await e.get(documentmanager.TextDocumentManager).getRelativePath(t);
      return extractPromptForSource(e, a, c, p, t.uri, f.document.languageId);
    }
    return y(e, t, i);
  }
  exports.MIN_PROMPT_CHARS = 10;
  exports._contextTooShort = {
    type: "contextTooShort"
  };
  exports._copilotNotAvailable = {
    type: "copilotNotAvailable"
  };
  exports.trimLastLine = trimLastLine;
  exports.extractPromptForSource = extractPromptForSource;
  exports.extractPromptForNotebook = extractPromptForNotebook;
  exports.extractPrompt = function (ctx, document, position) {
    const notebook = ctx.get(documentmanager.TextDocumentManager).findNotebook(document);
    return void 0 === notebook ? extractPrompt(ctx, document, position) : extractPromptForNotebook(ctx, document, notebook, position);
  };