# Beyond — prototipo locale

Un viaggio libero tra scoperte dello spazio, approfondimenti e letture. Questa versione permette di partire dalla Terra, scegliere subito una delle tre destinazioni (‘Oumuamua, Saturno, buco nero), consultare fonti, salvare le scoperte nel diario, aggiungere note e aprire un libro collegato.

Il repository del progetto è [xZezza/Beyond](https://github.com/xZezza/Beyond). OLTRE è il nome precedente ancora presente nell’interfaccia del prototipo e nei concept grafici; l’aggiornamento dell’identità visiva sarà affrontato nella fase di design.

## Repository locale

Il repository Git si trova in questa cartella del progetto, usa il branch `main` e ha `https://github.com/xZezza/Beyond.git` come remoto `origin`. Il codice, il lockfile, la documentazione e gli asset fanno parte della cronologia; dipendenze, build, file temporanei e configurazioni `.env` sono esclusi.

Il flusso di lavoro è: una modifica circoscritta → anteprima e controlli pertinenti → commit con una descrizione chiara. Per interventi più grandi si apre un branch dedicato e si integra in `main` dopo la revisione. Un commit conserva una versione locale; il push invia i commit al repository remoto.

## Avvio e comandi

Il server di sviluppo viene avviato dall’agente su `http://127.0.0.1:4173/`. Per riaprirlo in seguito dalla cartella del progetto:

```sh
npm install
npm run dev
```

```sh
npm run check       # controllo TypeScript
npm run build       # sito statico in dist/client + wrapper del template
npm run test:sites  # verifica del wrapper, senza pubblicazione
```

## Tecnologia

- Astro + TypeScript per la struttura.
- React + Motion per navigazione e interazioni.
- Font locali Cormorant Garamond e Inter, icone Phosphor.
- Dati editoriali in `src/data/content.ts`.
- UI in `src/components/Oltre.tsx`; stili in `src/styles/oltre.css`.
- Nessun backend, account o chiamata AI dal sito.

## Lingue

L’inglese è la lingua iniziale. Il selettore EN / IT traduce interfaccia, schede, libri e messaggi; la preferenza è salvata in `oltre.locale.v1`. La ricerca riconosce titoli e termini di entrambe le lingue. Le note personali e il diario esistente conservano testo e identificativi.

I contenuti italiani sono in `src/data/content.ts`, quelli inglesi in `src/data/localized-content.ts`; l’interfaccia usa `src/data/translations.json`. I link alle edizioni italiane sono dichiarati anche in inglese. La copertina illustrativa di Rama conserva il titolo italiano nel raster già approvato.

## Cosa funziona

- Partenza animata con possibilità di saltare la transizione.
- Tre destinazioni raggiungibili liberamente e link diretti tramite hash.
- Schede con sezioni “Cosa sappiamo” / “Cosa resta aperto”.
- Avvicinamento all’immagine, dichiaratamente illustrativo e non simulazione fisica.
- Diario con salvataggio, note, rimozione e annullamento.
- Persistenza dopo il ricaricamento sullo stesso browser/dispositivo.
- Biblioteca di tre libri, collegamenti in entrambe le direzioni con le scoperte.
- Ricerca per destinazione, argomento, titolo o autore; stato senza risultati.
- Menu mobile, navigazione da tastiera e riduzione del movimento.

## Limiti del prototipo

Il diario usa localStorage: cancellando i dati del browser si perdono i salvataggi, che non si sincronizzano tra dispositivi. Se il browser blocca lo storage, il sito mostra un avviso e mantiene i dati solo nella sessione.

La mappa è narrativa: distanze e tempi sono compressi, la nave è immaginaria e gli incontri non rappresentano missioni reali. Le pagine dei contenuti usano rotte hash; per una versione pubblica con indicizzazione dei singoli contenuti serviranno pagine Astro con URL propri.

La copertina di Rama e la navicella sono ritagli visivi non distruttivi dei concept già approvati, mostrati tramite CSS. Per gli altri libri si usano immagini del percorso, esplicitamente indicate. Una versione pubblica potrà usare copertine autorizzate e asset separati.

## Asset e fonti

I file originali e la provenienza sono in `public/assets/sources.json`. Le copie WebP conservano i soggetti originali e riducono la dimensione dei file per il web. Fotografie e ricostruzioni NASA/ESO hanno attribuzione nel sito; le ricostruzioni sono indicate sulle singole immagini.

Il prototipo viene eseguito localmente e il codice è collegato al repository GitHub fornito dall’utente. Non sono stati acquistati servizi, registrati domini o attivati abbonamenti; non è stata fatta una nuova generazione di immagini né pubblicato il sito.

## Prossime verifiche di prodotto

1. Far provare il viaggio a poche persone senza istruzioni.
2. Osservare se scelgono una seconda destinazione e salvano una scoperta.
3. Verificare se il libro collegato viene percepito come un approfondimento pertinente.
4. Decidere, sulla base di queste prove, se aggiungere contenuti, pannello editoriale e successivamente sincronizzazione.

Il report dei controlli visivi e funzionali è in `design-qa.md`.

## Workflow condiviso

1. Confermare promessa, atmosfera e percorso principale: esplorare una scoperta, capirla, salvarla e trovare una lettura collegata.
2. Provare il percorso completo nel prototipo locale, con libera scelta tra le tre destinazioni e interfaccia inglese/italiana.
3. Raccogliere il feedback dell’utente su chiarezza, ritmo, navigazione, contenuti e leggibilità mobile.
4. Correggere il percorso e validarlo con poche persone esterne prima di ampliare il catalogo.
5. Scegliere i nuovi contenuti e, in una fase successiva autorizzata, valutare pubblicazione e promozione.

L’agente prepara implementazione, contenuti da rivedere e verifiche; l’utente sceglie la direzione e dà feedback su risultati concreti. Ogni iterazione si chiude con un’anteprima utilizzabile. Nessuna spesa o pubblicazione è necessaria per queste fasi locali.
