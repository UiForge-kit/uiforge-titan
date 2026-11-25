# Contributing to Titan

Thanks for helping. This repository is the free edition of Titan, a template by UIForge. Bug fixes, accessibility and performance work, docs and improvements to the free modules are welcome. Features that belong to the Pro edition are not accepted here.

## Set up

```bash
npm install
npm run dev
```

Node 20.9 or newer.

## Before you open a pull request

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

All four must pass. CI runs the same commands.

## Code

- TypeScript strict. Follow the patterns already in the folder you touch, and reuse existing helpers before adding new ones.
- Pure logic goes in `lib/` with a test next to it. Components stay thin.
- `components/ui` comes from shadcn/ui: change it only for a real fix.
- Comments are rare and explain why, never what. No section banners, no commented-out code, no comment that repeats the next line. Write them in English, short and direct.
- Keep user-visible text consistent with the surrounding screens.
- Never commit secrets, `.env` files or real customer data.

## Pull requests

- One topic per pull request, with a short description of what changed and why. Add before and after screenshots for visual changes.
- Use short imperative commit messages ("Fix upload quota check").
- Open an issue first for anything large, so we can agree on the approach.

## Reporting bugs and security issues

Use the issue forms for bugs and ideas. For vulnerabilities, follow `SECURITY.md`; do not open a public issue.
