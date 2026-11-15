# OLTRE — visual and interaction QA

Source visual truth: approved departure `exec-76df0913-382a-4453-ac48-a07bc2512106.png`, encounter `exec-130a1b2b-4732-4d96-9602-63fe482f88c2.png`, and journal `exec-db2c71f1-83df-4cfd-8fb2-24bdf48f05cf.png` in the current chat's generated-images folder.

Source dimensions: 1487 × 1058 pixels. Desktop browser viewport: 1487 × 1058 CSS pixels. The local IAB screenshot has the same dimensions; density normalization is not required.

## First pass — blocked pending fixes

Implementation screenshot: `work/qa/desktop-departure-before.jpg`.

- P1 imagery: Earth photo's black rectangular background and the spacecraft's screenshot window visibly interrupt the starfield. Fix through non-destructive image cropping and appropriate composition.
- P2 imagery/layout: Earth is too small and low, while the galactic band is horizontal and dull. Increase Earth scale and rotate/reposition the real panorama to recover the reference's diagonal composition.
- P2 navigation: mobile menu icon appears alongside the full desktop navigation. Correct CSS specificity.
- P2 accessibility: the skip link updates the hash-router route instead of focusing the main content. Handle focus without changing route.

Accepted constraints: existing approved raster assets and unmodified NASA/ESO source images are used because the user explicitly requested zero new spend and reuse. The source Earth artwork and artist model are therefore adapted to real source imagery. Desktop audio UI is replaced with a working reduced-motion control, since audio is outside this prototype's scope. Map and essential additional destinations are requested functional additions.

## Second comparison and fixes

The first fixes removed the rectangular Earth margin through a non-destructive CSS crop, enlarged its horizon, masked the existing raster spacecraft to its silhouette, rotated and resized the real star panorama, and corrected mobile-menu specificity. The skip link now focuses `#contenuto` without altering the hash route.

Full-view comparison then found a P1 hierarchy issue: the encounter text was too small, its reading column began too far left, and the journal's book was undersized. These were fixed by increasing desktop type to 18px for encounter facts, changing the encounter column ratio, enlarging the journal jacket to 210px, simplifying journal copy, and bringing its heading upward. The jacket's crop was corrected to remove a neighboring divider and duplicated caption from the raster concept. The removal Undo opportunity was increased from 5 to 12 seconds.

## Final visual evidence

Source references are all 1487 × 1058 pixels, held under `/Users/gaiaghezzi/.codex/generated_images/01a1d584-d68b-7980-8eb5-c1f9993cf5e6/`:

- `exec-76df0913-382a-4453-ac48-a07bc2512106.png` — departure.
- `exec-130a1b2b-4732-4d96-9602-63fe482f88c2.png` — encounter.
- `exec-db2c71f1-83df-4cfd-8fb2-24bdf48f05cf.png` — saved journal with book.

Browser-rendered implementation evidence:

- `work/qa/desktop-departure.jpg`, `work/qa/desktop-encounter.jpg`, `work/qa/desktop-journal.jpg`: 1487 × 1058 pixels, CSS viewport 1487 × 1058, density 1.
- `anteprima.jpg`: final clean departure, same desktop dimensions.
- `work/qa/mobile-departure.jpg`: 390 × 844 viewport.
- `work/qa/mobile-journal.jpg`, `mobile-map.jpg`, `mobile-library.jpg`, `mobile-book.jpg`: full-page captures from a 390 × 844 CSS viewport, density 1; capture height follows content height.

The IAB native overview can visually scale its mobile thumbnail; QA uses the actual `tab.screenshot` files, whose pixel widths were verified as 390. DOM measurements also confirmed `innerWidth === documentElement.scrollWidth === 390` on mobile and 1487 on desktop. No density mismatch is used to judge layout.

Full-view side-by-side comparisons, source left / implementation right:

- `work/qa/compare-departure.png`
- `work/qa/compare-encounter.png`
- `work/qa/compare-journal.png`

Each pair uses the same viewport/state and equal-size previews. Focused comparisons at original density are in `focus-departure.png`, `focus-encounter.png`, and `focus-journal.png`. They were inspected for heading scale, tab/body readability, CTA alignment, and jacket/reading anatomy. Comparison images are produced by `scripts/compare-design.mjs`, which edits diagnostic evidence only, never app assets.

## Required fidelity surfaces

- **Fonts and typography:** locally served Cormorant Garamond and Inter reproduce the ivory editorial serif / plain sans-serif hierarchy. Enlarged desktop reading text and jacket resolve the earlier hierarchy issue. Mobile headings wrap within the viewport; body copy is readable without zoom. Exact font geometry differs slightly from the generated reference (P3).
- **Spacing and layout rhythm:** departure, two-column encounter, and diary-with-reading layouts preserve the approved anatomy. Extra back navigation, saved-entry selector and device-storage label support the requested usable prototype. Footer controls stay reachable; no horizontal overflow was found. Mobile intentionally becomes a vertical reading layout.
- **Colors and tokens:** navy-black base `#070c12`, ivory `#f6efdf`, amber `#dfac60`, restrained dividers. Dark backing improves contrast where labels cross the Earth photo. Keyboard focus is visible.
- **Image quality and assets:** existing approved ship and illustrative Rama jacket are reused as actual raster assets, not redrawn. Real NASA/ESO photography and artist concepts replace the reference's unavailable isolated scenery under the explicit zero-spend constraint. Credit/type labels remain visible. WebP derivatives reduce transfer size; originals are retained. No missing images were found. The source-photo rectangular framing is an intentional asset adaptation, not a claim of pixel-identical generated scenery.
- **Copy and content:** factual summaries link to NASA; uncertain/artist reconstruction status is visible. The Rama connection is expressly narrative. Extra template jargon was removed. Search uses singular/plural correctly. Intro copy is concise enough for the visual hierarchy.
- **Icons and controls:** Phosphor icons; semantic buttons, labelled input/textarea, native search dialog, tabs and pressed states. Touch navigation and primary actions remain operable at 390px.

## Functional checks completed

1. Departure animation, skip action and direct destination selection.
2. Saturn visited first, then black hole: no forced order or unlocks.
3. Change route; all three destination pages available.
4. Facts/open-questions tabs and close-up/restore control.
5. Save, reopen without duplication, note editing, and note persistence after reload.
6. Remove and Undo restoring the entry.
7. Diary → Rama detail → corresponding discovery; library and other book detail pages.
8. Search by unaccented `oumuamua`, author `Hawking`, and an unmatched query; search Escape behavior.
9. Mobile menu, library, detail and journal; no horizontal overflow; all visible imagery loaded.
10. Keyboard skip link focuses main and preserves route; reduced-motion control works.
11. Browser warning/error logs were empty at final inspection.

TypeScript check and latest static build passed. All four existing packaging/Worker tests also passed. This was local verification; no deployment, account or paid service was activated. Test notes/entries were removed before handoff. The visible browser was left on the clean departure and marked as a deliverable; temporary viewport override was reset.

## Follow-up polish / product limits

- P3: exact reference typography and imaginary scenery differ within the documented reuse constraint.
- Separate production ship/jacket assets could replace the non-destructive raster windows later.
- Reading-list bookmarks, account sync, actual 3D flight and crawlable per-content URLs are future scope, not simulated as functioning features.
- Storage failure/OS motion preference handling exists in code; physical devices, cross-browser QA and adverse storage/network conditions were not exhaustively tested.

No actionable P0/P1/P2 finding remains for the agreed local-prototype scope.

final result: passed


## Aggiornamento EN / IT — 15 novembre 2026

- Inglese come lingua iniziale, selettore EN / IT nell’header, preferenza persistente e attributo HTML `lang` aggiornato.
- Tradotti interfaccia, attributi accessibili, schede scientifiche, domande aperte, libri, ricerca, notifiche e attribuzioni.
- Titoli originali inglesi per i libri; link alle edizioni italiane e copertina illustrativa italiana esplicitamente indicati.
- Ricerca verificata: “Saturno” trova “Saturn” in EN; “Saturn” trova “Saturno” in IT; “time” trova fenomeno e libro.
- Percorso ‘Oumuamua → domande aperte → diario → libro verificato in browser. Una nota di prova è sopravvissuta al cambio lingua e al ricaricamento con preferenza IT, quindi il suo testo è stato ripristinato.
- Layout controllato su desktop a 1280 px e mobile a 390 e 360 px: nessun overflow orizzontale, controlli dell’header raggiungibili, menu e pagine biblioteca/libro utilizzabili. Titolo inglese della home adattato a due righe su mobile.
- TypeScript, build statico e quattro test di packaging superati. Nessun errore o warning rilevato nella console dell’anteprima finale.
- Screenshot: `work/qa/home-en.jpg`, `work/qa/home-en-mobile.jpg`, `work/qa/journal-en.jpg`, `work/qa/library-en-mobile.jpg`.

Il progetto rimane locale e non introduce dipendenze, servizi o costi nuovi.
