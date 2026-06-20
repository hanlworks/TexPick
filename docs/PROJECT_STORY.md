# TexPick project story

## The problem

Copying a Discord conversation often brings along usernames, timestamps, reaction controls, reply labels, and other interface text. Cleaning the result by hand is repetitive, especially when the goal is simply to archive or reorganize what people wrote.

TexPick started as a personal utility for removing that clutter.

## Building in public

The maintainer began the project without prior experience publishing a web application or maintaining an open-source repository. OpenAI Codex was used as a collaborative development tool throughout the process:

- translating the original problem into deterministic extraction rules;
- creating regression tests from anonymized Discord copy formats;
- redesigning the interface through repeated visual review;
- setting up GitHub, an MIT license, contribution guidance, and security documentation;
- deploying the static application through Cloudflare Workers;
- verifying desktop, mobile, light, and dark interfaces.

The maintainer made the product decisions, tested each iteration, and supplied the real-world examples that shaped the parser.

## Design decisions

### Local-only processing

Pasted conversations stay in the browser. TexPick does not require an account, database, analytics service, or AI API.

### Deterministic rules

The extraction engine uses inspectable JavaScript rules rather than sending private conversations to a model. This keeps behavior fast, predictable, and testable.

### A narrow scope

TexPick does not attempt to scrape logged-in accounts or bypass Discord's copy limits. It focuses on cleaning text the user has already chosen to copy.

## What comes next

The next stage is evidence-driven:

1. collect anonymized samples from more Discord clients and languages;
2. add a regression test for every confirmed format;
3. improve accessibility based on user testing;
4. consider other chat platforms only when reliable sample formats are available.

The project is intentionally small. Its value comes from solving one real task clearly, privately, and reproducibly.
