(function attachExtractor(globalScope) {
  "use strict";

  const INVISIBLE_CHARACTERS = /[\u200B-\u200D\u2060\uFEFF]/g;
  const KOREAN_TIME = String.raw`(?:오늘|어제)?\s*(?:오전|오후)\s*\d{1,2}:\d{2}`;
  const KOREAN_FULL_DATE = String.raw`\d{4}년\s*\d{1,2}월\s*\d{1,2}일(?:\s*[월화수목금토일]요일)?\s*(?:오전|오후)\s*\d{1,2}:\d{2}`;
  const NUMERIC_DATE = String.raw`\d{4}[./-]\s*\d{1,2}[./-]\s*\d{1,2}\.?\s*(?:오전|오후)?\s*\d{1,2}:\d{2}`;
  const ENGLISH_TIME = String.raw`(?:(?:Today|Yesterday)\s+at\s+)?\d{1,2}(?::\d{2})?\s*(?:AM|PM)`;

  const TIMESTAMP_PATTERNS = [
    new RegExp(`^${KOREAN_TIME}$`),
    new RegExp(`^\\[${KOREAN_TIME}\\]$`),
    new RegExp(`^(?:\\[${KOREAN_TIME}\\]\\s*)?${KOREAN_FULL_DATE}$`),
    new RegExp(`^${NUMERIC_DATE}$`),
    new RegExp(`^${ENGLISH_TIME}$`, "i"),
    /^\d{1,2}\/\d{1,2}\/\d{2,4},?\s+\d{1,2}:\d{2}\s*(?:AM|PM)?$/i
  ];

  const AUTHOR_HEADER_PATTERNS = [
    new RegExp(`^.{1,120}\\s+[—–-]\\s*(?:${KOREAN_TIME}|${NUMERIC_DATE})(?:${KOREAN_FULL_DATE})?$`),
    new RegExp(`^.{1,120}\\s+[—–-]\\s*${ENGLISH_TIME}$`, "i"),
    new RegExp(`^.{1,120}\\s+${KOREAN_TIME}(?:${KOREAN_FULL_DATE})?$`),
    /^.{1,120}\s+\d{1,2}\/\d{1,2}\/\d{2,4},?\s+\d{1,2}:\d{2}\s*(?:AM|PM)?$/i
  ];

  const DISCORD_UI_PATTERNS = [
    /^(?:클릭해서|클릭하여)\s*반응$/,
    /^반응\s*추가하기$/,
    /^(?:답장|수정|전달|기타|복사|삭제|고정)$/,
    /^:[A-Za-z0-9_+\-]{1,64}:$/,
    /^#[^\n]{1,100}에\s*메시지\s*보내기$/,
    /^(?:메시지|답장)\s*보내기$/,
    /^(?:새\s*메시지|읽지\s*않은\s*메시지)$/,
    /^메시지\s*로드(?:하기)?$/,
    /^(?:스레드\s*보기|점프하기)$/,
    /^(?:Click|Tap)\s+to\s+react$/i,
    /^Add\s+Reaction$/i,
    /^(?:Reply|Edit|Forward|More|Copy|Delete|Pin)$/i,
    /^Message\s+#[^\n]{1,100}$/i,
    /^NEW$/i
  ];

  const CUSTOM_EMOJI = /<a?:[A-Za-z0-9_]+:\d+>/g;
  const COLON_EMOJI = /:[A-Za-z0-9_+\-]{2,64}:/g;
  const UNICODE_EMOJI = /[\p{Extended_Pictographic}\p{Emoji_Presentation}\uFE0F\u200D\u{1F3FB}-\u{1F3FF}]/gu;

  const DEFAULT_OPTIONS = Object.freeze({
    removeHeaders: true,
    removeUi: true,
    removeEmoji: true,
    removeMentions: true,
    normalizeSpacing: true,
    customRules: []
  });

  function cleanLine(line) {
    return String(line ?? "").replace(INVISIBLE_CHARACTERS, "").trim();
  }

  function isTimestamp(line) {
    const value = cleanLine(line);
    return TIMESTAMP_PATTERNS.some((pattern) => pattern.test(value));
  }

  function isAuthorHeader(line) {
    const value = cleanLine(line);
    if (!value) return false;
    return AUTHOR_HEADER_PATTERNS.some((pattern) => pattern.test(value));
  }

  function isUiLine(line) {
    const value = cleanLine(line);
    return DISCORD_UI_PATTERNS.some((pattern) => pattern.test(value));
  }

  function removeMentions(text) {
    return text
      .replace(/<@!?\d+>|<@&\d+>|<#\d+>/g, "")
      .replace(/(^|\s)@[^\s@]{1,64}(?=\s|$)/g, "$1");
  }

  function removeEmojis(text) {
    return text
      .replace(CUSTOM_EMOJI, "")
      .replace(COLON_EMOJI, "")
      .replace(UNICODE_EMOJI, "");
  }

  function normalizeLines(lines) {
    const normalized = lines.map((line) => line.replace(/[ \t]+/g, " ").trim());
    const compact = [];

    for (const line of normalized) {
      if (line === "" && compact.at(-1) === "") continue;
      compact.push(line);
    }

    while (compact[0] === "") compact.shift();
    while (compact.at(-1) === "") compact.pop();
    return compact;
  }

  function extractMessages(input, userOptions = {}) {
    const options = { ...DEFAULT_OPTIONS, ...userOptions };
    const customRules = new Set(
      (options.customRules || []).map(cleanLine).filter(Boolean)
    );
    const source = String(input ?? "")
      .replace(/\r\n?/g, "\n")
      .replace(INVISIBLE_CHARACTERS, "");
    const sourceLines = source.split("\n");
    const keptLines = [];
    const removed = [];

    for (let index = 0; index < sourceLines.length; index += 1) {
      const original = sourceLines[index];
      const line = cleanLine(original);
      const next = cleanLine(sourceLines[index + 1] || "");

      if (customRules.has(line)) {
        removed.push({ line: original, reason: "custom" });
        continue;
      }

      if (options.removeHeaders) {
        if (line && next && isTimestamp(next) && line.length <= 120) {
          removed.push({ line: original, reason: "author" });
          removed.push({ line: sourceLines[index + 1], reason: "timestamp" });
          index += 1;
          continue;
        }

        if (isTimestamp(line)) {
          removed.push({ line: original, reason: "timestamp" });
          continue;
        }

        if (isAuthorHeader(line)) {
          removed.push({ line: original, reason: "author" });
          continue;
        }
      }

      if (options.removeUi && isUiLine(line)) {
        removed.push({ line: original, reason: "ui" });
        continue;
      }

      let transformed = original;
      if (options.removeMentions) transformed = removeMentions(transformed);
      if (options.removeEmoji) transformed = removeEmojis(transformed);

      if (cleanLine(original) && !cleanLine(transformed)) {
        removed.push({ line: original, reason: options.removeEmoji ? "emoji" : "mention" });
        continue;
      }

      keptLines.push(transformed);
    }

    const finalLines = options.normalizeSpacing ? normalizeLines(keptLines) : keptLines;
    const output = finalLines.join("\n").trim();
    const nonEmptyMessages = finalLines.filter((line) => cleanLine(line)).length;
    const inputLength = source.length;
    const outputLength = output.length;
    const reductionRate = inputLength
      ? Math.max(0, Math.round((1 - outputLength / inputLength) * 100))
      : 0;

    return {
      output,
      stats: {
        inputCharacters: inputLength,
        outputCharacters: outputLength,
        removedLines: removed.length,
        messageLines: nonEmptyMessages,
        reductionRate
      },
      removed
    };
  }

  const api = {
    DEFAULT_OPTIONS,
    extractMessages,
    isAuthorHeader,
    isTimestamp,
    isUiLine,
    removeEmojis,
    removeMentions
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }

  globalScope.TexPick = api;
})(typeof globalThis !== "undefined" ? globalThis : window);
