# Contributing to TexPick

Thanks for helping make copied chats easier to clean.

## Before opening an issue

Never post a real private conversation. Replace names, IDs, channel names, and message contents with safe examples while preserving the copied structure.

Good:

```text
ExampleUser — Today at 3:20 PM
Example message
Reply
```

Not acceptable:

- Real names or usernames
- Private messages
- Email addresses
- User, channel, or server IDs
- Sensitive personal information

## Reporting an unsupported format

Include:

1. Chat platform and language
2. Desktop, web, or mobile client
3. An anonymized copied-text sample
4. Expected output
5. Actual output

## Development

The project uses plain HTML, CSS, and JavaScript.

Run tests:

```bash
npm test
```

When changing parser rules:

1. Add a failing test first.
2. Make the smallest parser change that supports the format.
3. Confirm existing formats still pass.
4. Avoid rules that may remove normal message content.

## Pull requests

Keep pull requests focused and explain the user-visible behavior change. By contributing, you agree that your contribution will be licensed under the MIT License.
