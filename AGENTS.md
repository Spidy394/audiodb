# AGENTS.md

Bun (TypeScript) project that scrapes YouTube audio-story channels into committed JSON datasets. All code lives under `backend/`; the Git repo root is this directory.

## Commands

Run everything from `backend/`:

- `bun install` — install deps (Bun, not npm)
- `bun run src/scraper/index.ts` — run the scraper

Gotchas:
- `README.md` says `bun run index.ts`, but there is **no** root `index.ts`. The real entrypoint is `src/scraper/index.ts`. `package.json` `"module"` field is stale.
- Typecheck: `bunx tsc --noEmit` (tsconfig sets `noEmit`). No `scripts` are defined in `package.json`; there are no tests or linters.

## External dependency

Requires the `yt-dlp` binary on `PATH`; it is invoked via `execa` in `src/scraper/youtube.ts` and is **not** a npm package. Also needs network access to YouTube. Fails fast if missing. Metadata is fetched in chunks of 20 (`CHUNK_SIZE`).

## How it works

- `src/scraper/config/channel.ts` — the channel list (`channels[0]` = "Mir Afsar Ali") and the show matchers (`shows`, keyed by `ShowId`). Only `channels[0]` is scraped.
- `src/scraper/stories.ts` — title-based classification: `EXCLUDED_KEYWORDS` filters out music videos/promos/live/etc.; `getShow()` matches title patterns to a show.
- `src/scraper/index.ts` — pipeline: list videos → filter → fetch metadata → build dataset → write `data/<channel-id>.json` (relative to `backend/`, committed to the repo).

## Adding a show

Show IDs are hardcoded in several places — touching them means updating all of:
1. `config/channel.ts` (`ShowId` type + `shows` entry)
2. `stories.ts` `buildDataset()` (the `shows` record with empty arrays)
3. `index.ts` (the `counts` object and final log line)
4. `types/story-dataset.ts` (`Record<ShowId, Story[]>`)