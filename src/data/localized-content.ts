import { destinations as italianDestinations, books as italianBooks, type Destination, type Book } from './content';
import type { Locale } from './i18n';
const destinations: Destination[] = [
  {
    ...italianDestinations[0], category: 'Interstellar visitor', subtitle: 'A visitor from another system.',
    intro: 'A passing trajectory, a distant origin. The first object recognized as interstellar left us with more questions than we could pursue.',
    imageAlt: 'Artist’s impression of ‘Oumuamua, a dark, elongated object in space.',
    imageLabel: 'Artist’s impression · Exact shape unknown',
    facts: ['Observed in 2017.', 'Its trajectory indicates an interstellar origin.', 'Its exact shape remains uncertain.'],
    open: ['Its exact shape was not observed directly: this image is one possible artistic interpretation.', 'Its home star system has not been identified with certainty.', 'Natural explanations have been proposed for its small additional acceleration. This does not establish an artificial origin.'],
    linkReason: 'The novel imagines the exploration of an unknown visitor to the Solar System. This is a narrative connection, rather than an explanation of ‘Oumuamua.',
    tags: ['asteroid', 'comet', 'oumuamua', 'interstellar', 'mystery'],
  },
  {
    ...italianDestinations[1], title: 'Saturn', category: 'Worlds of the Solar System', subtitle: 'One world, countless fragments.',
    intro: 'From afar, the rings look like a single disc. Look closer, and a structure made of countless separate bodies emerges.',
    imageAlt: 'Saturn and its extensive ring system, captured by the Cassini spacecraft in enhanced colors.',
    imageLabel: 'Cassini mission · Enhanced colors',
    facts: ['Saturn is a gas giant: it has no solid surface to land on as we would on Earth.', 'Its rings consist of countless particles of ice and rock.', 'The Cassini mission studied Saturn, its rings and its moons for thirteen years.'],
    open: ['The formation and evolution of the rings remain subjects of research.', 'For ocean moons such as Enceladus, habitability and the presence of life are separate questions: life has not been confirmed.'],
    linkReason: 'Cosmos broadens our view from our home planet to the exploration of the universe. It offers a wider reading journey, rather than a current handbook on Saturn.',
    source: { ...italianDestinations[1].source, title: 'Saturn — NASA Science' },
    tags: ['saturn', 'rings', 'planet', 'cassini', 'enceladus'],
  },
  {
    ...italianDestinations[2], title: 'Black hole', category: 'At the edge of light', subtitle: 'The boundary light cannot return from.',
    intro: 'Its boundary is no solid surface. It is a threshold: beyond the event horizon, even light cannot reach the outside again.',
    imageAlt: 'Scientific visualization of a black hole surrounded by a bright disc of matter.',
    imageLabel: 'Scientific visualization · Not a photograph',
    facts: ['A black hole is a region of space where gravity prevents light from escaping beyond a particular boundary.', 'The bright disc in visualizations depicts hot matter and light bent by gravity, rather than the surface of the black hole.', 'Observations of surrounding systems and gravitational waves allow us to study them.'],
    open: ['Fully describing what happens in the most extreme regions requires an understanding of gravity and quantum physics that is still incomplete.', 'The fate of information in black holes is a subject of theoretical research.'],
    linkReason: 'An introduction to time, gravity and black holes. The book offers historical and conceptual context; later discoveries should be explored through current sources.',
    source: { ...italianDestinations[2].source, title: 'Black holes — NASA Science' },
    tags: ['black hole', 'black holes', 'gravity', 'time', 'horizon', 'relativity'],
  },
];
const books: Book[] = [
  { ...italianBooks[0], title: 'Rendezvous with Rama', kind: 'Novel · Science fiction', description: 'An unknown object crosses the Solar System. An expedition approaches to explore it: curiosity becomes the driving force of the story.', source: { ...italianBooks[0].source, title: 'Publisher’s page — English edition' } },
  { ...italianBooks[1], title: 'Cosmos', kind: 'Nonfiction · Popular science', description: 'A journey through astronomy, the history of science and humanity’s place in the universe. A book that takes you beyond a single encounter.', source: { ...italianBooks[1].source, title: 'Library catalogue — Italian edition' } },
  { ...italianBooks[2], title: 'A Brief History of Time', kind: 'Nonfiction · Popular science', description: 'An introduction to the great questions of space, time and the universe through the ideas of modern physics.', source: { ...italianBooks[2].source, title: 'Publisher’s page — Italian edition' } },
];
const content = { en: { destinations, books }, it: { destinations: italianDestinations, books: italianBooks } };
export const getContent = (locale: Locale) => content[locale];
// Both vocabularies remain searchable without duplicating visible results.
export const searchAliases = (id: string) => Object.values(content).flatMap(c => [
  ...c.destinations.filter(d => d.id === id).map(d => [d.title, d.category, ...d.tags].join(' ')),
  ...c.books.filter(b => b.id === id).map(b => `${b.title} ${b.author} ${b.kind}`),
]).join(' ');
