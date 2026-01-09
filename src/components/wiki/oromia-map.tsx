'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import L from 'leaflet'

// Dynamically import map components to avoid SSR issues
const MapContainer = dynamic(
  () => import('react-leaflet').then(mod => mod.MapContainer),
  { ssr: false }
)
const TileLayer = dynamic(
  () => import('react-leaflet').then(mod => mod.TileLayer),
  { ssr: false }
)
const Marker = dynamic(
  () => import('react-leaflet').then(mod => mod.Marker),
  { ssr: false }
)
const Popup = dynamic(
  () => import('react-leaflet').then(mod => mod.Popup),
  { ssr: false }
)
const Polygon = dynamic(
  () => import('react-leaflet').then(mod => mod.Polygon),
  { ssr: false }
)

interface Region {
  id: string
  name: string
  oromoName: string
  capital: string
  capitalCoords: [number, number]
  description: string
  population: string
  color: string
}

// Real coordinates for Oromia regions and cities
const OROMIA_REGIONS: Region[] = [
  {
    id: 'finfinnee',
    name: 'Finfinnee (Addis Ababa)',
    oromoName: 'Finfinnee',
    capital: 'Addis Ababa',
    capitalCoords: [9.0320, 38.7469],
    description: 'Capital city, surrounded by Oromia',
    population: '~5M',
    color: '#F59E0B'
  },
  {
    id: 'east-shewa',
    name: 'East Shewa',
    oromoName: 'Shawaa Bahaa',
    capital: 'Adama (Nazret)',
    capitalCoords: [8.5400, 39.2700],
    description: 'Major industrial and commercial hub',
    population: '~3.5M',
    color: '#10B981'
  },
  {
    id: 'west-shewa',
    name: 'West Shewa',
    oromoName: 'Shawaa Lixaa',
    capital: 'Ambo',
    capitalCoords: [8.9833, 37.8500],
    description: 'Known for Ambo mineral water',
    population: '~2.5M',
    color: '#059669'
  },
  {
    id: 'north-shewa',
    name: 'North Shewa',
    oromoName: 'Shawaa Kaabaa',
    capital: 'Fitche',
    capitalCoords: [9.8000, 38.7333],
    description: 'Northern Shewa zone',
    population: '~1.5M',
    color: '#34D399'
  },
  {
    id: 'east-wellega',
    name: 'East Wellega',
    oromoName: 'Wallagga Bahaa',
    capital: 'Nekemte',
    capitalCoords: [9.0833, 36.5333],
    description: 'Rich in gold and coffee',
    population: '~1.5M',
    color: '#10B981'
  },
  {
    id: 'west-wellega',
    name: 'West Wellega',
    oromoName: 'Wallagga Lixaa',
    capital: 'Gimbi',
    capitalCoords: [9.1667, 35.8333],
    description: 'Western frontier region',
    population: '~2M',
    color: '#047857'
  },
  {
    id: 'jimma',
    name: 'Jimma Zone',
    oromoName: 'Jimmaa',
    capital: 'Jimma',
    capitalCoords: [7.6667, 36.8333],
    description: 'Birthplace of coffee, historical kingdom',
    population: '~3M',
    color: '#065F46'
  },
  {
    id: 'ilubabor',
    name: 'Ilubabor',
    oromoName: 'Iluu Abbaa Booraa',
    capital: 'Metu',
    capitalCoords: [8.3000, 35.5833],
    description: 'Dense forests, coffee region',
    population: '~1.5M',
    color: '#064E3B'
  },
  {
    id: 'arsi',
    name: 'Arsi Zone',
    oromoName: 'Arsii',
    capital: 'Asella',
    capitalCoords: [7.9500, 39.1333],
    description: 'Home to Olympic champion runners',
    population: '~3.5M',
    color: '#10B981'
  },
  {
    id: 'west-arsi',
    name: 'West Arsi',
    oromoName: 'Arsii Lixaa',
    capital: 'Shashemene',
    capitalCoords: [7.2000, 38.6000],
    description: 'Gateway to the south',
    population: '~2.5M',
    color: '#059669'
  },
  {
    id: 'bale',
    name: 'Bale Zone',
    oromoName: 'Baalee',
    capital: 'Robe',
    capitalCoords: [7.1167, 40.0000],
    description: 'Bale Mountains National Park, endemic wildlife',
    population: '~1.8M',
    color: '#047857'
  },
  {
    id: 'east-hararghe',
    name: 'East Hararghe',
    oromoName: 'Harargee Bahaa',
    capital: 'Harar',
    capitalCoords: [9.3117, 42.1200],
    description: 'Historic walled city of Harar',
    population: '~3M',
    color: '#10B981'
  },
  {
    id: 'west-hararghe',
    name: 'West Hararghe',
    oromoName: 'Harargee Lixaa',
    capital: 'Chiro',
    capitalCoords: [9.0667, 40.8667],
    description: 'Agricultural heartland',
    population: '~2M',
    color: '#059669'
  },
  {
    id: 'borana',
    name: 'Borana Zone',
    oromoName: 'Booranaa',
    capital: 'Yabello',
    capitalCoords: [4.8833, 38.0833],
    description: 'Pastoralist traditions, preserved Gadaa system',
    population: '~1M',
    color: '#065F46'
  },
  {
    id: 'guji',
    name: 'Guji Zone',
    oromoName: 'Gujii',
    capital: 'Negele',
    capitalCoords: [5.3167, 39.5833],
    description: 'Known for gold mining and specialty coffee',
    population: '~1.7M',
    color: '#047857'
  },
  {
    id: 'horo-guduru',
    name: 'Horo Guduru Wellega',
    oromoName: 'Horoo Guduruu',
    capital: 'Shambu',
    capitalCoords: [9.5667, 37.1000],
    description: 'Lake Fincha hydroelectric region',
    population: '~700K',
    color: '#34D399'
  },
]

// Approximate Oromia boundary coordinates
const OROMIA_BOUNDARY: [number, number][] = [
  [10.5, 34.5], [10.8, 36.0], [10.5, 37.5], [10.0, 38.5], [9.8, 39.5],
  [9.5, 40.5], [9.2, 41.5], [8.8, 42.5], [8.0, 43.0], [7.0, 42.5],
  [6.0, 41.5], [5.0, 40.5], [4.5, 39.5], [4.2, 38.5], [4.5, 37.5],
  [5.0, 36.5], [5.5, 35.5], [6.5, 34.8], [7.5, 34.5], [8.5, 34.2],
  [9.5, 34.3], [10.5, 34.5]
]

// Create custom marker icon
const createCustomIcon = (color: string = '#10B981') => {
  if (typeof window === 'undefined') return undefined

  return L.divIcon({
    className: 'custom-marker',
    html: `
      <svg width="28" height="36" viewBox="0 0 28 36" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M14 0C6.268 0 0 6.268 0 14c0 10.5 14 22 14 22s14-11.5 14-22c0-7.732-6.268-14-14-14z" fill="${color}" stroke="#fff" stroke-width="2"/>
        <circle cx="14" cy="14" r="5" fill="white"/>
      </svg>
    `,
    iconSize: [28, 36],
    iconAnchor: [14, 36],
    popupAnchor: [0, -36],
  })
}

export function OromiaMap() {
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Loading state
  if (!mounted) {
    return (
      <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
        <h2 className="text-2xl font-bold text-white mb-4">Explore Oromia</h2>
        <div className="aspect-[16/10] bg-slate-900 rounded-xl animate-pulse flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <span className="text-slate-400">Loading interactive map...</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Map */}
        <div className="w-full lg:w-2/3">
          <h2 className="text-2xl font-bold text-white mb-2">Explore Oromia</h2>
          <p className="text-slate-400 mb-4">Click on a city marker to learn more about each region</p>

          <div className="aspect-[16/10] rounded-xl overflow-hidden border border-slate-700">
            <MapContainer
              center={[8.0, 38.5]}
              zoom={6}
              style={{ height: '100%', width: '100%' }}
              scrollWheelZoom={true}
            >
              {/* Dark map tiles from CartoDB */}
              <TileLayer
                attribution='&copy; <a href="https://carto.com/">CARTO</a>'
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              />

              {/* Oromia boundary polygon */}
              <Polygon
                positions={OROMIA_BOUNDARY}
                pathOptions={{
                  color: '#10B981',
                  weight: 3,
                  fillColor: '#10B981',
                  fillOpacity: 0.15,
                  dashArray: '5, 10',
                }}
              />

              {/* City markers */}
              {OROMIA_REGIONS.map(region => (
                <Marker
                  key={region.id}
                  position={region.capitalCoords}
                  icon={createCustomIcon(region.color)}
                  eventHandlers={{
                    click: () => setSelectedRegion(region),
                  }}
                >
                  <Popup>
                    <div className="min-w-[180px]">
                      <h3 className="font-bold text-white text-base">{region.name}</h3>
                      <p className="text-amber-400 text-sm">{region.oromoName}</p>
                      <p className="text-slate-400 text-xs mt-1">Capital: {region.capital}</p>
                      <p className="text-slate-400 text-xs">Pop: {region.population}</p>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>

          {/* Map Legend */}
          <div className="flex items-center gap-6 mt-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-emerald-500"></div>
              <span className="text-slate-400">Oromia Regions</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-amber-500"></div>
              <span className="text-slate-400">Capital (Finfinnee)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-1 bg-emerald-500 opacity-50"></div>
              <span className="text-slate-400">Approximate Border</span>
            </div>
          </div>
        </div>

        {/* Info Panel */}
        <div className="w-full lg:w-1/3 space-y-4">
          {selectedRegion ? (
            <div className="bg-slate-900 rounded-xl p-6 border border-slate-700">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-white">{selectedRegion.name}</h3>
                  <p className="text-amber-400">{selectedRegion.oromoName}</p>
                </div>
                <button
                  onClick={() => setSelectedRegion(null)}
                  className="text-slate-500 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between py-2 border-b border-slate-700">
                  <span className="text-slate-400">Capital</span>
                  <span className="text-white font-medium">{selectedRegion.capital}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-700">
                  <span className="text-slate-400">Population</span>
                  <span className="text-white font-medium">{selectedRegion.population}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-700">
                  <span className="text-slate-400">Coordinates</span>
                  <span className="text-white font-medium text-xs">
                    {selectedRegion.capitalCoords[0].toFixed(2)}°N, {selectedRegion.capitalCoords[1].toFixed(2)}°E
                  </span>
                </div>
                <p className="text-slate-300 pt-2">{selectedRegion.description}</p>
              </div>

              <Link
                href={`/wiki/regions/${selectedRegion.id}`}
                className="mt-6 block w-full bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-lg text-center font-medium transition-colors"
              >
                Explore {selectedRegion.name} →
              </Link>
            </div>
          ) : (
            <div className="bg-slate-900 rounded-xl p-6 border border-slate-700">
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🗺️</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Select a Region</h3>
                <p className="text-slate-400 text-sm">
                  Click on any marker on the map to learn about Oromia&apos;s diverse regions, cities, and cultures.
                </p>
              </div>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-900 rounded-xl p-4 border border-slate-700 text-center">
              <p className="text-3xl font-bold text-emerald-400">16</p>
              <p className="text-slate-400 text-sm">Major Zones</p>
            </div>
            <div className="bg-slate-900 rounded-xl p-4 border border-slate-700 text-center">
              <p className="text-3xl font-bold text-amber-400">40M+</p>
              <p className="text-slate-400 text-sm">Population</p>
            </div>
            <div className="bg-slate-900 rounded-xl p-4 border border-slate-700 text-center">
              <p className="text-3xl font-bold text-white">353K</p>
              <p className="text-slate-400 text-sm">km² Area</p>
            </div>
            <div className="bg-slate-900 rounded-xl p-4 border border-slate-700 text-center">
              <p className="text-3xl font-bold text-white">35%</p>
              <p className="text-slate-400 text-sm">of Ethiopia</p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="bg-slate-900 rounded-xl p-4 border border-slate-700">
            <h4 className="font-semibold text-white mb-3">Quick Links</h4>
            <div className="space-y-2">
              <Link href="/wiki/category/geography" className="flex items-center gap-2 text-slate-300 hover:text-emerald-400 text-sm transition-colors">
                <span>🗺️</span> All Geography Articles
              </Link>
              <Link href="/wiki/gadaa-system" className="flex items-center gap-2 text-slate-300 hover:text-emerald-400 text-sm transition-colors">
                <span>📜</span> The Gadaa System
              </Link>
              <Link href="/wiki/irreecha-festival" className="flex items-center gap-2 text-slate-300 hover:text-emerald-400 text-sm transition-colors">
                <span>🎭</span> Irreecha Festival
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Region Quick Select */}
      <div className="mt-6 pt-6 border-t border-slate-700">
        <h4 className="text-white font-semibold mb-4">All Regions</h4>
        <div className="flex flex-wrap gap-2">
          {OROMIA_REGIONS.map(region => (
            <button
              key={region.id}
              onClick={() => setSelectedRegion(region)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedRegion?.id === region.id
                  ? 'bg-emerald-500 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600 hover:text-white'
              }`}
            >
              {region.capital}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
