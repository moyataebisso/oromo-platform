import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { ArrowLeft, MapPin, Users, Landmark } from 'lucide-react'

const REGIONS_DATA: Record<string, {
  name: string
  oromoName: string
  capital: string
  population: string
  area: string
  description: string
  history: string
  culture: string
  attractions: string[]
  image: string
}> = {
  'shewa': {
    name: 'Shewa',
    oromoName: 'Shawaa',
    capital: 'Finfinnee (Addis Ababa area)',
    population: '~10 million',
    area: '~85,000 km²',
    description: 'Shewa is the central region of Oromia, historically one of the most significant areas in Ethiopian and Oromo history. The region encompasses a vast highland plateau and is known for its fertile agricultural land and rich cultural heritage.',
    history: 'Historically significant as the center of the Oromo expansion and later as a region of great political importance. Shewa was home to several important Oromo clans and played a crucial role in the formation of modern Ethiopia. The area around Finfinnee (Addis Ababa) was originally Oromo land before becoming the capital.',
    culture: 'Known for unique dialects and cultural practices, Shewa Oromo have maintained strong traditions despite urbanization. The region is famous for traditional music, coffee ceremonies, and the celebration of Irreecha. Many Gadaa assemblies have historically been held in this region.',
    attractions: ['Entoto Mountains', 'Menagesha Forest', 'Lake Wenchi', 'Mount Zuqualla', 'Addis Ababa National Museum'],
    image: 'https://images.unsplash.com/photo-1523805009345-7448845a9e53?w=800'
  },
  'wellega': {
    name: 'Wellega',
    oromoName: 'Wallagga',
    capital: 'Nekemte',
    population: '~6 million',
    area: '~45,000 km²',
    description: 'Wellega is the western region of Oromia, known for its lush forests, gold deposits, and excellent coffee. The region has a rich history and is considered one of the heartlands of Oromo culture.',
    history: 'Wellega was one of the last Oromo regions to be incorporated into the Ethiopian empire in the late 19th century. The region maintained strong resistance movements and preserved many traditional practices. It has been a center of Oromo nationalism and cultural revival.',
    culture: 'Wellega is known for its distinct musical traditions, particularly the use of the kirar (lyre). The region has strong traditions of oral history and poetry. Coffee cultivation and ceremonies hold special importance here.',
    attractions: ['Didessa Wildlife Sanctuary', 'Nekemte Historical Sites', 'Gold Mining Areas', 'Coffee Plantations'],
    image: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=800'
  },
  'jimma': {
    name: 'Jimma',
    oromoName: 'Jimmaa',
    capital: 'Jimma',
    population: '~3 million',
    area: '~20,000 km²',
    description: 'Jimma is located in southwestern Oromia and is famous as the birthplace of coffee. The region was historically the center of the powerful Kingdom of Jimma, one of the five Gibe states.',
    history: 'The Kingdom of Jimma was one of the most powerful and advanced Oromo kingdoms, known for its sophisticated political system and trade networks. The kingdom maintained independence until the late 19th century and had extensive trade connections.',
    culture: 'Jimma culture is deeply intertwined with coffee. The region claims to be where coffee (buna) was first discovered. Traditional music, particularly the washint (flute), is popular. The region maintains strong Islamic and traditional religious practices.',
    attractions: ['Jimma Palace Museum', 'Coffee Forests', 'Gibe River', 'Traditional Markets'],
    image: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800'
  },
  'arsi': {
    name: 'Arsi',
    oromoName: 'Arsii',
    capital: 'Asella',
    population: '~4 million',
    area: '~25,000 km²',
    description: 'Arsi is located in southeastern Oromia and is known for producing world-class athletes and its productive agricultural land. The region has a strong identity and rich cultural traditions.',
    history: 'The Arsi Oromo maintained strong resistance against expansion and preserved many traditional practices. The region was known for its cavalry and warrior traditions. Arsi played a significant role in the preservation of Oromo identity.',
    culture: 'Arsi is famous for its athletes, including many Olympic gold medalists. The region has strong traditions of horsemanship and celebrates this heritage. Traditional dress and ceremonies are well preserved.',
    attractions: ['Arsi Mountains', 'Lake Langano', 'Sof Omar Caves', 'Traditional Horse Festivals'],
    image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800'
  },
  'bale': {
    name: 'Bale',
    oromoName: 'Baalee',
    capital: 'Robe',
    population: '~2 million',
    area: '~45,000 km²',
    description: 'Bale is home to the famous Bale Mountains National Park, one of the most important areas for biodiversity in Africa. The region features stunning landscapes ranging from alpine meadows to dense forests.',
    history: 'Bale has been inhabited by Oromo communities for centuries. The region was known for its strong independent spirit and resistance to outside rule. Traditional Gadaa governance remained strong here.',
    culture: 'The Bale Oromo have unique cultural practices adapted to the mountain environment. Traditional beekeeping and honey production are important. The region celebrates Irreecha with particular enthusiasm.',
    attractions: ['Bale Mountains National Park', 'Sanetti Plateau', 'Harenna Forest', 'Web Valley', 'Ethiopian Wolf Habitat'],
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800'
  },
  'hararghe': {
    name: 'Hararghe',
    oromoName: 'Harargee',
    capital: 'Harar',
    population: '~5 million',
    area: '~35,000 km²',
    description: 'Hararghe is the eastern region of Oromia, encompassing the historic city of Harar and vast agricultural areas known for coffee and chat (khat) production.',
    history: 'Hararghe has a complex history with the ancient walled city of Harar being a center of Islamic learning and trade. Oromo communities have been present in the region for centuries, with rich interactions with other cultures.',
    culture: 'The region has a unique blend of Oromo and Islamic cultures. Traditional music and poetry flourish here. The famous hyena feeding tradition of Harar attracts visitors from around the world.',
    attractions: ['Harar Old Town (UNESCO)', 'Hyena Feeding', 'Chat Markets', 'Dire Dawa', 'Valley of Marvels'],
    image: 'https://images.unsplash.com/photo-1489392191049-fc10c97e64b6?w=800'
  },
  'borana': {
    name: 'Borana',
    oromoName: 'Booranaa',
    capital: 'Yabello',
    population: '~1.5 million',
    area: '~50,000 km²',
    description: 'Borana is the southern region of Oromia, known for its pastoral traditions, the famous Borana cattle breed, and as a stronghold of traditional Gadaa governance.',
    history: 'The Borana Oromo are considered keepers of the most authentic Gadaa traditions. The region has maintained traditional governance systems better than many other areas. Borana played a crucial role in preserving Oromo cultural heritage.',
    culture: 'Borana culture is centered around cattle herding and the Gadaa system. The Gadaa ceremonies held here are considered the most traditional. The singing wells (ela) are unique to this region.',
    attractions: ['Gadaa Ceremony Sites', 'Singing Wells', 'Yabello Wildlife Sanctuary', 'El Sod Crater Lake'],
    image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800'
  },
  'guji': {
    name: 'Guji',
    oromoName: 'Gujii',
    capital: 'Negele',
    population: '~2 million',
    area: '~30,000 km²',
    description: 'Guji is located in southern Oromia and is known for its excellent coffee, gold deposits, and strong traditional practices. The region produces some of the most prized coffee in the world.',
    history: 'The Guji Oromo have maintained strong traditional governance and cultural practices. The region was known for its independence and resistance. Gold mining has been practiced here for centuries.',
    culture: 'Guji culture is closely linked to coffee cultivation and traditional ceremonies. The region is known for its distinctive coffee processing methods. Traditional dress and ceremonies are well preserved.',
    attractions: ['Coffee Plantations', 'Gold Mining Sites', 'Traditional Villages', 'Dawa River'],
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800'
  },
  'ilubabor': {
    name: 'Ilubabor',
    oromoName: 'Iluu Abbaa Booraa',
    capital: 'Metu',
    population: '~2 million',
    area: '~20,000 km²',
    description: 'Ilubabor is located in southwestern Oromia and is known for its dense forests, coffee production, and biodiversity. The region has some of the last remaining rainforests in Ethiopia.',
    history: 'Ilubabor was home to several important Oromo kingdoms. The region maintained strong traditional governance. The forests have provided refuge and resources for Oromo communities for centuries.',
    culture: 'The region has rich traditions of forest management and conservation. Coffee plays a central role in cultural practices. Traditional music and dance are vibrant parts of community life.',
    attractions: ['Yayu Forest Biosphere Reserve', 'Gore Historical Sites', 'Coffee Forests', 'Baro River'],
    image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=800'
  },
}

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function RegionPage({ params }: PageProps) {
  const { id } = await params
  const region = REGIONS_DATA[id]

  if (!region) {
    notFound()
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-900">
      <Header />

      <main className="flex-1">
        {/* Hero with Image */}
        <div className="relative h-64 md:h-80">
          <img
            src={region.image}
            alt={region.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <div className="container mx-auto">
              <Link href="/wiki" className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 mb-4 transition-colors">
                <ArrowLeft className="w-4 h-4" />
                Back to Wiki
              </Link>
              <h1 className="text-4xl md:text-5xl font-bold text-white">{region.name}</h1>
              <p className="text-xl text-amber-400 mt-1">{region.oromoName}</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 py-12">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Overview */}
              <section className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <h2 className="text-2xl font-bold text-white mb-4">Overview</h2>
                <p className="text-slate-300 leading-relaxed">{region.description}</p>
              </section>

              {/* History */}
              <section className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                  <Landmark className="w-6 h-6 text-emerald-400" />
                  History
                </h2>
                <p className="text-slate-300 leading-relaxed">{region.history}</p>
              </section>

              {/* Culture */}
              <section className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                  <Users className="w-6 h-6 text-amber-400" />
                  Culture
                </h2>
                <p className="text-slate-300 leading-relaxed">{region.culture}</p>
              </section>

              {/* Attractions */}
              <section className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                  <MapPin className="w-6 h-6 text-red-400" />
                  Places to Visit
                </h2>
                <ul className="space-y-3">
                  {region.attractions.map((attraction) => (
                    <li key={attraction} className="flex items-center gap-3 text-slate-300">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      {attraction}
                    </li>
                  ))}
                </ul>
              </section>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Facts */}
              <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <h3 className="text-lg font-semibold text-white mb-4">Quick Facts</h3>
                <dl className="space-y-4">
                  <div>
                    <dt className="text-slate-400 text-sm">Capital</dt>
                    <dd className="text-white font-medium">{region.capital}</dd>
                  </div>
                  <div>
                    <dt className="text-slate-400 text-sm">Population</dt>
                    <dd className="text-white font-medium">{region.population}</dd>
                  </div>
                  <div>
                    <dt className="text-slate-400 text-sm">Area</dt>
                    <dd className="text-white font-medium">{region.area}</dd>
                  </div>
                </dl>
              </div>

              {/* Related Links */}
              <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <h3 className="text-lg font-semibold text-white mb-4">Explore More</h3>
                <div className="space-y-2">
                  <Link
                    href="/wiki/category/geography"
                    className="block text-emerald-400 hover:text-emerald-300 transition-colors"
                  >
                    → All Geography Articles
                  </Link>
                  <Link
                    href="/wiki/category/history"
                    className="block text-emerald-400 hover:text-emerald-300 transition-colors"
                  >
                    → History of Oromia
                  </Link>
                  <Link
                    href="/wiki/category/culture"
                    className="block text-emerald-400 hover:text-emerald-300 transition-colors"
                  >
                    → Culture & Traditions
                  </Link>
                </div>
              </div>

              {/* Back to Map */}
              <Link
                href="/wiki#map"
                className="block bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-xl text-center font-medium transition-colors"
              >
                🗺️ View Interactive Map
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
