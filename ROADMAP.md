# Roadmap

TexPick will grow carefully: parser coverage should improve without increasing the risk of deleting real message text.

## Near term

- Collect anonymized copy-format samples from Discord desktop, web, and mobile
- Add regression tests for every supported format
- Improve accessibility and keyboard navigation
- Add shareable rule presets that contain no chat content
- Add a visible parser-version and release notes

## Platform expansion

- Slack copied-message formats
- Microsoft Teams copied-message formats
- KakaoTalk exported or copied text where reliable
- Generic timestamp and author patterns for community platforms

## Quality and trust

- Browser-based end-to-end tests
- Security review for privacy claims and dependency changes
- Community-maintained compatibility table
- Release automation with reproducible static deployments

## Non-goals

- Uploading or storing private conversations
- Scraping chats directly from logged-in accounts
- Requiring a browser extension for basic use
- Using AI APIs when deterministic local rules are sufficient
