(function startApp() {
  "use strict";

  const $ = (selector) => document.querySelector(selector);
  const inputText = $("#inputText");
  const outputText = $("#outputText");
  const copyButton = $("#copyButton");
  const downloadButton = $("#downloadButton");
  const toast = $("#toast");
  const settingIds = [
    "removeHeaders",
    "removeUi",
    "removeEmoji",
    "removeMentions",
    "normalizeSpacing"
  ];

  const translations = {
    ko: {
      eyebrow: "TEXTPICK / CHAT CLEANER",
      heroTitle: '<span class="hero-product">디스코드</span> 대화에서 본문만.',
      heroDescription: "디스코드에서 복사한 대화를 붙여 넣으면 닉네임, 시간, 반응 메뉴를 지우고 본문만 남깁니다.",
      privacyTitle: "내 브라우저에서만 처리",
      privacyBody: "붙여 넣은 내용은 기기 밖으로 나가지 않으며 저장되지 않습니다.",
      noAccount: "가입 없음",
      theme: "테마",
      options: "옵션",
      closeOptions: "옵션 닫기",
      done: "완료",
      cleaningRules: "정리 설정",
      settingsSummary: "기본 설정으로 대부분의 채팅을 정리할 수 있어요",
      settingsOpen: "설정 열기",
      settingsTitle: "정리 옵션",
      reset: "초기화",
      removeHeaders: "닉네임과 시간",
      removeHeadersHelp: "작성자, 날짜, 타임스탬프",
      removeUi: "메뉴와 안내 문구",
      removeUiHelp: "답장, 수정, 반응 추가하기 등",
      removeEmoji: "이모티콘과 반응",
      removeEmojiHelp: "유니코드 및 :emoji: 코드",
      removeMentions: "멘션",
      removeMentionsHelp: "@사용자, 역할, 채널 멘션",
      normalizeSpacing: "공백 정리",
      normalizeSpacingHelp: "중복 빈 줄과 줄 끝 공백",
      customRules: "직접 지울 문구 추가",
      customRulesHelp: "한 줄에 하나씩 입력하세요. 정확히 일치하는 줄을 제거합니다.",
      customRulesPlaceholder: "예:\n읽지 않은 메시지\n스레드 보기",
      autoStatus: "붙여 넣으면 자동으로 정리됩니다",
      inputTitle: "채팅 붙여 넣기",
      clear: "비우기",
      inputPlaceholder: "다온 — 오전 10:24\n이번 주 모임은 토요일 오후가 어때?\n답장\n반응 추가하기\n\n해솔 — 오전 10:26\n나는 좋아. 장소만 정하면 될 것 같아.\n\n민우 — 오전 10:27\n역 앞 카페는 사람이 많으니까 공원 쪽은 어때?\n수정\n전달\n기타\n\n다온 — 오전 10:29\n좋아, 그럼 공원 입구에서 두 시에 만나자.",
      outputTitle: "추출된 메시지",
      outputPlaceholder: "이번 주 모임은 토요일 오후가 어때?\n\n나는 좋아. 장소만 정하면 될 것 같아.\n\n역 앞 카페는 사람이 많으니까 공원 쪽은 어때?\n\n좋아, 그럼 공원 입구에서 두 시에 만나자.",
      download: "TXT 다운로드",
      copy: "결과 복사",
      removedLines: "개 불필요한 줄 제거",
      messageLines: "개 메시지 줄 보존",
      reduction: "내용 감소",
      featureFastTitle: "즉시 처리",
      featureFastBody: "설치나 로그인 없이 붙여 넣는 즉시 결과를 확인할 수 있습니다.",
      featureFlexibleTitle: "유연한 규칙",
      featureFlexibleBody: "기본 규칙을 켜고 끄거나 직접 제거할 문구를 추가할 수 있습니다.",
      featureOpenTitle: "오픈소스",
      featureOpenBody: "작동 방식을 누구나 확인하고 새로운 채팅 형식을 함께 지원할 수 있습니다.",
      footerText: "Your conversations stay yours.",
      privacyLink: "개인정보 안내",
      copied: "결과를 복사했어요.",
      emptyResult: "먼저 채팅을 붙여 넣어 주세요.",
      downloaded: "TXT 파일을 저장했어요.",
      sampleLoaded: "예시를 불러왔어요.",
      settingsReset: "정리 규칙을 초기화했어요.",
      characters: "자"
    },
    en: {
      eyebrow: "TEXTPICK / CHAT CLEANER",
      heroTitle: '<span class="hero-product">Discord</span> messages, minus the clutter.',
      heroDescription: "Paste a conversation copied from Discord and remove names, timestamps, reactions, and interface labels.",
      privacyTitle: "Runs only in your browser",
      privacyBody: "Pasted text never leaves your device and is never stored.",
      noAccount: "No account",
      theme: "Theme",
      options: "Options",
      closeOptions: "Close options",
      done: "Done",
      cleaningRules: "Cleanup settings",
      settingsSummary: "The defaults work for most copied chats",
      settingsOpen: "Open settings",
      settingsTitle: "Cleanup options",
      reset: "Reset",
      removeHeaders: "Names and timestamps",
      removeHeadersHelp: "Authors, dates, and time labels",
      removeUi: "Menus and interface text",
      removeUiHelp: "Reply, Edit, Add Reaction, and more",
      removeEmoji: "Emoji and reactions",
      removeEmojiHelp: "Unicode emoji and :emoji: codes",
      removeMentions: "Mentions",
      removeMentionsHelp: "User, role, and channel mentions",
      normalizeSpacing: "Clean spacing",
      normalizeSpacingHelp: "Duplicate blank lines and trailing spaces",
      customRules: "Add phrases to remove",
      customRulesHelp: "Enter one exact line per row.",
      customRulesPlaceholder: "Example:\nUnread messages\nView thread",
      autoStatus: "Your chat is cleaned automatically as you paste",
      inputTitle: "Paste chat",
      clear: "Clear",
      inputPlaceholder: "Robin — Today at 10:24 AM\nHow does Saturday afternoon sound for this week's meetup?\nReply\nAdd Reaction\n\nMorgan — Today at 10:26 AM\nWorks for me. We just need to choose a place.\n\nMin — Today at 10:27 AM\nThe cafe by the station gets crowded. How about the park?\nEdit\nForward\nMore\n\nRobin — Today at 10:29 AM\nPerfect. Let's meet by the park entrance at two.",
      outputTitle: "Extracted messages",
      outputPlaceholder: "How does Saturday afternoon sound for this week's meetup?\n\nWorks for me. We just need to choose a place.\n\nThe cafe by the station gets crowded. How about the park?\n\nPerfect. Let's meet by the park entrance at two.",
      download: "Download TXT",
      copy: "Copy result",
      removedLines: "unnecessary lines removed",
      messageLines: "message lines preserved",
      reduction: "content reduction",
      featureFastTitle: "Instant",
      featureFastBody: "No installation or sign-in. Paste your chat and see the result immediately.",
      featureFlexibleTitle: "Flexible",
      featureFlexibleBody: "Toggle built-in rules or add phrases specific to your chat platform.",
      featureOpenTitle: "Open source",
      featureOpenBody: "Inspect how it works and help support new chat formats.",
      footerText: "Your conversations stay yours.",
      privacyLink: "Privacy",
      copied: "Result copied.",
      emptyResult: "Paste a conversation first.",
      downloaded: "TXT file downloaded.",
      sampleLoaded: "Sample loaded.",
      settingsReset: "Cleaning rules reset.",
      characters: " chars"
    }
  };

  const samples = {
    ko: `P — 오전 11:472026년 6월 18일 목요일 오전 11:47
맛점
오늘은 프리점심? 😊

ang — 오후 12:022026년 6월 18일 목요일 오후 12:02
@P 엉ㅎㅎ
답장

:heart_on_fire:
클릭해서 반응
반응 추가하기
수정
전달
기타

Z — 2026-06-01 오전 3:282026년 6월 1일 월요일 오전 3:28
나이스

#푸슉에 메시지 보내기`,
    en: `Alex — Today at 11:47 AM
Lunch sounds good.
Are we still meeting today? 😊

Sam — Today at 12:02 PM
@Alex Yep, see you there.
Reply

:heart_on_fire:
Click to react
Add Reaction
Edit
Forward
More

Message #general`
  };

  let language = localStorage.getItem("texPickLanguage")
    || localStorage.getItem("chatExtractorLanguage")
    || "ko";
  let toastTimer;

  function t(key) {
    return translations[language][key] || translations.ko[key] || key;
  }

  function showToast(message) {
    clearTimeout(toastTimer);
    toast.textContent = message;
    toast.classList.add("visible");
    toastTimer = setTimeout(() => toast.classList.remove("visible"), 1800);
  }

  function getOptions() {
    return {
      ...Object.fromEntries(settingIds.map((id) => [id, $(`#${id}`).checked])),
      customRules: $("#customRulesInput").value.split("\n")
    };
  }

  function render() {
    const result = TexPick.extractMessages(inputText.value, getOptions());
    outputText.value = result.output;
    $("#inputCount").textContent = `${result.stats.inputCharacters.toLocaleString()}${t("characters")}`;
    $("#outputCount").textContent = `${result.stats.outputCharacters.toLocaleString()}${t("characters")}`;
    $("#removedCount").textContent = result.stats.removedLines.toLocaleString();
    $("#messageCount").textContent = result.stats.messageLines.toLocaleString();
    $("#reductionRate").textContent = `${result.stats.reductionRate}%`;
    downloadButton.disabled = !result.output;
  }

  function applyLanguage() {
    document.documentElement.lang = language;
    document.querySelectorAll("[data-i18n]").forEach((element) => {
      element.innerHTML = t(element.dataset.i18n);
    });
    document.querySelectorAll("[data-i18n-placeholder]").forEach((element) => {
      element.placeholder = t(element.dataset.i18nPlaceholder);
    });
    document.querySelectorAll("[data-i18n-aria-label]").forEach((element) => {
      element.setAttribute("aria-label", t(element.dataset.i18nAriaLabel));
    });
    $("#languageButton").textContent = language === "ko" ? "EN" : "한국어";
    document.title = language === "ko"
      ? "TexPick — 채팅 본문 추출기"
      : "TexPick — Extract clean messages from chats";
    updateThemeControl();
    render();
  }

  function updateThemeControl() {
    const isLight = document.documentElement.dataset.theme === "light";
    const label = language === "ko"
      ? (isLight ? "어두운 테마로 변경" : "밝은 테마로 변경")
      : (isLight ? "Switch to dark theme" : "Switch to light theme");
    $("#themeButton").setAttribute("aria-label", label);
    $("#themeButton").setAttribute("title", label);
  }

  async function copyOutput() {
    if (!outputText.value) {
      showToast(t("emptyResult"));
      return;
    }
    try {
      await navigator.clipboard.writeText(outputText.value);
    } catch {
      outputText.removeAttribute("readonly");
      outputText.select();
      document.execCommand("copy");
      outputText.setAttribute("readonly", "");
      window.getSelection()?.removeAllRanges();
    }
    showToast(t("copied"));
  }

  function downloadOutput() {
    if (!outputText.value) return;
    const blob = new Blob([outputText.value], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `texpick-${new Date().toISOString().slice(0, 10)}.txt`;
    anchor.click();
    URL.revokeObjectURL(url);
    showToast(t("downloaded"));
  }

  function resetSettings() {
    settingIds.forEach((id) => { $(`#${id}`).checked = true; });
    $("#customRulesInput").value = "";
    render();
    showToast(t("settingsReset"));
  }

  inputText.addEventListener("input", render);
  inputText.addEventListener("focus", () => {
    document.body.classList.add("examples-hidden");
  });
  inputText.addEventListener("blur", () => {
    if (!inputText.value) document.body.classList.remove("examples-hidden");
  });
  $("#customRulesInput").addEventListener("input", render);
  settingIds.forEach((id) => $(`#${id}`).addEventListener("change", render));
  copyButton.addEventListener("click", copyOutput);
  downloadButton.addEventListener("click", downloadOutput);
  $("#clearButton").addEventListener("click", () => {
    inputText.value = "";
    render();
    inputText.focus();
  });
  $("#resetSettingsButton").addEventListener("click", resetSettings);
  const optionsDialog = $("#optionsDialog");
  $("#optionsButton").addEventListener("click", () => optionsDialog.showModal());
  $("#closeOptionsButton").addEventListener("click", () => optionsDialog.close());
  $("#doneOptionsButton").addEventListener("click", () => optionsDialog.close());
  optionsDialog.addEventListener("click", (event) => {
    if (event.target === optionsDialog) optionsDialog.close();
  });
  $("#languageButton").addEventListener("click", () => {
    language = language === "ko" ? "en" : "ko";
    localStorage.setItem("texPickLanguage", language);
    applyLanguage();
  });
  $("#themeButton").addEventListener("click", () => {
    const nextTheme = document.documentElement.dataset.theme === "light" ? "dark" : "light";
    document.documentElement.dataset.theme = nextTheme;
    localStorage.setItem("texPickTheme", nextTheme);
    updateThemeControl();
  });

  const savedTheme = localStorage.getItem("texPickTheme")
    || localStorage.getItem("chatExtractorTheme");
  document.documentElement.dataset.theme = savedTheme || "light";
  $("#year").textContent = new Date().getFullYear();
  applyLanguage();
})();
