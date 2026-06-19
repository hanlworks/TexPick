const test = require("node:test");
const assert = require("node:assert/strict");
const {
  extractMessages,
  isAuthorHeader,
  isTimestamp,
  isUiLine
} = require("../src/extractor.js");

test("removes compact Korean Discord headers and preserves messages", () => {
  const input = `P — 오전 11:472026년 6월 18일 목요일 오전 11:47
맛점
오늘은 프리점심?

ang — 오후 12:022026년 6월 18일 목요일 오후 12:02
엉ㅎㅎ
답장

P — 오후 12:022026년 6월 18일 목요일 오후 12:02
나이스`;

  const result = extractMessages(input);
  assert.equal(result.output, `맛점
오늘은 프리점심?

엉ㅎㅎ

나이스`);
  assert.equal(result.stats.messageLines, 4);
});

test("removes reaction and message action blocks", () => {
  const input = `:heart_on_fire:

클릭해서 반응

:thumbsup:

클릭해서 반응

:100:

클릭해서 반응

반응 추가하기
수정
전달
기타

Z — 2026-06-01 오전 3:282026년 6월 1일 월요일 오전 3:28`;

  assert.equal(extractMessages(input).output, "");
});

test("removes full date lines with bracketed timestamps", () => {
  const input = `[오전 3:33]2026년 6월 1일 월요일 오전 3:33
클릭해서 반응
실제 본문`;
  assert.equal(extractMessages(input).output, "실제 본문");
});

test("removes English Discord headers and UI labels", () => {
  const input = `Alex — Today at 3:20 PM
Hello there 👋
Reply
Add Reaction
Message #general`;
  assert.equal(extractMessages(input).output, "Hello there");
});

test("removes mentions while preserving surrounding message text", () => {
  const input = `Alex — Today at 3:20 PM
@Sam hello <@123456> everyone`;
  assert.equal(extractMessages(input).output, "hello everyone");
});

test("supports custom exact-line removal rules", () => {
  const input = `keep this
remove this line
keep that`;
  const result = extractMessages(input, {
    customRules: ["remove this line"]
  });
  assert.equal(result.output, "keep this\nkeep that");
});

test("can keep emoji when the rule is disabled", () => {
  const input = "hello 😊";
  assert.equal(extractMessages(input, { removeEmoji: false }).output, "hello 😊");
});

test("can keep interface labels when the rule is disabled", () => {
  assert.equal(extractMessages("답장", { removeUi: false }).output, "답장");
});

test("classifiers recognize supported metadata structures", () => {
  assert.equal(isTimestamp("2026년 6월 18일 목요일 오후 12:02"), true);
  assert.equal(isTimestamp("Today at 12:02 PM"), true);
  assert.equal(isAuthorHeader("nickname — 오후 12:022026년 6월 18일 목요일 오후 12:02"), true);
  assert.equal(isUiLine("#general에 메시지 보내기"), true);
});

test("reports useful extraction statistics", () => {
  const result = extractMessages(`Alex — Today at 3:20 PM
Hello
Reply`);
  assert.equal(result.stats.removedLines, 2);
  assert.equal(result.stats.messageLines, 1);
  assert.ok(result.stats.reductionRate > 0);
});
