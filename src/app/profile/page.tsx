import Link from 'next/link'
import { Settings, BookOpen, Briefcase, FileText, Calendar, MapPin, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { ProfileCompletion } from '@/components/profile/profile-completion'

// Mock user data
const mockUser = {
  id: '1',
  email: 'bekele@example.com',
  display_name: 'Bekele Abera',
  username: 'bekele_a',
  bio: 'Passionate about preserving Oromo culture and language. Software engineer by profession, cultural advocate by heart.',
  avatar_url: null,
  location: 'Minneapolis, MN',
  phone: null,
  website: null,
  linkedin_url: 'https://linkedin.com/in/bekele',
  skills: ['Software Development', 'Afaan Oromoo'],
  created_at: '2024-01-15',
  role: 'user',
}

const enrolledCourses = [
  { id: '1', title: 'Introduction to Afaan Oromoo', progress: 75 },
  { id: '2', title: 'Oromo History: From Ancient Times', progress: 45 },
  { id: '3', title: 'Gadaa System Deep Dive', progress: 10 },
]

const savedJobs = [
  { id: '1', title: 'Software Engineer', company: 'Oromo Tech Solutions' },
  { id: '2', title: 'Community Coordinator', company: 'Oromo Community Center' },
]

const contributions = [
  { id: '1', title: 'The Gadaa System: Ancient Democratic Governance', type: 'article', date: '2024-03-10' },
  { id: '2', title: 'Corrected spelling in Qubee article', type: 'edit', date: '2024-03-15' },
]

export default function ProfilePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {/* Profile Header */}
              <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row items-start gap-6">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={mockUser.avatar_url || undefined} />
                  <AvatarFallback className="text-2xl">{mockUser.display_name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h1 className="text-2xl font-bold text-slate-900">{mockUser.display_name}</h1>
                      <p className="text-slate-600">@{mockUser.username}</p>
                    </div>
                    <Button variant="outline" asChild>
                      <Link href="/profile/edit">
                        <Settings className="w-4 h-4 mr-2" />
                        Edit Profile
                      </Link>
                    </Button>
                  </div>
                  <p className="mt-3 text-slate-700">{mockUser.bio}</p>
                  <div className="flex flex-wrap gap-4 mt-4 text-sm text-slate-600">
                    {mockUser.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {mockUser.location}
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Mail className="w-4 h-4" />
                      {mockUser.email}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Joined {new Date(mockUser.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabs */}
          <Tabs defaultValue="courses" className="space-y-6">
            <TabsList>
              <TabsTrigger value="courses">My Courses</TabsTrigger>
              <TabsTrigger value="jobs">Saved Jobs</TabsTrigger>
              <TabsTrigger value="contributions">Contributions</TabsTrigger>
            </TabsList>

            <TabsContent value="courses">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    Enrolled Courses
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {enrolledCourses.map((course) => (
                      <div key={course.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                        <div>
                          <h3 className="font-medium text-slate-900">{course.title}</h3>
                          <p className="text-sm text-slate-600">{course.progress}% complete</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="w-32 h-2 bg-slate-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-blue-600 rounded-full"
                              style={{ width: `${course.progress}%` }}
                            />
                          </div>
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/academy/course/${course.id}`}>Continue</Link>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="jobs">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="w-5 h-5" />
                    Saved Jobs
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {savedJobs.map((job) => (
                      <div key={job.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                        <div>
                          <h3 className="font-medium text-slate-900">{job.title}</h3>
                          <p className="text-sm text-slate-600">{job.company}</p>
                        </div>
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/careers/${job.id}`}>View</Link>
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="contributions">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Wiki Contributions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {contributions.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                        <div>
                          <h3 className="font-medium text-slate-900">{item.title}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="capitalize">{item.type}</Badge>
                            <span className="text-sm text-slate-600">{new Date(item.date).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">View</Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
            </div>

            {/* Sidebar with Profile Completion */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <ProfileCompletion profile={mockUser} />
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
