import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ArrowRight, ArrowLeft, MagnifyingGlass, X, BookmarkSimple, Check, Compass, Notebook, Books, ArrowUpRight, PencilSimple, Trash, List, Pause, Play, Info } from '@phosphor-icons/react';
import { normalise, type Destination, type DestinationId, type Book, type BookId } from '../data/content';
import { LanguageProvider, useI18n } from '../data/i18n';
import { getContent, searchAliases } from '../data/localized-content';

type Entry = { note: string; savedAt: string };
type Diary = Partial<Record<DestinationId, Entry>>;
const KEY = 'oltre.diary.v1';
const ARROW = <ArrowRight size={23} weight="regular" aria-hidden="true" />;

function Ship({ className = '' }: { className?: string }) {
  return <span className={`ship ${className}`} aria-hidden="true"><img src="/assets/departure-reference.webp" alt="" /></span>;
}
function BookArt({ book, compact = false }: { book: Book; compact?: boolean }) {
  const { locale, t } = useI18n();
  const destinationById = (id: string) => getContent(locale).destinations.find(d => d.id === id);
  if (book.id === 'rama') return <div className={`book-cover rama-cover ${compact ? 'compact' : ''}`} role="img" aria-label={t("Copertina illustrativa di Incontro con Rama")}><img src="/assets/journal-reference.webp" alt="" /></div>;
  const d = destinationById(book.destination)!;
  return <figure className={`book-scene ${compact ? 'compact' : ''}`}><img src={d.image} alt={d.imageAlt} /><figcaption>{t("Un’immagine dal percorso")}</figcaption></figure>;
}
function SourcesLink({ destination }: { destination: Destination }) {
  const { t } = useI18n();
  return <a className="source-link" href={destination.source.url} target="_blank" rel="noreferrer">{t("Approfondisci con NASA")} <ArrowUpRight size={17} aria-hidden="true" /></a>;
}
function routeFromHash() {
  if (typeof window === 'undefined') return 'viaggio';
  try { return decodeURIComponent(window.location.hash.slice(1)) || 'viaggio'; }
  catch { return 'viaggio'; }
}

export default function Oltre() { return <LanguageProvider><OltreExperience /></LanguageProvider>; }
function OltreExperience() {
  const { locale, setLocale, t } = useI18n();
  const { destinations, books } = getContent(locale);
  const destinationById = (id: string) => destinations.find(d => d.id === id);
  const bookById = (id: string) => books.find(b => b.id === id);
  const [route, setRoute] = useState('viaggio');
  const [diary, setDiary] = useState<Diary>({});
  const [hydrated, setHydrated] = useState(false);
  const [storageError, setStorageError] = useState('');
  const [toast, setToast] = useState('');
  const [undo, setUndo] = useState<{ id: DestinationId; entry: Entry } | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [tab, setTab] = useState<'facts' | 'open'>('facts');
  const [journalId, setJournalId] = useState<DestinationId>('oumuamua');
  const [flying, setFlying] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [observing, setObserving] = useState(false);
  const [noteSaved, setNoteSaved] = useState(false);
  const prefersReduced = useReducedMotion();
  const isReduced = reduced || !!prefersReduced;
  const dialogRef = useRef<HTMLDialogElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const flightTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const noteTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const savedIds = Object.keys(diary) as DestinationId[];
  const [page, id] = route.split('/');
  const destination = page === 'scoperta' ? destinationById(id) : undefined;
  const book = page === 'libro' ? bookById(id) : undefined;

  useEffect(() => {
    setRoute(routeFromHash());
    const update = () => { setRoute(routeFromHash()); setMenuOpen(false); setTab('facts'); setObserving(false); window.scrollTo(0, 0); document.getElementById('contenuto')?.focus({ preventScroll: true }); };
    window.addEventListener('hashchange', update);
    try {
      const raw = JSON.parse(localStorage.getItem(KEY) || '{}');
      const valid: Diary = {};
      for (const d of destinations) if (raw[d.id] && typeof raw[d.id].note === 'string' && typeof raw[d.id].savedAt === 'string') valid[d.id] = raw[d.id];
      setDiary(valid);
    } catch { setStorageError('Il diario non può essere letto in questo browser. Puoi continuare a esplorare.'); }
    setHydrated(true);
    return () => { window.removeEventListener('hashchange', update); if (flightTimer.current) clearTimeout(flightTimer.current); if (toastTimer.current) clearTimeout(toastTimer.current); if (noteTimer.current) clearTimeout(noteTimer.current); };
  }, []);
  useEffect(() => {
    if (!hydrated) return;
    try { localStorage.setItem(KEY, JSON.stringify(diary)); }
    catch { setStorageError('Salvataggio sul dispositivo non disponibile. Le modifiche restano solo in questa sessione.'); }
  }, [diary, hydrated]);
  useEffect(() => {
    const dialog = dialogRef.current;
    if (searchOpen && dialog && !dialog.open) { dialog.showModal(); searchRef.current?.focus(); }
    else if (!searchOpen && dialog?.open) dialog.close();
  }, [searchOpen]);
  useEffect(() => { document.title = `${destination?.title || book?.title || ({ mappa: t("Scegli la tua rotta"), diario: t("Diario di bordo"), biblioteca: t("Biblioteca"), fonti: t("Fonti e immagini") } as Record<string, string>)[page] || t("La Terra è solo l’inizio")} — OLTRE`; }, [route, locale]);

  function navigate(next: string) {
    if (flightTimer.current) clearTimeout(flightTimer.current);
    setFlying(false); setMenuOpen(false); setSearchOpen(false); setTab('facts'); setObserving(false);
    if (route === next) { window.scrollTo(0, 0); return; }
    window.location.hash = next;
  }
  function notify(message: string, duration = 5000) {
    setToast(message);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => { setToast(''); setUndo(null); }, duration);
  }
  function save(d: Destination) {
    if (!diary[d.id]) setDiary(previous => ({ ...previous, [d.id]: { note: '', savedAt: new Date().toISOString() } }));
    setJournalId(d.id); setUndo(null); navigate('diario'); notify('Scoperta salvata nel tuo diario.');
  }
  function remove(savedId: DestinationId) {
    const entry = diary[savedId]; if (!entry) return;
    setUndo({ id: savedId, entry });
    setDiary(previous => { const next = { ...previous }; delete next[savedId]; return next; });
    notify('Scoperta rimossa dal diario.', 12000);
  }
  function updateNote(savedId: DestinationId, value: string) {
    setNoteSaved(false);
    setDiary(previous => previous[savedId] ? { ...previous, [savedId]: { ...previous[savedId]!, note: value } } : previous);
    if (noteTimer.current) clearTimeout(noteTimer.current);
    noteTimer.current = setTimeout(() => setNoteSaved(true), 600);
  }
  function start() {
    if (isReduced) { navigate('mappa'); return; }
    setFlying(true);
    flightTimer.current = setTimeout(() => navigate('mappa'), 1400);
  }
  const navItems = [{ label: t("Viaggio"), target: 'mappa', icon: Compass, active: ['viaggio', 'mappa', 'scoperta'].includes(page) }, { label: t("Diario di bordo"), target: 'diario', icon: Notebook, active: page === 'diario' }, { label: t("Biblioteca"), target: 'biblioteca', icon: Books, active: ['biblioteca', 'libro'].includes(page) }];
  const journalSelection = diary[journalId] ? journalId : savedIds[0];
  const journalDestination = journalSelection ? destinationById(journalSelection) : undefined;
  const searchResults = [...destinations.map(d => ({ key: d.id, title: d.title, sub: d.category, text: searchAliases(d.id), target: `scoperta/${d.id}`, type: t("DESTINAZIONE") })), ...books.map(b => ({ key: b.id, title: b.title, sub: b.author, text: searchAliases(b.id), target: `libro/${b.id}`, type: t("LIBRO") }))].filter(r => normalise(r.text).includes(normalise(query.trim())));

  return <div className={`app ${isReduced ? 'reduce-motion' : ''}`}>
    <a className="skip-link" href="#contenuto" onClick={event => { event.preventDefault(); document.getElementById('contenuto')?.focus(); }}>{t("Vai al contenuto")}</a>
    <img className="universe-bg" src="/assets/milky-way-eso.webp" alt="" aria-hidden="true" />
    <header className="header">
      <button className="wordmark" onClick={() => navigate('viaggio')} aria-label={t("OLTRE, torna alla Terra")}>OLTRE</button>
      <span className="header-divider" aria-hidden="true" />
      <nav className="desktop-nav" aria-label={t("Navigazione principale")}>{navItems.map(n => <button key={n.target} className={n.active ? 'active' : ''} aria-current={n.active ? 'page' : undefined} onClick={() => navigate(n.target)}>{n.label}{n.target === 'diario' && savedIds.length > 0 && <span className="nav-count">{savedIds.length}</span>}</button>)}</nav>
      <button className="search-trigger" onClick={() => { setQuery(''); setSearchOpen(true); }} aria-label={t("Cerca una destinazione o un libro")}><MagnifyingGlass size={21} /><span>{t("Trova una destinazione")}</span></button>
      <div className="language-switch" role="group" aria-label={locale === 'en' ? 'Language' : 'Lingua'}>{(['en', 'it'] as const).map(language => <button key={language} lang={language} aria-label={language === 'en' ? 'English' : 'Italiano'} aria-pressed={locale === language} onClick={() => setLocale(language)}>{language.toUpperCase()}</button>)}</div>
      <button className="mobile-menu-button icon-button" aria-expanded={menuOpen} aria-label={menuOpen ? t("Chiudi menu") : t("Apri menu")} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X size={25} /> : <List size={25} />}</button>
    </header>
    {menuOpen && <nav className="mobile-menu" aria-label={t("Menu mobile")}>{navItems.map(n => <button key={n.target} onClick={() => navigate(n.target)}><n.icon size={21} />{n.label}<ArrowRight size={18} /></button>)}</nav>}
    <main id="contenuto" tabIndex={-1}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div key={route} className={`page page-${page}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: isReduced ? 0 : .22 }}>
          {page === 'viaggio' && <section className={`departure ${flying ? 'departing' : ''}`}>
            <motion.img className="earth" src="/assets/earth-blue-marble-nasa.webp" alt={t("La Terra vista dallo spazio, con nuvole e oceani.")} animate={flying && !isReduced ? { y: 150, scale: 1.15, opacity: .65 } : { y: 0, scale: 1, opacity: 1 }} transition={{ duration: 1.4 }} />
            <div className="departure-copy"><p className="eyebrow">{t("Il tuo viaggio comincia qui")}</p><h1>{t("La Terra è")}<br />{t("solo l’inizio.")}</h1><p className="lead">{t("Segui una rotta. Avvicinati a ciò che ti incuriosisce.")}</p><div className="actions"><button className="primary" onClick={flying ? () => navigate('mappa') : start}>{flying ? t("Salta la transizione") : t("Lascia l’orbita")}{ARROW}</button><button className="text-button" onClick={() => navigate('mappa')}>{t("Scegli una destinazione")}</button></div></div>
            <motion.div className="departure-ship" animate={flying && !isReduced ? { x: 200, y: -130, scale: .4, opacity: .4 } : { x: 0, y: 0, scale: 1, opacity: 1 }} transition={{ duration: 1.4 }}><Ship /><span>{t("La tua navicella")}</span></motion.div>
            <span className="earth-caption">{t("Terra · Punto di partenza")}</span>
            <div className="departure-footer"><span className="eyebrow">{t("Rotta libera")}</span><button className="quiet" onClick={() => navigate('mappa')}>{t("Scegli un punto nello spazio per esplorare")} <ArrowRight size={18} /></button><button className="quiet motion-toggle" onClick={() => setReduced(!reduced)} aria-pressed={isReduced}>{isReduced ? <Play size={15} /> : <Pause size={15} />}{isReduced ? t("Movimento ridotto") : t("Riduci il movimento")}</button></div>
          </section>}

          {page === 'mappa' && <section className="map-section content-width"><p className="eyebrow">{t("Una rotta tutta tua")}</p><div className="section-heading"><h1>{t("Scegli dove perderti.")}</h1><p>{t("Ogni destinazione è già aperta.")}<br />{t("Puoi cambiare rotta quando vuoi.")}</p></div><div className="destination-map">{destinations.map((d, i) => <button key={d.id} className={`destination-stop stop-${i}`} onClick={() => navigate(`scoperta/${d.id}`)} aria-label={`${t("Esplora")} ${d.title}`}><div className="stop-image"><img src={d.image} alt={d.imageAlt} />{diary[d.id] && <span className="saved-flag"><Check size={15} /> {t("Nel diario")}</span>}</div><span className="eyebrow">{d.category}</span><h2>{d.title}<ArrowUpRight size={25} /></h2><p>{d.subtitle}</p><span className="stop-action">{t("Avvicinati")} <ArrowRight size={19} /></span></button>)}</div><div className="map-bottom"><Ship className="map-ship" /><p>{t("La curiosità decide la rotta.")}<br /><span>{t("Le distanze della mappa sono narrative.")}</span></p><button className="text-button" onClick={() => navigate('viaggio')}><ArrowLeft size={18} /> {t("Torna alla Terra")}</button></div></section>}

          {destination && <section className={`encounter encounter-${destination.id}`}><button className="back-link" onClick={() => navigate('mappa')}><ArrowLeft size={17} /> {t("Tutte le destinazioni")}</button><div className={`encounter-visual ${observing ? 'observing' : ''}`}><img className="encounter-art" src={destination.image} alt={destination.imageAlt} /><Ship className="encounter-ship" /><button className="observe-control quiet" onClick={() => setObserving(!observing)} aria-pressed={observing}><Compass size={25} /><span>{observing ? t("Ripristina la vista") : t("Osserva più da vicino")}<small>{t(destination.id !== 'saturno' ? t("Esplora l’immagine ricostruita") : t("Esplora l’immagine"))}</small></span></button><p className="image-caption">{destination.imageLabel}</p></div><div className="encounter-copy"><p className="eyebrow">{t("Incontro ·")} {destination.category}</p><h1>{destination.title}</h1><p className="encounter-subtitle">{destination.subtitle}</p><p className="status-line">{destination.id === 'buco-nero' ? t("Fenomeno reale · Visualizzazione scientifica") : t("Oggetto reale · Incontro immaginato")}</p><div className="tabs" role="tablist" aria-label={t("Approfondimento della scoperta")}><button id="facts-tab" role="tab" aria-selected={tab === 'facts'} aria-controls="discovery-panel" onClick={() => setTab('facts')}>{t("Cosa sappiamo")}</button><button id="open-tab" role="tab" aria-selected={tab === 'open'} aria-controls="discovery-panel" onClick={() => setTab('open')}>{t("Cosa resta aperto")}</button></div><div id="discovery-panel" role="tabpanel" aria-labelledby={tab === 'facts' ? 'facts-tab' : 'open-tab'} className="fact-copy">{(tab === 'facts' ? destination.facts : destination.open).map(t => <p key={t}>{t}</p>)}</div><SourcesLink destination={destination} /><div className="encounter-actions"><button className="primary" onClick={() => save(destination)}>{diary[destination.id] ? t("Apri nel diario") : t("Salva nel diario")}{diary[destination.id] ? <Notebook size={22} /> : <BookmarkSimple size={22} />}</button><button className="text-button" onClick={() => navigate('mappa')}>{t("Cambia rotta")} <ArrowRight size={18} /></button></div><button className="reading-link quiet" onClick={() => navigate(`libro/${destination.bookId}`)}><Books size={18} /> {t("Una lettura da questa scoperta")} <ArrowRight size={17} /></button></div></section>}

          {page === 'diario' && <section className="journal content-width"><p className="eyebrow">{t("Quello che porti con te")}</p><div className="section-heading"><h1>{t("Il tuo diario di bordo.")}</h1><span className="local-label"><Notebook size={17} /> {t("Salvato su questo dispositivo")}</span></div>{savedIds.length === 0 ? <div className="empty-journal"><img src="/assets/earth-blue-marble-nasa.webp" alt={t("La Terra, il punto di partenza del viaggio.")} /><div><h2>{t("Ogni viaggio comincia")}<br />{t("con una curiosità.")}</h2><p>{t("Quando qualcosa ti colpisce, salvalo qui.")}<br />{t("Ritroverai la scoperta, le tue note e una lettura per continuare.")}</p><button className="primary" onClick={() => navigate('mappa')}>{t("Scegli la prima destinazione")}{ARROW}</button></div></div> : <><div className="journal-tabs" aria-label={t("Scoperte salvate")}>{savedIds.map(savedId => <button key={savedId} className={journalSelection === savedId ? 'selected' : ''} onClick={() => { setJournalId(savedId); setNoteSaved(false); }}>{destinationById(savedId)!.title}{journalSelection === savedId && <Check size={15} />}</button>)}</div>{journalDestination && <div className="journal-grid"><article className="journal-entry"><div className="journal-picture"><img src={journalDestination.image} alt={journalDestination.imageAlt} /><Ship /></div><p className="eyebrow">{t("Scoperta salvata")}</p><h2>{journalDestination.title}</h2><p>{journalDestination.id === 'oumuamua' ? t("Un visitatore da un altro sistema stellare. La forma esatta resta sconosciuta.") : journalDestination.intro}</p><label className="note-label" htmlFor="journal-note"><PencilSimple size={19} /> {t("Cosa ti ha incuriosito?")}</label><textarea id="journal-note" value={diary[journalDestination.id]?.note || ''} maxLength={4000} onChange={event => updateNote(journalDestination.id, event.target.value)} placeholder={t("Aggiungi una nota al tuo viaggio…")} /><div className="note-status" aria-live="polite">{storageError ? t("Salvataggio locale non disponibile") : noteSaved ? t("Nota salvata sul dispositivo") : t("Le note vengono salvate automaticamente")}</div><div className="entry-links"><button className="text-button" onClick={() => navigate(`scoperta/${journalDestination.id}`)}>{t("Riapri la scoperta")} <ArrowRight size={18} /></button><button className="quiet remove-button" onClick={() => remove(journalDestination.id)}><Trash size={16} /> {t("Rimuovi")}</button></div></article><aside className="journal-book"><p className="eyebrow">{t("Continua questa scoperta")}</p><h2>{t("Un incontro, un libro.")}</h2><BookArt book={bookById(journalDestination.bookId)!} compact /><div className="journal-book-info"><h3>{bookById(journalDestination.bookId)!.title}</h3><p className="book-author">{bookById(journalDestination.bookId)!.author}</p><span className="eyebrow">{bookById(journalDestination.bookId)!.kind}</span><h4>{t("Perché è collegato")}</h4><p>{journalDestination.linkReason}</p><button className="text-button" onClick={() => navigate(`libro/${journalDestination.bookId}`)}>{t("Scopri il libro")} <ArrowRight size={18} /></button></div><button className="primary resume-button" onClick={() => navigate('mappa')}>{t("Riprendi il viaggio")}{ARROW}</button></aside></div>}</>}</section>}

          {page === 'biblioteca' && <section className="library content-width"><p className="eyebrow">{t("Lo spazio, una pagina alla volta")}</p><div className="section-heading"><h1>{t("La biblioteca di OLTRE.")}</h1><p>{t("Tre letture, tre porte aperte.")}<br />{t("Ogni libro ti riporta a una scoperta.")}</p></div><div className="book-list">{books.map(b => <article className="library-book" key={b.id}><button className="book-image-button" onClick={() => navigate(`libro/${b.id}`)} aria-label={`${t("Apri")} ${b.title}`}><BookArt book={b} /></button><p className="eyebrow">{b.kind}</p><h2><button onClick={() => navigate(`libro/${b.id}`)}>{b.title}</button></h2><p className="book-author">{b.author}</p><p>{b.description}</p><button className="text-button" onClick={() => navigate(`libro/${b.id}`)}>{t("Esplora il libro")} <ArrowRight size={18} /></button></article>)}</div></section>}

          {book && <section className="book-detail content-width"><button className="back-link" onClick={() => navigate('biblioteca')}><ArrowLeft size={17} /> {t("Biblioteca")}</button><div className="book-detail-top"><div className="book-art-area"><BookArt book={book} />{book.id === 'rama' && <small>{t("Copertina illustrativa")}</small>}</div><div><p className="eyebrow">{book.kind}</p><h1>{book.title}</h1><p className="book-author">{book.author}</p><p className="book-description">{book.description}</p><a className="source-link" href={book.source.url} target="_blank" rel="noreferrer">{book.source.title} <ArrowUpRight size={17} /></a></div></div><div className="book-connection"><div><p className="eyebrow">{t("Il filo tra lettura e scoperta")}</p><h2>{destinationById(book.destination)!.title}</h2><p>{destinationById(book.destination)!.linkReason}</p></div><button className="primary" onClick={() => navigate(`scoperta/${book.destination}`)}>{t("Esplora la scoperta")}{ARROW}</button></div><button className="text-button" onClick={() => navigate('diario')}><Notebook size={19} /> {t("Torna al diario di bordo")}</button></section>}

          {page === 'fonti' && <section className="credits content-width"><p className="eyebrow">{t("Per andare alla fonte")}</p><h1>{t("Scienza e immagini.")}</h1><p className="lead">{t("Un viaggio immaginato, con riferimenti da esplorare.")}</p><div className="credits-grid"><div><h2>{t("Le scoperte")}</h2>{destinations.map(d => <p key={d.id}><a className="source-link" href={d.source.url} target="_blank" rel="noreferrer">{d.source.title}<ArrowUpRight size={17} /></a></p>)}<p className="muted">{t("I testi sono sintesi divulgative. Le distanze, la nave e gli incontri rappresentati nel viaggio sono narrativi.")}</p></div><div><h2>{t("Le immagini")}</h2><p>{t("Terra: NASA, immagine Blue Marble.")}</p><p>{t("Via Lattea: ESO / S. Brunier.")}</p><p>{t("‘Oumuamua: ESO / M. Kornmesser, ricostruzione artistica.")}</p><p>{t("Saturno: NASA / JPL-Caltech / Space Science Institute.")}</p><p>{t("Buco nero: NASA’s Goddard Space Flight Center / Jeremy Schnittman, visualizzazione.")}</p><p>{t("Navicella e copertina illustrativa: dai concept OLTRE già creati per questo progetto.")}</p><p className="muted">{t("Le ricostruzioni sono indicate accanto alle immagini. Per esplorare i dati e le osservazioni, segui le fonti delle singole scoperte.")}</p></div></div></section>}

          {!['viaggio', 'mappa', 'diario', 'biblioteca', 'fonti'].includes(page) && !destination && !book && <section className="not-found content-width"><p className="eyebrow">{t("Una rotta da ritrovare")}</p><h1>{t("Questa destinazione")}<br />{t("non è sulla mappa.")}</h1><button className="primary" onClick={() => navigate('mappa')}>{t("Apri le destinazioni")}{ARROW}</button></section>}
        </motion.div>
      </AnimatePresence>
    </main>
    <footer className="site-footer"><span>{t("Viaggio narrativo · Distanze e tempi compressi")}</span><button className="quiet" onClick={() => navigate('fonti')}><Info size={15} /> {t("Fonti e immagini")}</button>{page !== 'viaggio' && <button className="quiet" aria-pressed={isReduced} onClick={() => setReduced(!reduced)}>{isReduced ? <Play size={14} /> : <Pause size={14} />}{isReduced ? t("Movimento ridotto") : t("Riduci il movimento")}</button>}</footer>
    {storageError && <div className="storage-warning" role="status">{t(storageError)}<button className="icon-button" aria-label={t("Chiudi avviso")} onClick={() => setStorageError('')}><X size={16} /></button></div>}
    <div className="toast-region" aria-live="polite" aria-atomic="true">{toast && <div className="toast"><Check size={19} /><span>{t(toast)}</span>{undo && <button onClick={() => { setDiary(previous => ({ ...previous, [undo.id]: undo.entry })); setUndo(null); notify('Scoperta ripristinata.'); }}>{t("Annulla")}</button>}</div>}</div>
    <dialog ref={dialogRef} className="search-dialog" onCancel={() => setSearchOpen(false)} onClick={e => { if (e.target === dialogRef.current) setSearchOpen(false); }} aria-labelledby="search-title"><div className="search-dialog-inner"><div className="dialog-heading"><p className="eyebrow" id="search-title">{t("Segui una curiosità")}</p><button className="icon-button" aria-label={t("Chiudi ricerca")} onClick={() => setSearchOpen(false)}><X size={24} /></button></div><div className="search-input-wrap"><MagnifyingGlass size={25} /><input ref={searchRef} value={query} onChange={e => setQuery(e.target.value)} placeholder={t("Un mondo, una parola, un libro…")} aria-label={t("Cerca tra destinazioni e libri")} /></div><p className="search-hint">{query ? `${searchResults.length} ${searchResults.length === 1 ? t("risultato") : t("risultati")}` : t("Destinazioni e letture da cui partire")}</p><div className="search-results">{searchResults.length > 0 ? searchResults.map(r => <button key={`${r.type}-${r.key}`} onClick={() => navigate(r.target)}><span><small className="eyebrow">{r.type}</small><strong>{r.title}</strong><small>{r.sub}</small></span><ArrowUpRight size={23} /></button>) : <div className="no-results"><h2>{t("Nessuna rotta trovata.")}</h2><p>{t("Prova “Saturno”, “tempo” oppure “Clarke”.")}</p></div>}</div></div></dialog>
  </div>;
}
