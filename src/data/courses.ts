// Seed data for Academy courses

export interface Lesson {
  id: string
  title: string
  description: string
  duration: string
  video_url: string | null
  content: string
  order_index: number
  is_published: boolean
}

export interface Course {
  id: string
  title: string
  slug: string
  description: string
  long_description: string
  thumbnail_url: string
  category: 'language' | 'history' | 'business' | 'technology' | 'career'
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  instructor: {
    name: string
    title: string
    avatar: string
  }
  duration: string
  lessons_count: number
  enrolled_count: number
  rating: number
  is_published: boolean
  is_featured: boolean
  lessons: Lesson[]
  what_youll_learn: string[]
  requirements: string[]
  created_at: string
}

export const courses: Course[] = [
  {
    id: 'course-afaan-oromo-beginners',
    title: 'Afaan Oromo for Beginners',
    slug: 'afaan-oromo-beginners',
    description: 'Start your journey learning Afaan Oromo from scratch. Master basic vocabulary, greetings, and conversational skills.',
    long_description: `Welcome to the most comprehensive beginner's course for Afaan Oromo! Whether you're reconnecting with your heritage, preparing to visit Oromia, or simply curious about one of Africa's most spoken languages, this course will give you a solid foundation.

Afaan Oromo is spoken by over 50 million people, making it one of the most widely spoken languages in Africa. This course takes you step-by-step through the fundamentals, from the Qubee alphabet to forming complete sentences.

By the end of this course, you'll be able to introduce yourself, have basic conversations, and understand essential Oromo cultural contexts.`,
    thumbnail_url: '/images/courses/afaan-oromo-beginners.jpg',
    category: 'language',
    difficulty: 'beginner',
    instructor: {
      name: 'Chaltu Bekele',
      title: 'Oromo Language Instructor',
      avatar: '/images/instructors/chaltu.jpg'
    },
    duration: '8 hours',
    lessons_count: 10,
    enrolled_count: 2847,
    rating: 4.9,
    is_published: true,
    is_featured: true,
    what_youll_learn: [
      'Master the Qubee (Oromo alphabet) with proper pronunciation',
      'Learn essential greetings and introductions',
      'Build vocabulary for everyday situations',
      'Understand basic grammar structures',
      'Practice conversational phrases for real-life use',
      'Gain cultural insights that enhance language learning'
    ],
    requirements: [
      'No prior knowledge of Oromo required',
      'A notebook for practice',
      'Willingness to practice pronunciation out loud'
    ],
    created_at: '2024-01-15T00:00:00Z',
    lessons: [
      {
        id: 'lesson-ao-1',
        title: 'Introduction to Qubee (Oromo Alphabet)',
        description: 'Learn the 33 letters of the Qubee alphabet and their sounds.',
        duration: '45 min',
        video_url: 'https://youtube.com/watch?v=example1',
        content: `# Introduction to Qubee

The Qubee is the official writing system for Afaan Oromo, adopted in 1991. It uses Latin letters with some modifications to represent unique Oromo sounds.

## The 33 Letters

The Qubee consists of 33 letters:
- 5 vowels: a, e, i, o, u
- 28 consonants including special combinations

## Vowel Sounds

| Letter | Sound | Example Word |
|--------|-------|--------------|
| A, a | like 'a' in 'father' | abbaa (father) |
| E, e | like 'e' in 'bet' | eeboo (spear) |
| I, i | like 'ee' in 'see' | ilma (son) |
| O, o | like 'o' in 'go' | obboleessa (brother) |
| U, u | like 'oo' in 'food' | ulee (stick) |

## Practice Exercise
Listen and repeat each vowel sound 5 times, paying attention to mouth position.`,
        order_index: 1,
        is_published: true
      },
      {
        id: 'lesson-ao-2',
        title: 'Greetings and Introductions',
        description: 'Master common greetings and how to introduce yourself in Oromo.',
        duration: '50 min',
        video_url: 'https://youtube.com/watch?v=example2',
        content: `# Greetings in Afaan Oromo

Greetings are an essential part of Oromo culture. Proper greetings show respect and build relationships.

## Common Greetings

| Oromo | English | When to Use |
|-------|---------|-------------|
| Akkam? | How are you? | General greeting |
| Nagaa | Peace/Hello | Any time |
| Akkam bulte? | How did you sleep? | Morning |
| Akkam oolte? | How was your day? | Afternoon/Evening |
| Nagaatti | Goodbye | When leaving |

## Responses

- **Nagaa** - I'm at peace (I'm fine)
- **Fayyaa dha** - I'm healthy
- **Gaarii dha** - I'm good

## Introducing Yourself

**Maqaan koo ___ dha.**
"My name is ___."

**Ani ___ irraa dhufe/dhufte.**
"I came from ___." (male/female)`,
        order_index: 2,
        is_published: true
      },
      {
        id: 'lesson-ao-3',
        title: 'Numbers 1-100',
        description: 'Learn to count and use numbers in everyday contexts.',
        duration: '40 min',
        video_url: 'https://youtube.com/watch?v=example3',
        content: `# Numbers in Afaan Oromo

## Numbers 1-10

| Number | Oromo |
|--------|-------|
| 1 | tokko |
| 2 | lama |
| 3 | sadii |
| 4 | afur |
| 5 | shan |
| 6 | jaha |
| 7 | torba |
| 8 | saddeet |
| 9 | sagal |
| 10 | kudhan |

## Numbers 11-20

11-19 follow the pattern: kudhan + unit
- 11: kudha tokko
- 12: kudha lama
- 15: kudha shan

20 is: digdama

## Tens

| Number | Oromo |
|--------|-------|
| 20 | digdama |
| 30 | soddoma |
| 40 | afurtama |
| 50 | shantama |
| 100 | dhibba |`,
        order_index: 3,
        is_published: true
      },
      {
        id: 'lesson-ao-4',
        title: 'Family Members',
        description: 'Learn vocabulary for family relationships and practice describing your family.',
        duration: '45 min',
        video_url: 'https://youtube.com/watch?v=example4',
        content: `# Family Vocabulary

Family (maatii) is central to Oromo culture. Let's learn the terms for family members.

## Immediate Family

| Oromo | English |
|-------|---------|
| abbaa | father |
| haadha | mother |
| ilma | son |
| intala | daughter |
| obboleessa | brother |
| obboleettii | sister |

## Extended Family

| Oromo | English |
|-------|---------|
| akaakuu/akaakoo | grandfather |
| akkoo | grandmother |
| eessuma | uncle (mother's side) |
| adaadaa | aunt (father's side) |
| ilma obboleessa | nephew |
| intala obboleettii | niece |

## Practice Sentences

**Maatii koo keessaa namni shan jiru.**
"There are five people in my family."

**Obboleessa lama fi obboleettii tokko qaba.**
"I have two brothers and one sister."`,
        order_index: 4,
        is_published: true
      },
      {
        id: 'lesson-ao-5',
        title: 'Colors and Descriptions',
        description: 'Learn color words and how to describe objects in Oromo.',
        duration: '40 min',
        video_url: 'https://youtube.com/watch?v=example5',
        content: `# Colors (Halluu)

## Basic Colors

| Oromo | English |
|-------|---------|
| adii | white |
| gurraacha | black |
| diimaa | red |
| magariisa | green |
| cuquliisa | blue |
| keelloo | yellow |
| burtukaana | orange |
| booraa/daalachaa | gray |

## Using Colors in Sentences

Colors come AFTER the noun in Oromo:

**Konkolaataan diimaa** - The red car
**Mana adii** - The white house
**Baallee magariisa** - Green leaves

## Describing Things

| Oromo | English |
|-------|---------|
| guddaa | big |
| xiqqaa | small |
| dheeraa | tall/long |
| gabaabaa | short |
| haaraa | new |
| moofaa | old |`,
        order_index: 5,
        is_published: true
      },
      {
        id: 'lesson-ao-6',
        title: 'Food and Dining',
        description: 'Essential vocabulary for food, meals, and dining experiences.',
        duration: '50 min',
        video_url: 'https://youtube.com/watch?v=example6',
        content: `# Food Vocabulary (Nyaata)

## Common Foods

| Oromo | English |
|-------|---------|
| buddeena | injera (traditional bread) |
| foon | meat |
| marqaa | porridge |
| aannan | milk |
| damma | honey |
| boqqolloo | corn |
| qamadii | wheat |
| atara | peas |

## Meals

| Oromo | English |
|-------|---------|
| ciree | breakfast |
| laaqana | lunch |
| irbaata | dinner |

## Useful Phrases

**Nyaata barbaada** - I want food
**Beela'e** - I'm hungry
**Dheebodhe** - I'm thirsty
**Galatoomaa** - Thank you (after eating)

## At a Restaurant

**Maal qabdu?** - What do you have?
**Kana naaf kenni** - Give me this
**Hagam ta'a?** - How much is it?`,
        order_index: 6,
        is_published: true
      },
      {
        id: 'lesson-ao-7',
        title: 'Days, Months, and Time',
        description: 'Learn to talk about time, days of the week, and months.',
        duration: '45 min',
        video_url: 'https://youtube.com/watch?v=example7',
        content: `# Time Expressions

## Days of the Week

| Oromo | English |
|-------|---------|
| Dilbata | Sunday |
| Wiixata | Monday |
| Kibxata | Tuesday |
| Roobii | Wednesday |
| Kamisa | Thursday |
| Jimaata | Friday |
| Sanbata | Saturday |

## Months

Traditional Oromo months follow a lunar calendar, but modern usage also includes:

| Oromo | English |
|-------|---------|
| Amajjii | January |
| Guraandhala | February |
| Bitootessa | March |
| Eebla | April |
| Caamsaa | May |
| Waxabajjii | June |

## Telling Time

**Sa'aatiin meeqa?** - What time is it?
**Sa'aatii lama** - It's 2 o'clock
**Ganama** - Morning
**Guyyaa** - Daytime
**Galgala** - Evening
**Halkan** - Night`,
        order_index: 7,
        is_published: true
      },
      {
        id: 'lesson-ao-8',
        title: 'Verbs and Basic Sentences',
        description: 'Understand Oromo verb structure and create simple sentences.',
        duration: '55 min',
        video_url: 'https://youtube.com/watch?v=example8',
        content: `# Oromo Verb Basics

Oromo is an SOV (Subject-Object-Verb) language. The verb comes at the end of the sentence.

## Common Verbs

| Oromo | English |
|-------|---------|
| dhufuu | to come |
| deemuu | to go |
| nyaachuu | to eat |
| dhuguu | to drink |
| rafuu | to sleep |
| dubbisuu | to read |
| barreessuu | to write |
| hojjechuu | to work |

## Present Tense Conjugation

Using "dhufuu" (to come):

| Pronoun | Conjugation |
|---------|-------------|
| Ani (I) | dhufa |
| Ati (You) | dhufta |
| Inni (He) | dhufa |
| Isheen (She) | dhufti |
| Nu (We) | dhufna |
| Isaan (They) | dhufu |

## Example Sentences

**Ani mana deema** - I go home
**Isheen nyaata nyaatti** - She eats food
**Isaan kitaaba dubbisu** - They read a book`,
        order_index: 8,
        is_published: true
      },
      {
        id: 'lesson-ao-9',
        title: 'Questions and Conversations',
        description: 'Learn to ask questions and have simple conversations.',
        duration: '50 min',
        video_url: 'https://youtube.com/watch?v=example9',
        content: `# Asking Questions

## Question Words

| Oromo | English |
|-------|---------|
| Eenyu? | Who? |
| Maal? | What? |
| Eessa? | Where? |
| Yoom? | When? |
| Maaliif? | Why? |
| Akkam? | How? |
| Meeqa? | How many/much? |

## Forming Questions

Add question markers or use rising intonation:

**Mana deemta?** - Are you going home?
**Eessa jiraatta?** - Where do you live?
**Maal hojjetta?** - What do you do?

## Practice Conversation

A: Akkam?
B: Nagaa, ati hoo?
A: Gaarii dha. Maqaan kee eenyu?
B: Maqaan koo Abdii. Kan kee hoo?
A: Ani Caaltuu. Eessa jiraatta?
B: Finfinnee jiraadha.

## Translation

A: How are you?
B: I'm at peace, and you?
A: I'm good. What is your name?
B: My name is Abdi. And yours?
A: I'm Chaltu. Where do you live?
B: I live in Addis Ababa.`,
        order_index: 9,
        is_published: true
      },
      {
        id: 'lesson-ao-10',
        title: 'Cultural Context and Review',
        description: 'Understand cultural nuances and review everything learned.',
        duration: '60 min',
        video_url: 'https://youtube.com/watch?v=example10',
        content: `# Cultural Context

Understanding Oromo culture enhances your language learning.

## Oromo Values

**Safuu** - The moral and ethical code of the Oromo people. It governs proper behavior and respect in society.

**Nagaa** - Peace is central to Oromo greetings and way of life.

**Gadaa** - The democratic system of governance that has guided Oromo society for centuries.

## Cultural Phrases

| Oromo | Meaning |
|-------|---------|
| Waaqa galata | Thank God |
| Yaa Rabbii | Oh God (expression) |
| Araaraa | Reconciliation |
| Guddifachaa | Adoption/fostering tradition |

## Respect in Language

- Use polite forms when speaking to elders
- Add "obbo" (Mr.) or "aaddee" (Mrs.) before names
- Greetings are never rushed - take time to inquire about family

## Course Review

Congratulations on completing this course! You have learned:
- The Qubee alphabet
- Essential greetings and introductions
- Numbers 1-100
- Family vocabulary
- Colors and descriptions
- Food and dining
- Time expressions
- Basic verb conjugation
- Question formation
- Cultural context

**Next Steps:** Practice daily, find a conversation partner, and consider our Intermediate Oromo course!`,
        order_index: 10,
        is_published: true
      }
    ]
  },
  {
    id: 'course-oromo-history-101',
    title: 'Oromo History 101',
    slug: 'oromo-history-101',
    description: 'Explore the rich history of the Oromo people from ancient times to the present day.',
    long_description: `Discover the fascinating history of the Oromo people, one of the largest ethnic groups in Africa. This course takes you on a journey through thousands of years of Oromo civilization, from the origins of the Gadaa system to the modern diaspora.

You'll learn about the democratic institutions that governed Oromo society long before Western democracy, the resistance movements against colonization, and the vibrant cultural traditions that have persisted through centuries of change.

Whether you're of Oromo heritage seeking to reconnect with your roots, or simply curious about African history, this course provides essential knowledge about a people whose story deserves to be told.`,
    thumbnail_url: '/images/courses/oromo-history.jpg',
    category: 'history',
    difficulty: 'beginner',
    instructor: {
      name: 'Dr. Galmoo Boruu',
      title: 'Professor of Oromo Studies',
      avatar: '/images/instructors/galmoo.jpg'
    },
    duration: '6 hours',
    lessons_count: 8,
    enrolled_count: 1923,
    rating: 4.8,
    is_published: true,
    is_featured: true,
    what_youll_learn: [
      'Understand the origins and early history of the Oromo people',
      'Learn about the Gadaa system of democratic governance',
      'Explore key historical figures and their contributions',
      'Understand the impact of colonization and resistance movements',
      'Trace the development of Oromo nationalism',
      'Learn about the global Oromo diaspora today'
    ],
    requirements: [
      'No prerequisites required',
      'Interest in African history',
      'Willingness to engage with complex historical narratives'
    ],
    created_at: '2024-02-01T00:00:00Z',
    lessons: [
      {
        id: 'lesson-oh-1',
        title: 'Origins of the Oromo People',
        description: 'Explore the ancient origins and early migrations of the Oromo.',
        duration: '45 min',
        video_url: 'https://youtube.com/watch?v=history1',
        content: `# Origins of the Oromo People

## Who Are the Oromo?

The Oromo are one of the largest ethnic groups in Africa, with an estimated population of over 50 million people. The majority live in Ethiopia, in the region known as Oromia, while significant diaspora communities exist worldwide.

## Ancient Origins

The Oromo people have inhabited the Horn of Africa for thousands of years. While exact origins are debated among historians, evidence suggests:

- Oromo presence in the region dates back at least 5,000 years
- The term "Oromo" means "the people" or "the free people"
- Traditional oral histories trace ancestry to a common father figure

## Early Society

Early Oromo society was characterized by:
- Pastoral and agricultural lifestyles
- Strong clan (gosa) structures
- The development of the Gadaa system
- Rich oral traditions and cultural practices

## Geographic Spread

Historically, Oromo territory has included:
- The highlands of Ethiopia
- Parts of modern-day Kenya
- Regions extending toward the Somali territories

The Oromo homeland, Oromia, remains the largest region in Ethiopia today.`,
        order_index: 1,
        is_published: true
      },
      {
        id: 'lesson-oh-2',
        title: 'The Gadaa System',
        description: 'Deep dive into the democratic Gadaa system of governance.',
        duration: '50 min',
        video_url: 'https://youtube.com/watch?v=history2',
        content: `# The Gadaa System

## What is Gadaa?

Gadaa is an indigenous democratic socio-political system that has governed Oromo society for centuries. In 2016, UNESCO inscribed Gadaa on the Representative List of the Intangible Cultural Heritage of Humanity.

## Structure and Function

The Gadaa system divides society into generational classes that rotate power every 8 years:

### The Five Grades (Parties)
1. **Qondaala** - Leaders in waiting
2. **Kuusa** - Senior counselors
3. **Raaba Doorii** - Junior counselors
4. **Gadaa** - Ruling class
5. **Luba** - Retired leaders

## Democratic Principles

The Gadaa system embodies remarkable democratic values:
- **Term limits**: No leader serves more than 8 years
- **Separation of powers**: Different roles have distinct functions
- **Checks and balances**: Assembly (Caffee) has oversight power
- **Peaceful transfer**: Power transfers through ceremony, not conflict

## The Assembly (Caffee)

The Caffee is the supreme legislative body where:
- Laws are debated and passed
- Leaders are held accountable
- Major decisions affecting society are made
- All adult males can participate

## Legacy

The Gadaa system demonstrates that democratic governance is not exclusively a Western invention, but emerged independently in African societies.`,
        order_index: 2,
        is_published: true
      },
      {
        id: 'lesson-oh-3',
        title: 'Oromo Expansion (16th-17th Century)',
        description: 'The great Oromo migrations and territorial expansion.',
        duration: '45 min',
        video_url: 'https://youtube.com/watch?v=history3',
        content: `# The Great Oromo Expansion

## Historical Context

The 16th and 17th centuries saw significant Oromo population movements across the Horn of Africa, often called the "Oromo Expansion" or "Oromo Migration."

## Causes of Expansion

Several factors contributed:
- Population growth
- Search for new pastures and farmland
- The weakening of neighboring states
- The aftermath of the Adal-Ethiopian War

## Impact on the Region

The expansion reshaped the demographics of the Horn:
- Oromo became the dominant group in vast territories
- Integration with local populations occurred
- New political entities emerged
- Cultural exchange enriched all societies

## Military Organization

The success of the expansion was aided by:
- Highly mobile cavalry forces
- The cohesive structure provided by Gadaa
- Strategic flexibility and adaptation
- Integration of conquered peoples

## Different Perspectives

It's important to understand various historical interpretations:
- Some view this as military conquest
- Others emphasize peaceful settlement
- Modern scholarship recognizes complexity
- Oromo oral traditions offer valuable perspectives

## Outcome

By the 18th century, Oromo people had established themselves across a vast territory, from the lowlands to the Ethiopian highlands.`,
        order_index: 3,
        is_published: true
      },
      {
        id: 'lesson-oh-4',
        title: 'Oromo Kingdoms and States',
        description: 'Learn about the various Oromo kingdoms and confederations.',
        duration: '45 min',
        video_url: 'https://youtube.com/watch?v=history4',
        content: `# Oromo Kingdoms and States

## The Gibe States

Several Oromo monarchies emerged in southwestern Ethiopia:

### Kingdom of Jimma
- Founded in the early 19th century
- Major trade center connecting coast to interior
- Prosperous economy based on coffee and trade
- Sophisticated court culture

### Kingdom of Kaffa
- Known for coffee cultivation (word "coffee" derives from Kaffa)
- Complex political structure
- Rich agricultural traditions

### Other Gibe States
- Gera, Gomma, Guma, and Limmu
- Each with distinct characteristics
- Connected through trade networks

## Wallo Oromo

The Wallo (Wollo) Oromo in northern Ethiopia:
- Significant political influence in imperial Ethiopia
- Several became emperors of Ethiopia
- Blended Oromo and Amhara cultural elements

## Rayyaa and Azebo

Eastern Tigray region:
- Maintained distinct identity
- Pastoral traditions
- Important in regional politics

## Legacy

These states demonstrated Oromo capacity for:
- Centralized governance
- Economic development
- Cultural achievement
- Diplomatic relations

The diversity of political forms shows the adaptability of Oromo society.`,
        order_index: 4,
        is_published: true
      },
      {
        id: 'lesson-oh-5',
        title: 'Conquest and Resistance (1880s-1900s)',
        description: 'The period of Ethiopian conquest and Oromo resistance.',
        duration: '50 min',
        video_url: 'https://youtube.com/watch?v=history5',
        content: `# Conquest and Resistance

## The Scramble for Africa

The late 19th century saw European powers colonizing Africa. Ethiopia, under Emperor Menelik II, expanded southward into Oromo territories.

## Menelik's Campaigns

The incorporation of Oromo lands (1880s-1900s):
- Well-armed Ethiopian forces moved south
- Modern weapons obtained from Europeans
- Resistance was fierce but ultimately unsuccessful
- Devastating loss of life and property

## Impact on Oromo Society

The conquest had profound effects:
- Loss of political autonomy
- Land confiscation (gabbar system)
- Suppression of language and culture
- Disruption of the Gadaa system
- Economic exploitation

## Resistance Movements

Oromo people never accepted subjugation quietly:

### Armed Resistance
- Numerous uprisings throughout the period
- Leaders like Tulu Milkoo became heroes
- Guerrilla tactics employed

### Cultural Resistance
- Preservation of language in homes
- Continued practice of traditions
- Oral histories maintained identity

## The Nafxanya System

The settler-colonial structure imposed:
- Northern settlers granted land
- Oromo reduced to tenants
- Tribute and labor requirements
- Cultural and religious suppression

This period fundamentally shaped modern Oromo political consciousness.`,
        order_index: 5,
        is_published: true
      },
      {
        id: 'lesson-oh-6',
        title: 'Oromo in the 20th Century',
        description: 'From Italian occupation through the imperial and military regimes.',
        duration: '50 min',
        video_url: 'https://youtube.com/watch?v=history6',
        content: `# The 20th Century Experience

## Italian Occupation (1936-1941)

The brief Italian occupation had complex implications:
- Some saw Italians as liberators from Ethiopian rule
- Others resisted foreign invasion
- Disruption of existing power structures
- Return of Ethiopian rule brought renewed oppression

## Imperial Period (1941-1974)

Under Haile Selassie:
- Continued marginalization of Oromo people
- Amharic as sole official language
- Limited access to education
- Land remained in hands of settlers
- Growing dissatisfaction

## Early Oromo Movements

### Macha-Tulama Association (1963)
- First major Oromo civic organization
- Advocated for cultural and economic rights
- Suppressed by the government
- Leaders imprisoned, including General Tadesse Birru

### Early OLF
- Oromo Liberation Front founded in 1973
- Armed struggle for self-determination
- Became the main Oromo political movement

## The Derg Regime (1974-1991)

The military government:
- Land reform gave hope initially
- Massive human rights violations followed
- Red Terror claimed many lives
- War against various liberation movements
- Devastating famine (1983-1985)

## End of Derg

Coalition of movements, including OLF, overthrew the Derg in 1991.`,
        order_index: 6,
        is_published: true
      },
      {
        id: 'lesson-oh-7',
        title: 'Modern Oromo Political Movements',
        description: 'Contemporary politics and the struggle for rights.',
        duration: '45 min',
        video_url: 'https://youtube.com/watch?v=history7',
        content: `# Modern Political Developments

## The Transition Period (1991-1995)

After the fall of Derg:
- EPRDF coalition took power
- OLF briefly participated in government
- Ethnic federalism established
- Oromia region created
- OLF withdrew, citing fraud and repression

## EPRDF Era (1991-2018)

Under EPRDF rule:
- Federal structure gave some regional autonomy
- Oromo language (Afaan Oromo) gained official status in Oromia
- Economic development mixed with political repression
- Many Oromo leaders imprisoned
- Limited press freedom

## The Oromo Protests (2014-2018)

Massive popular uprising:
- Triggered by Addis Ababa expansion plan
- Millions participated
- Many killed, thousands imprisoned
- Eventually led to political change
- Showed power of nonviolent resistance

## Reform Period (2018-Present)

Historic changes:
- Abiy Ahmed became Prime Minister (first Oromo)
- Political prisoners released
- Exiled groups returned
- Nobel Peace Prize awarded (2019)
- Ongoing challenges and conflicts

## Current Situation

The situation remains complex:
- Greater freedom of expression
- Continued conflicts in various areas
- Diaspora engagement increasing
- Debates about the future of Ethiopia
- Growing Oromo cultural renaissance`,
        order_index: 7,
        is_published: true
      },
      {
        id: 'lesson-oh-8',
        title: 'The Global Oromo Diaspora',
        description: 'Oromo communities worldwide and their contributions.',
        duration: '40 min',
        video_url: 'https://youtube.com/watch?v=history8',
        content: `# The Global Oromo Diaspora

## Why Diaspora?

Oromo people have left their homeland due to:
- Political persecution
- Economic opportunities
- Education
- Family reunification
- War and conflict

## Major Diaspora Communities

### North America
- United States: ~500,000+ Oromo
- Major cities: Minneapolis, Washington DC, Seattle, Atlanta
- Canada: Growing community in Toronto, Ottawa

### Europe
- Germany: Largest European community
- United Kingdom, Norway, Sweden, Netherlands
- Political refugees since 1970s

### Middle East
- Saudi Arabia, UAE, Qatar
- Primarily labor migration
- Often challenging conditions

### Australia
- Melbourne and Sydney communities
- Growing second generation

## Diaspora Contributions

The diaspora plays vital roles:

### Economic
- Remittances support families
- Investment in homeland
- Business connections

### Political
- Advocacy for human rights
- Lobbying governments
- Media and information sharing

### Cultural
- Language preservation
- Cultural events and festivals
- Educating second generation

## Challenges

Diaspora communities face:
- Maintaining identity across generations
- Division between political factions
- Integration in host countries
- Connection with homeland

## Looking Forward

The diaspora continues to:
- Build institutions
- Support development
- Preserve culture
- Advocate for justice
- Bridge communities worldwide`,
        order_index: 8,
        is_published: true
      }
    ]
  },
  {
    id: 'course-business-english',
    title: 'Business English Essentials',
    slug: 'business-english',
    description: 'Master professional English communication for the workplace and career advancement.',
    long_description: `Elevate your professional communication with this comprehensive Business English course designed specifically for Oromo professionals and diaspora community members.

Whether you're preparing for job interviews, aiming for a promotion, or looking to communicate more effectively with international colleagues, this course covers everything you need to succeed in the modern workplace.

You'll learn practical skills including email writing, presentation delivery, meeting participation, and networking—all with real-world examples and exercises tailored to common professional scenarios.`,
    thumbnail_url: '/images/courses/business-english.jpg',
    category: 'business',
    difficulty: 'intermediate',
    instructor: {
      name: 'Sarah Mitchell',
      title: 'Corporate Communication Trainer',
      avatar: '/images/instructors/sarah.jpg'
    },
    duration: '5 hours',
    lessons_count: 6,
    enrolled_count: 1456,
    rating: 4.7,
    is_published: true,
    is_featured: false,
    what_youll_learn: [
      'Write professional emails that get results',
      'Deliver compelling presentations with confidence',
      'Participate effectively in meetings',
      'Master networking and small talk',
      'Handle job interviews professionally',
      'Develop executive presence in communication'
    ],
    requirements: [
      'Intermediate English proficiency',
      'Basic understanding of professional environments',
      'Access to a computer for practice exercises'
    ],
    created_at: '2024-02-15T00:00:00Z',
    lessons: [
      {
        id: 'lesson-be-1',
        title: 'Professional Email Writing',
        description: 'Master the art of clear, effective business emails.',
        duration: '50 min',
        video_url: 'https://youtube.com/watch?v=business1',
        content: `# Professional Email Writing

## Why Email Matters

Email remains the primary form of business communication. Well-written emails:
- Build professional credibility
- Get faster responses
- Prevent misunderstandings
- Create positive impressions

## Email Structure

### Subject Line
- Be specific and concise
- Include action required
- Good: "Meeting Request: Q4 Budget Review - Response Needed by Friday"
- Bad: "Question" or "Hello"

### Greeting
- Formal: "Dear Mr./Ms. [Last Name]"
- Semi-formal: "Hello [First Name]"
- For groups: "Dear Team" or "Hello Everyone"

### Opening
Get to the point quickly:
- "I'm writing to request..."
- "Following up on our conversation..."
- "I wanted to share..."

### Body
- One topic per email
- Short paragraphs (3-4 lines)
- Use bullet points for lists
- Be direct but polite

### Closing
- Clear call to action
- Deadline if needed
- Professional sign-off

## Common Phrases

| Purpose | Phrase |
|---------|--------|
| Requesting | "Could you please..." |
| Following up | "I wanted to check in on..." |
| Apologizing | "I apologize for..." |
| Thanking | "Thank you for your time..." |
| Declining | "Unfortunately, I'm unable to..." |

## Template Example

Subject: Project Update Request - Due Friday

Dear [Name],

I hope this email finds you well.

I'm writing to request an update on the marketing project status. Specifically, I need:
• Current progress percentage
• Any blockers or challenges
• Revised timeline if applicable

Could you please send this by Friday EOD? This will help us prepare for Monday's executive meeting.

Thank you for your prompt attention.

Best regards,
[Your name]`,
        order_index: 1,
        is_published: true
      },
      {
        id: 'lesson-be-2',
        title: 'Presentation Skills',
        description: 'Deliver impactful presentations that engage your audience.',
        duration: '55 min',
        video_url: 'https://youtube.com/watch?v=business2',
        content: `# Presentation Skills

## Preparation

### Know Your Audience
- What do they already know?
- What do they need to know?
- What are their concerns?
- How can you help them?

### Structure Your Content
1. **Opening** (10%) - Hook and preview
2. **Body** (80%) - Main points (3-5 max)
3. **Closing** (10%) - Summary and call to action

### The Rule of Three
People remember things in threes:
- "Three key factors..."
- "Let me share three examples..."
- "Our three priorities are..."

## Delivery Techniques

### Voice
- Vary your pace
- Use strategic pauses
- Project confidence
- Avoid filler words (um, uh, like)

### Body Language
- Stand tall, shoulders back
- Make eye contact
- Use purposeful gestures
- Move with intention

### Managing Nerves
- Practice extensively
- Breathe deeply before starting
- Arrive early to familiarize yourself
- Focus on helping your audience

## Opening Strategies

Strong openings include:
- A surprising statistic
- A relevant question
- A brief story
- A bold statement

Example: "What if I told you that 70% of projects fail—not because of technical issues, but communication problems?"

## Handling Q&A

- Listen fully before answering
- Repeat or paraphrase the question
- Be honest if you don't know
- Bridge back to your key points
- "That's a great question..."
- "I'll need to follow up on that specific data..."`,
        order_index: 2,
        is_published: true
      },
      {
        id: 'lesson-be-3',
        title: 'Effective Meeting Participation',
        description: 'Contribute meaningfully and lead productive meetings.',
        duration: '45 min',
        video_url: 'https://youtube.com/watch?v=business3',
        content: `# Effective Meeting Participation

## Before the Meeting

### Preparation
- Review the agenda
- Complete any pre-work
- Prepare your contributions
- Know who will attend

### Set Your Intent
Ask yourself:
- What do I want to contribute?
- What do I need to learn?
- What decisions need my input?

## During the Meeting

### Active Participation

**Speaking Up**
- "I'd like to add..."
- "Building on what [Name] said..."
- "From my perspective..."
- "One thing to consider..."

**Asking Questions**
- "Could you clarify...?"
- "What's the timeline for...?"
- "How does this impact...?"

**Expressing Disagreement Professionally**
- "I see it differently..."
- "Another perspective might be..."
- "I have concerns about..."
- "Have we considered...?"

### Active Listening
- Take notes on key points
- Nod and maintain eye contact
- Avoid interrupting
- Summarize to confirm understanding

## Virtual Meeting Etiquette

- Test technology beforehand
- Find a quiet, professional background
- Mute when not speaking
- Look at the camera, not the screen
- Stay engaged—no multitasking

## Leading Meetings

If you're the facilitator:
- Start on time
- State the objective clearly
- Keep discussion on track
- Ensure all voices are heard
- Summarize decisions and next steps
- End on time

## After the Meeting

- Review your notes
- Complete action items promptly
- Follow up on commitments
- Send summary if responsible`,
        order_index: 3,
        is_published: true
      },
      {
        id: 'lesson-be-4',
        title: 'Networking and Small Talk',
        description: 'Build professional relationships through effective networking.',
        duration: '40 min',
        video_url: 'https://youtube.com/watch?v=business4',
        content: `# Networking and Small Talk

## Why Network?

Most opportunities come through relationships:
- Job referrals
- Business partnerships
- Mentorship
- Industry knowledge
- Career advancement

## Small Talk Basics

### Safe Topics
- Industry trends
- Recent events (non-political)
- Travel and experiences
- Professional development
- Hobbies and interests

### Topics to Avoid
- Politics
- Religion
- Salary/personal finances
- Gossip about colleagues
- Controversial opinions

## Conversation Starters

**At Events:**
- "What brings you to this event?"
- "Have you attended before?"
- "What did you think of the keynote?"

**In the Workplace:**
- "How's your week going?"
- "Working on anything interesting?"
- "Did you catch the news about [industry topic]?"

## The FORD Method

Safe conversation topics:
- **F**amily (general): "Do you have plans for the holiday?"
- **O**ccupation: "What project are you working on?"
- **R**ecreation: "Do anything fun this weekend?"
- **D**reams: "What's next for you career-wise?"

## Graceful Exits

- "It was great meeting you. I should go mingle."
- "I see someone I need to catch up with."
- "I want to make sure I connect with others too."
- "Let's exchange cards and continue this conversation."

## Following Up

Within 48 hours:
- Connect on LinkedIn
- Send a brief email referencing your conversation
- Suggest a coffee chat if appropriate

Template:
"Hi [Name], It was great meeting you at [event]. I enjoyed our conversation about [topic]. I'd love to continue that discussion sometime. Perhaps we could grab coffee next week?"`,
        order_index: 4,
        is_published: true
      },
      {
        id: 'lesson-be-5',
        title: 'Job Interview Communication',
        description: 'Master interview techniques and common question types.',
        duration: '50 min',
        video_url: 'https://youtube.com/watch?v=business5',
        content: `# Job Interview Communication

## Preparation

### Research
- Company website and news
- Job description (memorize key requirements)
- Your interviewer (LinkedIn)
- Industry trends

### Prepare Your Stories
Use the STAR method:
- **S**ituation: Set the context
- **T**ask: What was your responsibility?
- **A**ction: What did you do?
- **R**esult: What was the outcome?

## Common Questions

### "Tell me about yourself"
Structure:
1. Brief professional background
2. Key accomplishments
3. Why you're here now
4. Why this role excites you

Example: "I'm a project manager with five years of experience in tech startups. In my current role, I led a team that launched our mobile app six weeks ahead of schedule. I'm excited about this opportunity because..."

### "Why do you want this job?"
Connect to:
- Your career goals
- Company mission
- Specific responsibilities
- Growth opportunity

### "What's your greatest weakness?"
- Be honest but strategic
- Show self-awareness
- Explain what you're doing to improve

### "Tell me about a challenge you faced"
Use STAR method:
- Focus on professional situations
- Emphasize your actions
- Quantify results if possible

## Questions to Ask

Always prepare 3-5 questions:
- "What does success look like in this role?"
- "How would you describe the team culture?"
- "What are the biggest challenges facing the team?"
- "What's the growth path for this position?"

## After the Interview

Within 24 hours, send thank-you email:
- Thank them for their time
- Reiterate your interest
- Reference something specific from conversation
- Keep it brief (3-4 sentences)`,
        order_index: 5,
        is_published: true
      },
      {
        id: 'lesson-be-6',
        title: 'Executive Presence',
        description: 'Develop the communication style of successful leaders.',
        duration: '45 min',
        video_url: 'https://youtube.com/watch?v=business6',
        content: `# Developing Executive Presence

## What is Executive Presence?

Executive presence is the ability to project confidence, credibility, and calm under pressure. It's about how you show up, not just what you say.

## Three Pillars

### 1. Gravitas
The weight of your communication:
- Speak with conviction
- Stay calm under pressure
- Show decisiveness
- Demonstrate expertise without arrogance

### 2. Communication
How you deliver your message:
- Clear and concise language
- Commanding voice
- Excellent listening skills
- Ability to read the room

### 3. Appearance
Your professional image:
- Appropriate dress for context
- Good posture
- Confident body language
- Attention to detail

## Powerful Language Patterns

**Replace Weak Language:**

| Instead of | Say |
|-----------|-----|
| "I think maybe..." | "I recommend..." |
| "I'm not sure but..." | "Based on my analysis..." |
| "This might work" | "This will work because..." |
| "Sorry to bother you" | "I have a question" |
| "Does that make sense?" | "What questions do you have?" |

## Handling Difficult Situations

### When You Don't Know
"That's outside my expertise, but I'll find out and follow up by [time]."

### When You Disagree
"I see it differently. Here's my perspective..."

### When Criticized
"I appreciate that feedback. Here's what I'll do differently..."

### When Things Go Wrong
"Here's what happened, here's the impact, and here's how we're fixing it."

## Building Your Presence

Daily practices:
1. Prepare before important interactions
2. Pause before responding
3. Use confident posture
4. Speak at a measured pace
5. Listen more than you speak
6. Be consistent and reliable

Remember: Executive presence is built through consistent behavior over time, not performed occasionally.`,
        order_index: 6,
        is_published: true
      }
    ]
  },
  {
    id: 'course-web-development-basics',
    title: 'Web Development Basics',
    slug: 'web-development-basics',
    description: 'Learn the fundamentals of building websites with HTML, CSS, and JavaScript.',
    long_description: `Start your journey into tech with this beginner-friendly web development course. No prior programming experience required!

This course is designed specifically for members of the Oromo community looking to break into the tech industry. You'll learn the fundamental building blocks of the web: HTML for structure, CSS for styling, and JavaScript for interactivity.

By the end of this course, you'll have built your own personal portfolio website and gained the skills needed to continue learning more advanced topics.`,
    thumbnail_url: '/images/courses/web-dev.jpg',
    category: 'technology',
    difficulty: 'beginner',
    instructor: {
      name: 'Ahmed Daud',
      title: 'Senior Software Engineer',
      avatar: '/images/instructors/ahmed.jpg'
    },
    duration: '7 hours',
    lessons_count: 8,
    enrolled_count: 2103,
    rating: 4.8,
    is_published: true,
    is_featured: true,
    what_youll_learn: [
      'Understand how the web works',
      'Build web pages with HTML',
      'Style websites with CSS',
      'Add interactivity with JavaScript',
      'Use developer tools effectively',
      'Deploy your first website online'
    ],
    requirements: [
      'A computer with internet access',
      'No prior programming experience needed',
      'Willingness to practice and experiment'
    ],
    created_at: '2024-03-01T00:00:00Z',
    lessons: [
      {
        id: 'lesson-wd-1',
        title: 'How the Web Works',
        description: 'Understand the fundamentals of how websites are delivered to your browser.',
        duration: '35 min',
        video_url: 'https://youtube.com/watch?v=webdev1',
        content: `# How the Web Works

## The Big Picture

When you type a website address and press Enter, a complex but fast process happens:

1. Your browser asks: "Where is this website?"
2. DNS servers respond: "It's at this address (IP)"
3. Your browser requests the page from that server
4. The server sends back HTML, CSS, and JavaScript files
5. Your browser renders the page

## Key Concepts

### Client vs Server
- **Client**: Your browser (Chrome, Firefox, Safari)
- **Server**: A computer that stores and serves websites

### URL Breakdown
\`https://www.oromoplatform.com/academy/courses\`

- \`https://\` - Protocol (secure connection)
- \`www.oromoplatform.com\` - Domain name
- \`/academy/courses\` - Path to specific page

### The Three Languages of the Web

| Language | Purpose | Analogy |
|----------|---------|---------|
| HTML | Structure | The skeleton |
| CSS | Styling | The skin and clothes |
| JavaScript | Interactivity | The muscles |

## Setting Up Your Environment

### What You Need
1. **Code Editor**: VS Code (free, powerful)
2. **Web Browser**: Chrome (has great developer tools)
3. **Terminal**: Built into your computer

### Your First HTML File
1. Create a folder called \`my-website\`
2. Create a file called \`index.html\`
3. Open it in VS Code
4. Open it in Chrome

Congratulations! You're ready to start coding.`,
        order_index: 1,
        is_published: true
      },
      {
        id: 'lesson-wd-2',
        title: 'HTML Fundamentals',
        description: 'Learn to structure web pages with HTML elements and attributes.',
        duration: '55 min',
        video_url: 'https://youtube.com/watch?v=webdev2',
        content: `# HTML Fundamentals

## What is HTML?

HTML (HyperText Markup Language) defines the structure and content of web pages using "tags."

## Basic Document Structure

\`\`\`html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>My First Page</title>
</head>
<body>
    <h1>Welcome!</h1>
    <p>This is my first web page.</p>
</body>
</html>
\`\`\`

## Common HTML Elements

### Headings
\`\`\`html
<h1>Main Heading</h1>
<h2>Subheading</h2>
<h3>Smaller Heading</h3>
\`\`\`

### Paragraphs and Text
\`\`\`html
<p>This is a paragraph.</p>
<strong>Bold text</strong>
<em>Italic text</em>
\`\`\`

### Links
\`\`\`html
<a href="https://example.com">Click here</a>
\`\`\`

### Images
\`\`\`html
<img src="photo.jpg" alt="Description of image">
\`\`\`

### Lists
\`\`\`html
<ul>
    <li>Unordered item 1</li>
    <li>Unordered item 2</li>
</ul>

<ol>
    <li>Ordered item 1</li>
    <li>Ordered item 2</li>
</ol>
\`\`\`

## Semantic HTML

Use meaningful tags:
- \`<header>\` - Top section of page
- \`<nav>\` - Navigation links
- \`<main>\` - Main content
- \`<article>\` - Self-contained content
- \`<section>\` - Thematic grouping
- \`<footer>\` - Bottom section

## Practice Exercise

Create an "About Me" page with:
1. Your name as heading
2. A paragraph about yourself
3. A list of your interests
4. A link to your favorite website`,
        order_index: 2,
        is_published: true
      },
      {
        id: 'lesson-wd-3',
        title: 'CSS Basics',
        description: 'Style your web pages with colors, fonts, and layouts.',
        duration: '60 min',
        video_url: 'https://youtube.com/watch?v=webdev3',
        content: `# CSS Basics

## What is CSS?

CSS (Cascading Style Sheets) controls how HTML elements look—colors, fonts, spacing, and layout.

## Adding CSS to HTML

### Method 1: External Stylesheet (Recommended)
\`\`\`html
<head>
    <link rel="stylesheet" href="styles.css">
</head>
\`\`\`

### Method 2: Internal Style Tag
\`\`\`html
<style>
    p { color: blue; }
</style>
\`\`\`

## CSS Syntax

\`\`\`css
selector {
    property: value;
}
\`\`\`

Example:
\`\`\`css
h1 {
    color: blue;
    font-size: 32px;
}
\`\`\`

## Selectors

\`\`\`css
/* Element selector */
p { color: black; }

/* Class selector */
.highlight { background: yellow; }

/* ID selector */
#main-title { font-size: 48px; }

/* Combining */
p.intro { font-weight: bold; }
\`\`\`

## Common Properties

### Colors
\`\`\`css
color: red;                /* Text color */
background-color: #f0f0f0; /* Hex code */
border: 1px solid blue;
\`\`\`

### Typography
\`\`\`css
font-family: Arial, sans-serif;
font-size: 16px;
font-weight: bold;
text-align: center;
\`\`\`

### Spacing
\`\`\`css
margin: 20px;      /* Outside spacing */
padding: 15px;     /* Inside spacing */
\`\`\`

## The Box Model

Every element is a box with:
1. Content - The actual content
2. Padding - Space inside the border
3. Border - The border itself
4. Margin - Space outside the border

## Practice Exercise

Style your "About Me" page:
1. Change the background color
2. Use a custom font
3. Add spacing between sections
4. Style the links on hover`,
        order_index: 3,
        is_published: true
      },
      {
        id: 'lesson-wd-4',
        title: 'CSS Layout with Flexbox',
        description: 'Master modern layout techniques using Flexbox.',
        duration: '50 min',
        video_url: 'https://youtube.com/watch?v=webdev4',
        content: `# CSS Layout with Flexbox

## The Layout Challenge

Before Flexbox, creating layouts was frustrating. Flexbox makes it easy to:
- Center things vertically and horizontally
- Create responsive columns
- Space items evenly
- Reorder elements

## Flexbox Basics

\`\`\`css
.container {
    display: flex;
}
\`\`\`

This makes all children become "flex items."

## Direction

\`\`\`css
.container {
    display: flex;
    flex-direction: row;      /* Horizontal (default) */
    flex-direction: column;   /* Vertical */
}
\`\`\`

## Alignment

### Main Axis (justify-content)
\`\`\`css
.container {
    display: flex;
    justify-content: flex-start;   /* Start */
    justify-content: center;       /* Center */
    justify-content: flex-end;     /* End */
    justify-content: space-between; /* Space between */
    justify-content: space-around;  /* Space around */
}
\`\`\`

### Cross Axis (align-items)
\`\`\`css
.container {
    display: flex;
    align-items: flex-start;  /* Top */
    align-items: center;      /* Middle */
    align-items: flex-end;    /* Bottom */
    align-items: stretch;     /* Fill height */
}
\`\`\`

## Common Patterns

### Centering Something
\`\`\`css
.container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
}
\`\`\`

### Navigation Bar
\`\`\`css
.nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
\`\`\`

### Card Grid
\`\`\`css
.card-container {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
}

.card {
    flex: 1 1 300px; /* Grow, shrink, basis */
}
\`\`\`

## Practice Exercise

Create a navigation bar with:
- Logo on the left
- Menu items centered
- Button on the right`,
        order_index: 4,
        is_published: true
      },
      {
        id: 'lesson-wd-5',
        title: 'Responsive Design',
        description: 'Make your websites work beautifully on all screen sizes.',
        duration: '45 min',
        video_url: 'https://youtube.com/watch?v=webdev5',
        content: `# Responsive Design

## Why Responsive?

Over 50% of web traffic comes from mobile devices. Your site must work everywhere.

## The Viewport Meta Tag

Always include in \`<head>\`:
\`\`\`html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
\`\`\`

## Mobile-First Approach

Start with mobile styles, add complexity for larger screens:

\`\`\`css
/* Mobile first (default) */
.container {
    padding: 16px;
}

/* Tablet and up */
@media (min-width: 768px) {
    .container {
        padding: 32px;
    }
}

/* Desktop */
@media (min-width: 1024px) {
    .container {
        padding: 48px;
        max-width: 1200px;
        margin: 0 auto;
    }
}
\`\`\`

## Common Breakpoints

| Device | Width |
|--------|-------|
| Mobile | 0 - 767px |
| Tablet | 768px - 1023px |
| Desktop | 1024px+ |

## Responsive Patterns

### Stacking Columns
\`\`\`css
.grid {
    display: flex;
    flex-direction: column;
}

@media (min-width: 768px) {
    .grid {
        flex-direction: row;
    }
}
\`\`\`

### Responsive Images
\`\`\`css
img {
    max-width: 100%;
    height: auto;
}
\`\`\`

### Responsive Typography
\`\`\`css
h1 {
    font-size: 24px;
}

@media (min-width: 768px) {
    h1 {
        font-size: 36px;
    }
}
\`\`\`

## Testing Responsiveness

Use Chrome DevTools:
1. Right-click → Inspect
2. Click the device icon
3. Test different screen sizes`,
        order_index: 5,
        is_published: true
      },
      {
        id: 'lesson-wd-6',
        title: 'JavaScript Fundamentals',
        description: 'Add interactivity to your websites with JavaScript.',
        duration: '60 min',
        video_url: 'https://youtube.com/watch?v=webdev6',
        content: `# JavaScript Fundamentals

## What is JavaScript?

JavaScript makes web pages interactive. It can:
- Respond to user actions
- Update content dynamically
- Validate forms
- Create animations
- Fetch data from servers

## Adding JavaScript

\`\`\`html
<!-- At the end of body (recommended) -->
<body>
    <!-- your content -->
    <script src="script.js"></script>
</body>
\`\`\`

## Variables

\`\`\`javascript
// Modern way (use these)
let name = "Chaltu";      // Can be changed
const age = 25;           // Cannot be changed

// Old way (avoid)
var oldWay = "outdated";
\`\`\`

## Data Types

\`\`\`javascript
// String
let text = "Hello World";

// Number
let count = 42;

// Boolean
let isActive = true;

// Array
let colors = ["red", "green", "blue"];

// Object
let person = {
    name: "Abdi",
    age: 30,
    city: "Minneapolis"
};
\`\`\`

## Functions

\`\`\`javascript
// Declaration
function greet(name) {
    return "Hello, " + name + "!";
}

// Arrow function (modern)
const greet = (name) => {
    return \`Hello, \${name}!\`;
};

// Using it
console.log(greet("World")); // "Hello, World!"
\`\`\`

## Conditionals

\`\`\`javascript
let age = 18;

if (age >= 18) {
    console.log("You can vote");
} else {
    console.log("Too young to vote");
}
\`\`\`

## DOM Manipulation

\`\`\`javascript
// Get element
const button = document.getElementById("myButton");
const items = document.querySelectorAll(".item");

// Change content
button.textContent = "Click Me!";

// Change style
button.style.color = "blue";

// Add event listener
button.addEventListener("click", () => {
    alert("Button clicked!");
});
\`\`\`

## Practice Exercise

Create a button that changes the background color randomly when clicked.`,
        order_index: 6,
        is_published: true
      },
      {
        id: 'lesson-wd-7',
        title: 'Building Your Portfolio',
        description: 'Create a personal portfolio website from scratch.',
        duration: '50 min',
        video_url: 'https://youtube.com/watch?v=webdev7',
        content: `# Building Your Portfolio

## Why a Portfolio?

A portfolio website:
- Showcases your skills
- Demonstrates what you've learned
- Helps you get hired
- Establishes your personal brand

## Portfolio Structure

### Essential Sections

1. **Hero/Header**
   - Your name
   - What you do
   - Call to action

2. **About**
   - Brief introduction
   - Your background
   - Skills and interests

3. **Projects**
   - What you've built
   - Technologies used
   - Links to live demos

4. **Contact**
   - Email or form
   - Social links
   - Location (optional)

## Project Layout

\`\`\`
portfolio/
├── index.html
├── styles.css
├── script.js
├── images/
│   ├── profile.jpg
│   └── project1.jpg
└── projects/
    └── project1/
\`\`\`

## Starting HTML

\`\`\`html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Name - Portfolio</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <header>
        <nav><!-- Navigation --></nav>
    </header>

    <main>
        <section id="hero"><!-- Hero --></section>
        <section id="about"><!-- About --></section>
        <section id="projects"><!-- Projects --></section>
        <section id="contact"><!-- Contact --></section>
    </main>

    <footer><!-- Footer --></footer>

    <script src="script.js"></script>
</body>
</html>
\`\`\`

## Design Tips

- Keep it simple and clean
- Use consistent colors (2-3 max)
- Choose readable fonts
- Make navigation clear
- Ensure it's mobile-friendly
- Include high-quality images

## Practice Exercise

Build out your portfolio with all four sections. Focus on clean, responsive design.`,
        order_index: 7,
        is_published: true
      },
      {
        id: 'lesson-wd-8',
        title: 'Deploying Your Website',
        description: 'Put your website online for the world to see.',
        duration: '35 min',
        video_url: 'https://youtube.com/watch?v=webdev8',
        content: `# Deploying Your Website

## Deployment Options

### Free Hosting Services

| Service | Best For |
|---------|----------|
| GitHub Pages | Static sites, portfolios |
| Netlify | Static sites, forms |
| Vercel | React, Next.js apps |

## GitHub Pages (Recommended)

### Step 1: Create GitHub Account
Visit github.com and sign up.

### Step 2: Create Repository
1. Click "New repository"
2. Name it: \`yourusername.github.io\`
3. Make it public
4. Initialize with README

### Step 3: Upload Your Files
1. Click "Upload files"
2. Drag your HTML, CSS, JS files
3. Commit changes

### Step 4: Enable GitHub Pages
1. Go to Settings → Pages
2. Select "main" branch
3. Save

Your site is now live at:
\`https://yourusername.github.io\`

## Using Git (Better Method)

### Initial Setup
\`\`\`bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/username/repo.git
git push -u origin main
\`\`\`

### Updating Your Site
\`\`\`bash
git add .
git commit -m "Updated portfolio"
git push
\`\`\`

## Custom Domain (Optional)

1. Buy a domain (Namecheap, Google Domains)
2. Add CNAME file to your repo with your domain
3. Configure DNS settings

## What's Next?

Congratulations! You've learned the fundamentals. Consider learning:
- React or Vue (JavaScript frameworks)
- Node.js (backend JavaScript)
- APIs and databases
- Version control with Git

Keep building projects and never stop learning!`,
        order_index: 8,
        is_published: true
      }
    ]
  },
  {
    id: 'course-career-success-skills',
    title: 'Career Success Skills',
    slug: 'career-success-skills',
    description: 'Develop essential soft skills for career advancement and professional success.',
    long_description: `Your technical skills may get you hired, but your soft skills will get you promoted. This course focuses on the often-overlooked skills that separate good employees from exceptional leaders.

Designed specifically for Oromo professionals navigating Western workplace cultures, this course addresses the unique challenges of building a career in a new environment while maintaining your cultural identity.

You'll learn practical strategies for goal setting, time management, professional relationship building, and career advancement that you can apply immediately.`,
    thumbnail_url: '/images/courses/career-skills.jpg',
    category: 'career',
    difficulty: 'beginner',
    instructor: {
      name: 'Fatuma Hassan',
      title: 'Career Coach & HR Consultant',
      avatar: '/images/instructors/fatuma.jpg'
    },
    duration: '4 hours',
    lessons_count: 5,
    enrolled_count: 1678,
    rating: 4.9,
    is_published: true,
    is_featured: false,
    what_youll_learn: [
      'Set and achieve meaningful career goals',
      'Manage your time effectively',
      'Build professional relationships',
      'Navigate workplace politics',
      'Develop a personal brand'
    ],
    requirements: [
      'Currently employed or job seeking',
      'Open to self-reflection',
      'Commitment to apply what you learn'
    ],
    created_at: '2024-03-15T00:00:00Z',
    lessons: [
      {
        id: 'lesson-cs-1',
        title: 'Goal Setting and Career Planning',
        description: 'Create a clear roadmap for your professional future.',
        duration: '50 min',
        video_url: 'https://youtube.com/watch?v=career1',
        content: `# Goal Setting and Career Planning

## Why Set Goals?

Research shows people who write down goals are 42% more likely to achieve them. Goals provide:
- Direction and focus
- Motivation during challenges
- Measurable progress
- A sense of purpose

## The SMART Framework

Goals should be:

| Letter | Meaning | Example |
|--------|---------|---------|
| S | Specific | "Get promoted to Senior Engineer" |
| M | Measurable | "Increase salary by 20%" |
| A | Achievable | Realistic given your situation |
| R | Relevant | Aligned with your values |
| T | Time-bound | "Within 18 months" |

## Short vs Long-Term Goals

### Long-Term (5-10 years)
- Where do you want to be?
- What title/role?
- What impact do you want to make?

### Medium-Term (1-3 years)
- What position gets you closer?
- What skills do you need?
- What experiences are required?

### Short-Term (3-12 months)
- What can you do today?
- What quick wins are possible?
- What habits to build?

## Creating Your Career Vision

Answer these questions:
1. What work makes you feel energized?
2. What are you naturally good at?
3. What do you want to be known for?
4. What impact do you want to have?

## Breaking Down Big Goals

Example: "Become a Product Manager in 2 years"

Year 1:
- Complete online PM certification
- Lead 2 product features at current job
- Build relationships with PM team

Year 2:
- Apply for internal PM roles
- Get PM mentor
- Build portfolio of product work

## Quarterly Reviews

Every 90 days:
- What did I accomplish?
- What challenges arose?
- What will I focus on next?
- Do I need to adjust my goals?

## Exercise

Write down:
1. Your 5-year career vision
2. Three 1-year goals
3. One action you'll take this week`,
        order_index: 1,
        is_published: true
      },
      {
        id: 'lesson-cs-2',
        title: 'Time Management Mastery',
        description: 'Learn to work smarter, not just harder.',
        duration: '45 min',
        video_url: 'https://youtube.com/watch?v=career2',
        content: `# Time Management Mastery

## The Myth of "Not Enough Time"

We all have the same 24 hours. The difference is how we use them.

## Common Time Wasters

- Unplanned meetings
- Email and chat interruptions
- Social media
- Unclear priorities
- Poor delegation
- Perfectionism

## The Eisenhower Matrix

Categorize tasks by urgency and importance:

| | Urgent | Not Urgent |
|---|--------|------------|
| **Important** | DO FIRST: Crises, deadlines | SCHEDULE: Planning, growth |
| **Not Important** | DELEGATE: Interruptions | ELIMINATE: Time wasters |

Focus most energy on "Important but Not Urgent" to prevent crises.

## Time Blocking

Schedule your day in blocks:
- 9-11am: Deep work (no interruptions)
- 11-12pm: Meetings
- 12-1pm: Lunch
- 1-2pm: Email and admin
- 2-4pm: Collaborative work
- 4-5pm: Planning for tomorrow

## The Pomodoro Technique

1. Choose a task
2. Set timer for 25 minutes
3. Work with full focus
4. Take 5-minute break
5. Repeat 4 times, then 15-30 min break

## Handling Email

- Check 2-3 times per day (not constantly)
- Use the 2-minute rule: if it takes less, do it now
- Create folders/labels for organization
- Unsubscribe from unnecessary lists

## Saying No

"No" is a complete sentence. But you can soften it:
- "I can't take this on right now, but..."
- "My plate is full. Let's discuss priorities."
- "I'd love to help. Can we revisit next month?"

## Energy Management

Not all hours are equal. Identify:
- When are you most focused? (Use for hard tasks)
- When do you slump? (Use for easy tasks)
- What drains vs. energizes you?

## Weekly Planning Ritual

Every Sunday or Monday morning:
1. Review last week
2. Identify top 3 priorities
3. Block time for each priority
4. Schedule self-care
5. Leave buffer for unexpected

## Exercise

Track your time for one week. Where does it actually go?`,
        order_index: 2,
        is_published: true
      },
      {
        id: 'lesson-cs-3',
        title: 'Building Professional Relationships',
        description: 'Network effectively and build lasting professional connections.',
        duration: '45 min',
        video_url: 'https://youtube.com/watch?v=career3',
        content: `# Building Professional Relationships

## Why Relationships Matter

Studies show:
- 70-80% of jobs come through networking
- Career advancement often depends on sponsors
- Strong networks provide support and opportunities

## Types of Professional Relationships

### Mentors
- More experienced professionals
- Provide guidance and advice
- Help navigate career decisions

### Sponsors
- Advocate for you when you're not in the room
- More powerful than mentors
- Usually senior leaders

### Peers
- At your level
- Share experiences and knowledge
- Can become future references

### Cross-Functional Partners
- In different departments
- Expand your understanding
- Open new opportunities

## Finding Mentors

1. Identify people you admire
2. Start with small asks (coffee chat)
3. Be specific about what you want to learn
4. Follow up and show progress
5. Offer value in return

## Becoming a Mentee Worth Having

- Come prepared with questions
- Implement their advice
- Update them on progress
- Respect their time
- Express gratitude

## Building Relationships at Work

### Be Helpful
- Offer assistance before being asked
- Share knowledge freely
- Celebrate others' wins

### Be Present
- Put away your phone in conversations
- Remember personal details
- Follow up on previous conversations

### Be Authentic
- Don't pretend to be someone you're not
- Share your background and story
- Admit when you don't know something

## Navigating Cultural Differences

As Oromo professionals:
- Your cultural values (respect, hospitality) are assets
- Directness is valued in Western workplaces
- Self-promotion is expected (share your wins)
- Build bridges between communities

## Maintaining Relationships

- Reach out periodically (not just when you need something)
- Share relevant articles or opportunities
- Congratulate on achievements
- Invite to events

## Exercise

Identify 5 people to connect with this month. Reach out to at least one this week.`,
        order_index: 3,
        is_published: true
      },
      {
        id: 'lesson-cs-4',
        title: 'Navigating Workplace Dynamics',
        description: 'Understand organizational politics and thrive in any environment.',
        duration: '50 min',
        video_url: 'https://youtube.com/watch?v=career4',
        content: `# Navigating Workplace Dynamics

## Office Politics: Reality Check

Politics exist in every organization. You can:
- Ignore them (and be disadvantaged)
- Engage negatively (and damage your reputation)
- Navigate skillfully (and advance your career)

## Understanding Power Dynamics

### Formal Power
- Based on title and position
- Clear hierarchy
- Official decision-making authority

### Informal Power
- Based on relationships and influence
- Who do people go to for advice?
- Who has the leader's ear?

## Reading the Room

Pay attention to:
- Who speaks up in meetings?
- Who gets interrupted vs. listened to?
- Whose ideas get implemented?
- Who eats lunch with whom?

## Building Credibility

### Deliver Results
- Meet deadlines
- Exceed expectations
- Solve problems

### Be Reliable
- Do what you say
- Communicate proactively
- Own your mistakes

### Be Visible
- Share your wins (appropriately)
- Volunteer for high-profile projects
- Present at meetings

## Handling Conflict

### Stay Professional
- Focus on issues, not people
- Use "I" statements
- Seek to understand first

### Choose Your Battles
- Is this worth fighting?
- What's the potential cost/benefit?
- Will it matter in a year?

### Document Everything
- Keep email records
- Note dates and details
- Protect yourself

## Dealing with Difficult People

### The Credit Stealer
- Document your contributions
- CC relevant people on emails
- Speak up in meetings

### The Micromanager
- Over-communicate proactively
- Build trust through reliability
- Have an honest conversation

### The Underminer
- Don't engage in gossip
- Build your own reputation
- Document and escalate if needed

## Advocating for Yourself

### Asking for Raises
- Research market rates
- Document your contributions
- Make the business case
- Practice the conversation

### Asking for Promotions
- Understand the path
- Ask what's needed
- Do the job before the title
- Have sponsors advocate

## Exercise

Map the power dynamics in your organization. Who are the key influencers?`,
        order_index: 4,
        is_published: true
      },
      {
        id: 'lesson-cs-5',
        title: 'Building Your Personal Brand',
        description: 'Stand out and be recognized for your unique value.',
        duration: '45 min',
        video_url: 'https://youtube.com/watch?v=career5',
        content: `# Building Your Personal Brand

## What is a Personal Brand?

Your personal brand is your professional reputation—what people say about you when you're not in the room.

## Why It Matters

A strong personal brand:
- Makes you memorable
- Opens opportunities
- Commands higher compensation
- Creates career security

## Defining Your Brand

### Step 1: Self-Assessment
- What are your unique strengths?
- What do people come to you for?
- What are you passionate about?
- What makes you different?

### Step 2: Audience
- Who needs to know about you?
- What do they care about?
- Where do they spend time?

### Step 3: Message
- What's your unique value proposition?
- How do you want to be described?
- What's your origin story?

## The Three Cs

### Clarity
Be clear about who you are and what you offer.

### Consistency
Show up the same way across all platforms.

### Courage
Share your authentic self, including your background.

## Online Presence

### LinkedIn Optimization
- Professional photo
- Compelling headline (not just job title)
- Summary that tells your story
- Featured content
- Regular activity

### Content Creation
- Share industry insights
- Comment thoughtfully on others' posts
- Write articles about your expertise
- Be generous with knowledge

## Offline Presence

### Speaking
- Present at team meetings
- Speak at conferences
- Host lunch-and-learns

### Writing
- Contribute to company blog
- Write for industry publications
- Create useful resources

## Your Oromo Identity

Your heritage is an asset:
- Brings unique perspective
- Demonstrates resilience
- Shows cultural intelligence
- Connects you to global community

## Measuring Your Brand

Ask others:
- What do you think of when you think of me?
- What would you come to me for?
- What makes me different from others in my field?

## Exercise

Write your personal brand statement:
"I help [who] do [what] by [how], which is unique because [why]."

Example: "I help startups build scalable products by combining engineering excellence with user empathy, which is unique because of my background bridging East African and Western tech communities."

---

## Course Conclusion

Congratulations on completing this course!

Remember:
1. Set clear, written goals
2. Manage your time and energy wisely
3. Invest in relationships continuously
4. Navigate politics with integrity
5. Build a brand that reflects your authentic self

Your career is a marathon, not a sprint. Keep learning, stay connected, and don't forget to give back to your community along the way.

**Galatooma! (Thank you!)**`,
        order_index: 5,
        is_published: true
      }
    ]
  }
]

// Helper functions
export const getCourseBySlug = (slug: string): Course | undefined => {
  return courses.find(c => c.slug === slug)
}

export const getCourseById = (id: string): Course | undefined => {
  return courses.find(c => c.id === id)
}

export const getCoursesByCategory = (category: Course['category']): Course[] => {
  return courses.filter(c => c.category === category)
}

export const getFeaturedCourses = (): Course[] => {
  return courses.filter(c => c.is_featured)
}

export const getPublishedCourses = (): Course[] => {
  return courses.filter(c => c.is_published)
}
