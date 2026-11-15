# Prototype Instructions

## OLTRE decisions confirmed with the user

- OLTRE is a provisional name. The user wants an English-facing identity; choose the final name together before naming a remote repository or changing the site's branding.
- Set up local Git first. Remote hosting and repository creation are separate steps; keep the prototype local until the user chooses to connect it.
- Local prototype only. Zero new spend: no domain, deployment, account creation, paid services, image generation or purchases.
- English is the default language, with an English/Italian switch. Persist the language preference separately from diary entries; never translate or overwrite personal notes. Search accepts both vocabularies.
- Desktop and mobile browser experience, using Astro + TypeScript and React/Motion for interactions.
- Cinematic ivory serif typography on deep blue-black space imagery, restrained amber, small research spacecraft.
- Free choice of destinations at all times. No mandatory sequence or unlocks.
- Three destinations: ‘Oumuamua, Saturn, and a black-hole visualization. ‘Oumuamua has the main diary/book journey.
- Diary and notes stored only in localStorage on the current device; no authentication or remote database.
- Source imagery is NASA/ESO photography or clearly labelled reconstruction, plus existing approved OLTRE concept assets. Keep credits and distinguish science, uncertainty and fiction.
- The existing web starter was adapted to Astro to honor the stack selected in this chat. Preserve the Sites packaging helper and Worker; Astro emits to dist/client and the packaging helper emits the existing wrapper. This does not publish the prototype.

Run the local server yourself and open the preview in the browser available to this environment. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

Build app UI in `src/`. Keep `.openai/hosting.json`, `worker/index.js`, `scripts/prepare-sites-build.mjs`, and `tests/sites-worker.test.mjs` intact so the same local prototype can be handed to Sites. Before a Sites handoff, run `npm run build` and `npm run test:sites`; the build must leave `dist/client/index.html`, `dist/server/index.js`, and `dist/.openai/hosting.json`.
