import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { JobFilters } from '@/components/careers/job-filters'
import { Job } from '@/types/careers'

// Mock data - replace with Supabase fetch
const mockJobs: Job[] = [
  {
    id: '1',
    title: 'Software Engineer',
    company_name: 'Oromo Tech Solutions',
    location: 'Minneapolis, MN',
    job_type: 'full-time',
    salary_min: 80000,
    salary_max: 120000,
    description: 'We are looking for a talented software engineer to join our growing team. You will work on building scalable web applications using modern technologies.',
    status: 'active',
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    title: 'Community Outreach Coordinator',
    company_name: 'Oromo Community Center',
    location: 'Washington, DC',
    job_type: 'full-time',
    salary_min: 45000,
    salary_max: 55000,
    description: 'Join us in building stronger connections within the Oromo diaspora community. Coordinate events, programs, and community initiatives.',
    status: 'active',
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    title: 'Afaan Oromoo Language Instructor',
    company_name: 'Cultural Heritage Foundation',
    location: 'Remote',
    job_type: 'part-time',
    salary_min: 30,
    salary_max: 50,
    description: 'Teach Afaan Oromoo to students of all ages. Help preserve and spread our beautiful language to the next generation.',
    status: 'active',
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '4',
    title: 'Marketing Specialist',
    company_name: 'Oromia Business Network',
    location: 'Atlanta, GA',
    job_type: 'full-time',
    salary_min: 55000,
    salary_max: 75000,
    description: 'Drive marketing initiatives to promote Oromo-owned businesses. Create compelling content and manage social media campaigns.',
    status: 'active',
    created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '5',
    title: 'Legal Intern',
    company_name: 'Oromo Legal Aid',
    location: 'New York, NY',
    job_type: 'internship',
    salary_min: null,
    salary_max: null,
    description: 'Gain valuable experience in immigration and civil rights law while helping community members navigate legal challenges.',
    status: 'active',
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '6',
    title: 'Healthcare Navigator',
    company_name: 'Community Health Services',
    location: 'Seattle, WA',
    job_type: 'contract',
    salary_min: 25,
    salary_max: 35,
    description: 'Help community members access healthcare services. Bilingual in Afaan Oromoo and English required.',
    status: 'active',
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
]

const locations = ['Remote', 'Minneapolis, MN', 'Washington, DC', 'Atlanta, GA', 'New York, NY', 'Seattle, WA']

export default function CareersPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <JobFilters jobs={mockJobs} locations={locations} />
      </main>
      <Footer />
    </div>
  )
}
