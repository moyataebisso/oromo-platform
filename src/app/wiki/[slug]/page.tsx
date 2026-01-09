import { notFound } from 'next/navigation'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { WikiArticleContent } from '@/components/wiki/wiki-article-content'
import { createClient } from '@/lib/supabase/server'

// Mock article data for fallback
const mockArticles: Record<string, {
  id: string
  title: string
  slug: string
  content: string
  summary: string
  category: string
  category_slug: string
  author_name: string
  is_featured: boolean
  view_count: number
  created_at: string
  updated_at: string
}> = {
  'gadaa-system': {
    id: '1',
    title: 'The Gadaa System: Ancient Democratic Governance',
    slug: 'gadaa-system',
    summary: 'The Gadaa system is an indigenous democratic socio-political system of the Oromo people.',
    content: `## Introduction

The Gadaa system is an indigenous democratic socio-political system practiced by the Oromo people of Ethiopia and parts of Kenya. It is one of the oldest and most sophisticated systems of governance in Africa, predating many modern democratic systems by centuries.

## Historical Background

The origins of the Gadaa system date back over 500 years, though oral traditions suggest it may be even older. The system was developed as a way to organize society, maintain peace, and ensure the equitable distribution of resources among the Oromo people.

In 2016, UNESCO inscribed the Gadaa system on the Representative List of the Intangible Cultural Heritage of Humanity, recognizing its significance as a living cultural tradition.

## Structure and Organization

### The Gadaa Grades

The Gadaa system divides males into age sets (hiriya) that pass through five grades over a 40-year cycle:

1. **Dabballee** (0-8 years): Childhood stage
2. **Folle/Gamme** (8-16 years): Junior stage
3. **Qondaala** (16-24 years): Senior junior stage
4. **Kuusa** (24-32 years): Preparation for leadership
5. **Gadaa** (32-40 years): Active ruling class

### The Abba Gadaa

The Abba Gadaa is the democratically elected leader who presides over the Gadaa assembly (Gumi Gayo). He serves a non-renewable eight-year term and is responsible for:

- Presiding over the legislative assembly
- Administering justice
- Leading religious ceremonies
- Representing the Oromo people in external affairs

## Democratic Principles

The Gadaa system embodies several democratic principles that were revolutionary for its time:

- **Term limits**: Leaders serve fixed, non-renewable terms
- **Separation of powers**: Different bodies handle legislative, judicial, and executive functions
- **Peaceful transfer of power**: Transition ceremonies ensure smooth handovers
- **Checks and balances**: Multiple councils prevent concentration of power

## Laws and Legislation

The primary laws of the Gadaa system are called **Seera** (laws) and **Heera** (bylaws). These are:

- Reviewed and updated every eight years
- Codified through oral tradition
- Publicly announced at the Gumi Gayo assembly
- Binding on all members of society

## Modern Relevance

Today, the Gadaa system continues to be practiced in various Oromo communities, though its political influence has diminished under the Ethiopian state structure. However, it remains:

- A source of cultural identity
- A framework for conflict resolution
- An inspiration for democratic governance
- A subject of academic study worldwide

## Conclusion

The Gadaa system represents one of humanity's earliest experiments in democratic governance. Its sophisticated structure, emphasis on term limits, and systems of checks and balances demonstrate that complex democratic societies existed in Africa long before European colonization.`,
    category: 'History',
    category_slug: 'history',
    author_name: 'Bekele Abera',
    is_featured: true,
    view_count: 1250,
    created_at: '2024-01-15',
    updated_at: '2024-01-20',
  },
  'irreecha-festival': {
    id: '2',
    title: 'Irreecha: The Oromo Thanksgiving Festival',
    slug: 'irreecha-festival',
    summary: 'Irreecha is the most important annual Oromo thanksgiving holiday.',
    content: `## What is Irreecha?

Irreecha (also spelled Irreessa) is the most important annual Oromo thanksgiving holiday celebrated at the beginning of spring (Birraa). It marks the end of the rainy season and thanks Waaqa (God) for the blessings of the past year.

## Historical Significance

Irreecha has been celebrated for thousands of years by the Oromo people. It represents:

- Gratitude to Waaqa for peace, fertility, and prosperity
- The renewal of nature and human relationships
- The coming together of Oromo communities from all regions

## When is Irreecha Celebrated?

Irreecha is celebrated in late September or early October, coinciding with the end of the Ethiopian rainy season. The main celebration takes place at:

- **Lake Hora Harsadi** in Bishoftu (Debre Zeit) - the largest gathering
- Various lakes and rivers throughout Oromia

## The Celebration

### Traditional Elements

The celebration includes several key elements:

- **Malkaa** - Gathering at water bodies (lakes, rivers)
- **Irreeffachuu** - The act of giving thanks
- **Eebba** - Blessings from elders
- **Sirba** - Traditional songs and dances

### What People Carry

Participants carry symbolic items:

- **Fresh green grass (Coqorsa)** - Symbol of fertility and new life
- **Yellow flowers (Adey Abeba)** - Symbol of the new season
- **Traditional Oromo attire** - Cultural identity

## Cultural Importance

Irreecha is more than just a religious celebration. It serves as:

- A time for reconciliation and peace-making
- An occasion for strengthening community bonds
- A celebration of Oromo identity and culture
- A gathering of Oromo from the diaspora

## Modern Celebrations

In recent years, Irreecha has grown to become one of the largest annual gatherings in Africa, with millions of Oromo people participating. The celebration has also spread to Oromo diaspora communities worldwide.

## Conclusion

Irreecha embodies the Oromo values of gratitude, community, and connection to nature. It remains a powerful expression of Oromo cultural identity and spirituality.`,
    category: 'Culture',
    category_slug: 'culture',
    author_name: 'Fatuma Ahmed',
    is_featured: true,
    view_count: 980,
    created_at: '2024-01-12',
    updated_at: '2024-01-18',
  },
  'qubee-alphabet': {
    id: '3',
    title: 'Introduction to Qubee: The Oromo Alphabet',
    slug: 'qubee-alphabet',
    summary: 'Qubee is the Latin-based writing system adopted for Afaan Oromoo.',
    content: `## What is Qubee?

Qubee is the Latin-based alphabet used to write Afaan Oromoo (the Oromo language). It was officially adopted in 1991 after the fall of the Derg regime, replacing the Ge'ez (Ethiopic) script that had been imposed on the language.

## History of Qubee

### Before Qubee

Prior to 1991, Afaan Oromoo was written using:
- The Ge'ez script (forced adoption under Haile Selassie and Derg regimes)
- Various Latin-based systems developed by missionaries and scholars

### Adoption of Qubee

The modern Qubee alphabet was:
- Standardized by the Oromo Liberation Front (OLF) in the 1970s
- Based on earlier Latin-based orthographies
- Officially adopted in Oromia in 1991

## The Qubee Alphabet

### Basic Letters

Qubee uses 33 letters:

| Qubee | Sound |
|-------|-------|
| A a | as in "father" |
| B b | as in "boy" |
| C c | ch as in "church" |
| D d | as in "dog" |
| E e | as in "bed" |
| F f | as in "fan" |
| G g | as in "go" |
| H h | as in "hat" |
| I i | ee as in "see" |
| J j | as in "jam" |
| K k | as in "king" |
| L l | as in "love" |
| M m | as in "man" |
| N n | as in "no" |
| O o | as in "open" |
| P p | as in "pen" |
| Q q | glottal stop |
| R r | as in "run" |
| S s | as in "sun" |
| T t | as in "top" |
| U u | oo as in "food" |
| V v | as in "van" |
| W w | as in "water" |
| X x | t' (ejective t) |
| Y y | as in "yes" |
| Z z | as in "zero" |

### Special Characters

Qubee includes special characters for sounds unique to Oromo:
- **CH** - as in "church"
- **DH** - implosive d
- **NY** - as in "canyon"
- **PH** - aspirated p
- **SH** - as in "ship"

## Vowel Length

In Oromo, vowel length is significant and changes meaning:
- **Short vowels**: a, e, i, o, u
- **Long vowels**: aa, ee, ii, oo, uu

Example:
- **lafa** = earth
- **laafaa** = soft

## Importance of Qubee

The adoption of Qubee was significant because:

- It made reading and writing Oromo much easier
- It helped preserve Oromo literature and culture
- It enabled mass literacy in Afaan Oromoo
- It strengthened Oromo cultural identity

## Conclusion

Qubee represents a crucial step in the preservation and promotion of Afaan Oromoo. It enables millions of Oromo speakers to read and write their language easily and has contributed significantly to the growth of Oromo literature and education.`,
    category: 'Language',
    category_slug: 'language',
    author_name: 'Chaltu Negasa',
    is_featured: true,
    view_count: 1100,
    created_at: '2024-01-10',
    updated_at: '2024-01-15',
  },
}

// Mock flashcards for articles
const mockFlashcards: Record<string, Array<{ id: string; term: string; definition: string }>> = {
  'gadaa-system': [
    { id: '1', term: 'Gadaa', definition: 'The indigenous democratic socio-political system of the Oromo people' },
    { id: '2', term: 'Abba Gadaa', definition: 'The democratically elected leader who presides over the Gadaa assembly' },
    { id: '3', term: 'Gumi Gayo', definition: 'The legislative assembly in the Gadaa system' },
    { id: '4', term: 'Seera', definition: 'The primary laws in the Gadaa system' },
    { id: '5', term: 'Heera', definition: 'The bylaws that supplement Seera in Gadaa governance' },
    { id: '6', term: 'Hiriya', definition: 'Age sets that pass through Gadaa grades' },
    { id: '7', term: 'Dabballee', definition: 'First Gadaa grade for children aged 0-8 years' },
    { id: '8', term: 'Kuusa', definition: 'Fourth Gadaa grade (24-32 years) for preparation for leadership' },
  ],
  'irreecha-festival': [
    { id: '1', term: 'Irreecha', definition: 'The most important annual Oromo thanksgiving festival' },
    { id: '2', term: 'Birraa', definition: 'The spring season when Irreecha is celebrated' },
    { id: '3', term: 'Waaqa', definition: 'The Oromo word for God' },
    { id: '4', term: 'Malkaa', definition: 'The gathering at water bodies during Irreecha' },
    { id: '5', term: 'Coqorsa', definition: 'Fresh green grass carried as a symbol of fertility' },
    { id: '6', term: 'Adey Abeba', definition: 'Yellow flowers symbolizing the new season' },
    { id: '7', term: 'Eebba', definition: 'Blessings given by elders during Irreecha' },
    { id: '8', term: 'Lake Hora Harsadi', definition: 'The main gathering place for Irreecha in Bishoftu' },
  ],
  'qubee-alphabet': [
    { id: '1', term: 'Qubee', definition: 'The Latin-based alphabet used to write Afaan Oromoo' },
    { id: '2', term: 'Afaan Oromoo', definition: 'The Oromo language' },
    { id: '3', term: "Ge'ez Script", definition: 'The Ethiopic script that was replaced by Qubee in 1991' },
    { id: '4', term: 'Long Vowels', definition: 'Vowels written as aa, ee, ii, oo, uu that change word meaning' },
    { id: '5', term: 'Ejective', definition: 'A consonant sound produced with a burst of air (like X in Qubee)' },
    { id: '6', term: 'Implosive D', definition: 'The DH sound in Qubee, unique to Oromo' },
    { id: '7', term: '33 Letters', definition: 'The number of letters in the Qubee alphabet' },
    { id: '8', term: '1991', definition: 'The year Qubee was officially adopted in Oromia' },
  ],
}

// Mock quiz questions
const mockQuizQuestions: Record<string, Array<{
  id: string
  question: string
  correct_answer: string
  wrong_answers: string[]
  explanation: string
}>> = {
  'gadaa-system': [
    {
      id: '1',
      question: 'How long is the term of an Abba Gadaa?',
      correct_answer: '8 years',
      wrong_answers: ['4 years', '10 years', '6 years'],
      explanation: 'The Abba Gadaa serves a non-renewable eight-year term as the leader of the Gadaa assembly.',
    },
    {
      id: '2',
      question: 'In what year was the Gadaa system inscribed by UNESCO as Intangible Cultural Heritage?',
      correct_answer: '2016',
      wrong_answers: ['2010', '2018', '2012'],
      explanation: 'UNESCO recognized the Gadaa system in 2016 for its significance as a living cultural tradition.',
    },
    {
      id: '3',
      question: 'What is the Oromo legislative assembly called?',
      correct_answer: 'Gumi Gayo',
      wrong_answers: ['Seera', 'Hiriya', 'Heera'],
      explanation: 'Gumi Gayo is the legislative assembly where laws are discussed and the Abba Gadaa presides.',
    },
    {
      id: '4',
      question: 'How many grades does the Gadaa system have?',
      correct_answer: '5 grades',
      wrong_answers: ['3 grades', '7 grades', '4 grades'],
      explanation: 'The Gadaa system has 5 grades: Dabballee, Folle/Gamme, Qondaala, Kuusa, and Gadaa.',
    },
    {
      id: '5',
      question: 'What is the complete Gadaa cycle in years?',
      correct_answer: '40 years',
      wrong_answers: ['20 years', '50 years', '30 years'],
      explanation: 'Males pass through all five Gadaa grades over a complete 40-year cycle.',
    },
  ],
  'irreecha-festival': [
    {
      id: '1',
      question: 'When is Irreecha celebrated?',
      correct_answer: 'Late September or early October',
      wrong_answers: ['January', 'June', 'March'],
      explanation: 'Irreecha marks the end of the rainy season and is celebrated in late September or early October.',
    },
    {
      id: '2',
      question: 'What does the fresh green grass (Coqorsa) symbolize?',
      correct_answer: 'Fertility and new life',
      wrong_answers: ['Wealth', 'Wisdom', 'Strength'],
      explanation: 'Coqorsa (fresh green grass) is carried as a symbol of fertility and new life.',
    },
    {
      id: '3',
      question: 'Where is the largest Irreecha celebration held?',
      correct_answer: 'Lake Hora Harsadi in Bishoftu',
      wrong_answers: ['Addis Ababa', 'Jimma', 'Harar'],
      explanation: 'The largest Irreecha gathering takes place at Lake Hora Harsadi in Bishoftu (Debre Zeit).',
    },
    {
      id: '4',
      question: 'What are the yellow flowers carried during Irreecha called?',
      correct_answer: 'Adey Abeba',
      wrong_answers: ['Coqorsa', 'Malkaa', 'Birraa'],
      explanation: 'Adey Abeba (yellow flowers) symbolize the new season during Irreecha.',
    },
  ],
  'qubee-alphabet': [
    {
      id: '1',
      question: 'When was Qubee officially adopted in Oromia?',
      correct_answer: '1991',
      wrong_answers: ['1985', '2000', '1975'],
      explanation: 'Qubee was officially adopted in 1991 after the fall of the Derg regime.',
    },
    {
      id: '2',
      question: 'How many letters are in the Qubee alphabet?',
      correct_answer: '33',
      wrong_answers: ['26', '28', '40'],
      explanation: 'The Qubee alphabet consists of 33 letters.',
    },
    {
      id: '3',
      question: 'What script did Qubee replace?',
      correct_answer: "Ge'ez (Ethiopic) script",
      wrong_answers: ['Arabic script', 'Cyrillic script', 'Greek script'],
      explanation: "Qubee replaced the Ge'ez (Ethiopic) script that had been imposed on the Oromo language.",
    },
    {
      id: '4',
      question: 'How are long vowels written in Qubee?',
      correct_answer: 'By doubling the vowel (aa, ee, ii, oo, uu)',
      wrong_answers: ['With an accent mark', 'With a tilde', 'With a circumflex'],
      explanation: 'Long vowels in Qubee are written by doubling: aa, ee, ii, oo, uu.',
    },
  ],
}

// Mock related articles
const mockRelatedArticles: Record<string, Array<{ id: string; title: string; slug: string; summary: string; category: string }>> = {
  'gadaa-system': [
    { id: '2', title: 'Abba Gadaa: Leadership in Oromo Society', slug: 'abba-gadaa', summary: 'The Abba Gadaa is the elected leader of the Gadaa assembly.', category: 'History' },
    { id: '3', title: 'Gumi Gayo: The Legislative Assembly', slug: 'gumi-gayo', summary: 'Understanding the Oromo legislative tradition.', category: 'History' },
    { id: '4', title: 'Irreecha and the Gadaa Calendar', slug: 'irreecha-gadaa', summary: 'How Irreecha relates to the Gadaa cycle.', category: 'Culture' },
  ],
  'irreecha-festival': [
    { id: '1', title: 'The Gadaa System', slug: 'gadaa-system', summary: 'Ancient democratic governance of the Oromo.', category: 'History' },
    { id: '3', title: 'Waaqeffanna: Traditional Religion', slug: 'waaqeffanna', summary: 'The traditional Oromo religion.', category: 'Culture' },
    { id: '4', title: 'Oromo Coffee Ceremony', slug: 'coffee-ceremony', summary: 'The cultural significance of coffee.', category: 'Culture' },
  ],
  'qubee-alphabet': [
    { id: '2', title: 'Oromo Proverbs', slug: 'oromo-proverbs', summary: 'Traditional wisdom in Afaan Oromoo.', category: 'Language' },
    { id: '3', title: 'Learning Afaan Oromoo', slug: 'learning-oromo', summary: 'A guide to learning the Oromo language.', category: 'Language' },
    { id: '4', title: 'Oromo Literature', slug: 'oromo-literature', summary: 'The rich literary tradition of the Oromo.', category: 'Language' },
  ],
}

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function WikiArticlePage({ params }: PageProps) {
  const { slug } = await params
  const supabase = await createClient()

  // Try to fetch from database first
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: dbArticle } = await (supabase as any)
    .from('wiki_articles')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single()

  // Use mock data if no database result
  const mockArticle = mockArticles[slug]

  if (!dbArticle && !mockArticle) {
    notFound()
  }

  // Format article data
  const article = dbArticle || {
    ...mockArticle,
    wiki_categories: { name: mockArticle.category, slug: mockArticle.category_slug, icon: '📚' },
  }

  // Get flashcards (mock for now)
  const flashcards = mockFlashcards[slug] || []

  // Get quiz questions (mock for now)
  const quizQuestions = mockQuizQuestions[slug] || []

  // Get related articles (mock for now)
  const relatedArticles = mockRelatedArticles[slug] || []

  return (
    <div className="min-h-screen flex flex-col bg-slate-900">
      <Header />

      <main className="flex-1">
        <WikiArticleContent
          article={article}
          flashcards={flashcards}
          quizQuestions={quizQuestions}
          relatedArticles={relatedArticles}
        />
      </main>

      <Footer />
    </div>
  )
}
