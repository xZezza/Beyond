export type DestinationId = 'oumuamua' | 'saturno' | 'buco-nero';
export type BookId = 'rama' | 'cosmo' | 'tempo';
export type Source = { title: string; url: string };
export type Destination = {
  id: DestinationId; title: string; category: string; subtitle: string; intro: string;
  image: string; imageAlt: string; imageLabel: string; credit: string;
  facts: string[]; open: string[]; bookId: BookId; linkReason: string;
  source: Source; tags: string[]; position: { x: number; y: number };
};

export const destinations: Destination[] = [
  {
    id: 'oumuamua', title: '‘Oumuamua', category: 'Visitatore interstellare',
    subtitle: 'Un ospite da un altro sistema.',
    intro: 'Una traiettoria di passaggio, un’origine lontana. Il primo oggetto riconosciuto come interstellare ci ha lasciato più domande di quante potessimo inseguirne.',
    image: '/assets/oumuamua-eso.webp', imageAlt: 'Ricostruzione artistica di ‘Oumuamua, un oggetto scuro e allungato nello spazio.',
    imageLabel: 'Ricostruzione artistica · Forma esatta sconosciuta', credit: 'ESO / M. Kornmesser',
    facts: ['Osservato nel 2017.', 'La traiettoria indica un’origine interstellare.', 'La sua forma esatta resta incerta.'],
    open: ['La forma esatta non è stata osservata direttamente: l’immagine è uno dei possibili modelli artistici.', 'Il sistema stellare di origine non è stato identificato con certezza.', 'Sono state proposte spiegazioni naturali per la sua piccola accelerazione aggiuntiva. Questo non dimostra un’origine artificiale.'],
    bookId: 'rama', linkReason: 'Il romanzo immagina l’esplorazione di un visitatore sconosciuto nel Sistema solare. È un collegamento narrativo, non una spiegazione di ‘Oumuamua.',
    source: { title: '‘Oumuamua — NASA Science', url: 'https://science.nasa.gov/solar-system/comets/oumuamua/' },
    tags: ['asteroide', 'cometa', 'oumuamua', 'interstellare', 'mistero'], position: { x: 61, y: 43 },
  },
  {
    id: 'saturno', title: 'Saturno', category: 'Mondi del Sistema solare', subtitle: 'Un mondo, innumerevoli frammenti.',
    intro: 'Da lontano gli anelli sembrano un unico disco. Avvicinando lo sguardo, emerge una struttura fatta di moltissimi corpi separati.',
    image: '/assets/saturn-cassini-nasa.webp', imageAlt: 'Saturno e il suo esteso sistema di anelli, ripresi dalla sonda Cassini in colori enfatizzati.',
    imageLabel: 'Missione Cassini · Colori enfatizzati', credit: 'NASA / JPL-Caltech / Space Science Institute',
    facts: ['Saturno è un gigante gassoso: non ha una superficie solida su cui atterrare come sulla Terra.', 'Gli anelli sono composti da innumerevoli particelle di ghiaccio e roccia.', 'La missione Cassini ha studiato Saturno, i suoi anelli e le sue lune per tredici anni.'],
    open: ['La formazione e l’evoluzione degli anelli sono oggetto di ricerca.', 'Per le lune oceaniche come Encelado, abitabilità e presenza di vita sono domande distinte: la vita non è stata confermata.'],
    bookId: 'cosmo', linkReason: 'Cosmo allarga lo sguardo dal nostro pianeta all’esplorazione dell’universo. È un percorso di lettura generale, non un manuale aggiornato su Saturno.',
    source: { title: 'Saturno — NASA Science', url: 'https://science.nasa.gov/saturn/' }, tags: ['saturno', 'anelli', 'pianeta', 'cassini', 'encelado'], position: { x: 77, y: 29 },
  },
  {
    id: 'buco-nero', title: 'Buco nero', category: 'Ai confini della luce', subtitle: 'Il limite da cui la luce non torna.',
    intro: 'Il suo confine non è una superficie solida. È una soglia: oltre l’orizzonte degli eventi, neppure la luce può raggiungere di nuovo l’esterno.',
    image: '/assets/black-hole-nasa.webp', imageAlt: 'Visualizzazione di un buco nero circondato da un disco luminoso di materia.',
    imageLabel: 'Visualizzazione scientifica · Non una fotografia', credit: 'NASA’s Goddard Space Flight Center / Jeremy Schnittman',
    facts: ['Un buco nero è una regione dello spazio in cui la gravità impedisce alla luce di uscire oltre un determinato confine.', 'Il bordo luminoso nelle visualizzazioni rappresenta materia calda e luce incurvata dalla gravità, non la superficie del buco nero.', 'Le osservazioni dei sistemi circostanti e le onde gravitazionali permettono di studiarli.'],
    open: ['Descrivere completamente ciò che accade nelle regioni più estreme richiede una comprensione ancora incompleta della gravità e della fisica quantistica.', 'Il destino dell’informazione nei buchi neri è un tema di ricerca teorica.'],
    bookId: 'tempo', linkReason: 'Un saggio che introduce tempo, gravità e buchi neri. La lettura offre contesto storico e concettuale; le scoperte successive vanno approfondite con fonti aggiornate.',
    source: { title: 'Buchi neri — NASA Science', url: 'https://science.nasa.gov/universe/black-holes/' }, tags: ['buco nero', 'buchi neri', 'gravità', 'tempo', 'orizzonte', 'relatività'], position: { x: 85, y: 59 },
  },
];

export type Book = { id: BookId; title: string; author: string; kind: string; description: string; destination: DestinationId; source: Source };
export const books: Book[] = [
  { id: 'rama', title: 'Incontro con Rama', author: 'Arthur C. Clarke', kind: 'Romanzo · Fantascienza', description: 'Un oggetto sconosciuto attraversa il Sistema solare. Una spedizione si avvicina per esplorarlo: la curiosità diventa il motore del racconto.', destination: 'oumuamua', source: { title: 'Scheda dell’editore — edizione inglese', url: 'https://store.gollancz.co.uk/products/rendezvous-with-rama' } },
  { id: 'cosmo', title: 'Cosmo', author: 'Carl Sagan', kind: 'Saggio · Divulgazione', description: 'Un viaggio tra astronomia, storia della scienza e posto dell’umanità nell’universo. Una lettura per allargare lo sguardo oltre il singolo incontro.', destination: 'saturno', source: { title: 'Catalogo bibliografico', url: 'https://www.librinlinea.it/titolo/cosmo-sagan-carl-chersi-tullio/LIA0044716' } },
  { id: 'tempo', title: 'Dal big bang ai buchi neri', author: 'Stephen Hawking', kind: 'Saggio · Divulgazione', description: 'Un’introduzione alle grandi domande su spazio, tempo e universo, attraverso le idee della fisica moderna.', destination: 'buco-nero', source: { title: 'Scheda dell’editore — Rizzoli', url: 'https://www.rizzolilibri.it/libri/dal-big-bang-ai-buchi-neri/' } },
];

export const destinationById = (id: string) => destinations.find(d => d.id === id);
export const bookById = (id: string) => books.find(b => b.id === id);
export const normalise = (s: string) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[‘’']/g, '');
