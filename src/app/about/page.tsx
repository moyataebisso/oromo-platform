import { Users, Target, Heart, Globe } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'

const values = [
  {
    icon: Users,
    title: 'Community',
    description: 'Building connections across the global Oromo diaspora, fostering unity and collaboration.',
  },
  {
    icon: Target,
    title: 'Education',
    description: 'Providing accessible learning resources to preserve and promote Oromo language and culture.',
  },
  {
    icon: Heart,
    title: 'Heritage',
    description: 'Documenting and celebrating our rich history, traditions, and cultural practices.',
  },
  {
    icon: Globe,
    title: 'Opportunity',
    description: 'Creating pathways for professional growth and economic empowerment within our community.',
  },
]

const team = [
  { name: 'Bekele Abera', role: 'Founder & CEO', bio: 'Passionate technologist dedicated to empowering the Oromo community.' },
  { name: 'Chaltu Daba', role: 'Head of Education', bio: 'Educator with 15+ years experience in language preservation.' },
  { name: 'Abdii Tolessa', role: 'Community Director', bio: 'Community organizer connecting Oromo people worldwide.' },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="py-16 bg-gradient-to-b from-blue-50 to-white">
          <div className="mx-auto max-w-7xl px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900">
              About Odda Academy
            </h1>
            <p className="mt-6 text-xl text-slate-600 max-w-3xl mx-auto">
              We&apos;re building the premier digital home for the 40+ million Oromo people worldwide,
              connecting our community through education, careers, and shared knowledge.
            </p>
          </div>
        </section>

        {/* Mission */}
        <section className="py-16">
          <div className="mx-auto max-w-7xl px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-slate-900 mb-6">Our Mission</h2>
                <p className="text-lg text-slate-600 mb-4">
                  Odda Academy was founded with a simple yet powerful mission: to connect,
                  educate, and empower the global Oromo community through technology.
                </p>
                <p className="text-lg text-slate-600 mb-4">
                  We believe that by preserving our language, celebrating our culture, and
                  creating economic opportunities, we can ensure that future generations
                  remain connected to their heritage while thriving in the modern world.
                </p>
                <p className="text-lg text-slate-600">
                  Whether you&apos;re learning Afaan Oromoo for the first time, seeking career
                  opportunities, or contributing to our collective knowledge base, the
                  Odda Academy is your digital home.
                </p>
              </div>
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-8 text-white">
                <h3 className="text-2xl font-bold mb-4">By the Numbers</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-4xl font-bold">40M+</p>
                    <p className="text-blue-100">Oromo People</p>
                  </div>
                  <div>
                    <p className="text-4xl font-bold">50+</p>
                    <p className="text-blue-100">Countries</p>
                  </div>
                  <div>
                    <p className="text-4xl font-bold">500+</p>
                    <p className="text-blue-100">Resources</p>
                  </div>
                  <div>
                    <p className="text-4xl font-bold">1000+</p>
                    <p className="text-blue-100">Community Members</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-16 bg-slate-50">
          <div className="mx-auto max-w-7xl px-4">
            <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">Our Values</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value) => (
                <Card key={value.title}>
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
                      <value.icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">{value.title}</h3>
                    <p className="text-slate-600">{value.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="py-16">
          <div className="mx-auto max-w-7xl px-4">
            <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">Our Team</h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {team.map((member) => (
                <div key={member.name} className="text-center">
                  <div className="w-24 h-24 rounded-full bg-slate-200 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-900">{member.name}</h3>
                  <p className="text-blue-600 text-sm mb-2">{member.role}</p>
                  <p className="text-slate-600 text-sm">{member.bio}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
