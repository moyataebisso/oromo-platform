'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  GraduationCap,
  BookOpen,
  PenTool,
  DollarSign,
  Calendar,
  Target,
  CheckCircle2,
  Clock,
  ArrowRight,
  Star,
  ExternalLink,
  FileText,
  Search,
  Filter,
  ChevronDown,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'

// Mock user grade
const userGrade = '11'

// College prep timeline data
const timelineData = [
  {
    grade: '9',
    title: 'Freshman Year',
    subtitle: 'Building Your Foundation',
    tasks: [
      { text: 'Focus on getting good grades in core subjects', completed: true },
      { text: 'Explore different extracurricular activities', completed: true },
      { text: 'Start building relationships with teachers', completed: true },
      { text: 'Begin community service or volunteer work', completed: true },
      { text: 'Create a file to track achievements and activities', completed: true },
    ],
    resources: ['Study Skills Guide', 'Extracurricular Ideas'],
  },
  {
    grade: '10',
    title: 'Sophomore Year',
    subtitle: 'Exploring Opportunities',
    tasks: [
      { text: 'Take the PSAT for practice', completed: true },
      { text: 'Continue building extracurriculars - aim for leadership roles', completed: true },
      { text: 'Research potential college majors and careers', completed: true },
      { text: 'Start visiting local college campuses', completed: true },
      { text: 'Consider taking AP or honors courses', completed: false },
    ],
    resources: ['PSAT Prep Guide', 'College Major Explorer'],
  },
  {
    grade: '11',
    title: 'Junior Year',
    subtitle: 'Critical Planning Year',
    current: true,
    tasks: [
      { text: 'Take the PSAT/NMSQT in October', completed: true },
      { text: 'Take SAT or ACT (ideally spring of junior year)', completed: false },
      { text: 'Research and visit colleges', completed: false },
      { text: 'Start working on college essays', completed: false },
      { text: 'Request letters of recommendation', completed: false },
      { text: 'Research and apply for scholarships', completed: false },
      { text: 'Take SAT Subject Tests if required', completed: false },
    ],
    resources: ['SAT Prep Course', 'Essay Writing Workshop', 'Scholarship Guide'],
  },
  {
    grade: '12',
    title: 'Senior Year',
    subtitle: 'Application Season',
    tasks: [
      { text: 'Finalize college list (safety, match, reach)', completed: false },
      { text: 'Complete and submit applications', completed: false },
      { text: 'Apply for financial aid (FAFSA opens Oct 1)', completed: false },
      { text: 'Keep grades up - colleges check senior year!', completed: false },
      { text: 'Compare offers and make your decision', completed: false },
      { text: 'Send enrollment deposit by May 1', completed: false },
    ],
    resources: ['Application Checklist', 'Financial Aid Guide', 'Decision Making Framework'],
  },
]

// SAT/ACT Resources
const testPrepResources = [
  {
    id: '1',
    title: 'SAT Math Fundamentals',
    type: 'Course',
    duration: '20 hours',
    progress: 45,
    rating: 4.8,
  },
  {
    id: '2',
    title: 'SAT Reading & Writing',
    type: 'Course',
    duration: '18 hours',
    progress: 30,
    rating: 4.9,
  },
  {
    id: '3',
    title: 'ACT Science Strategies',
    type: 'Course',
    duration: '12 hours',
    progress: 0,
    rating: 4.7,
  },
  {
    id: '4',
    title: 'Practice Test #1',
    type: 'Practice Test',
    duration: '3 hours',
    progress: 100,
    rating: null,
  },
  {
    id: '5',
    title: 'Practice Test #2',
    type: 'Practice Test',
    duration: '3 hours',
    progress: 0,
    rating: null,
  },
]

// Scholarships
const scholarships = [
  {
    id: '1',
    name: 'Oromo Youth Excellence Scholarship',
    amount: '$5,000',
    deadline: 'Feb 15, 2024',
    eligibility: 'Oromo students, GPA 3.0+',
    status: 'open',
  },
  {
    id: '2',
    name: 'STEM Future Leaders Award',
    amount: '$10,000',
    deadline: 'Mar 1, 2024',
    eligibility: 'STEM majors, GPA 3.5+',
    status: 'open',
  },
  {
    id: '3',
    name: 'Community Service Scholarship',
    amount: '$2,500',
    deadline: 'Apr 1, 2024',
    eligibility: '100+ volunteer hours',
    status: 'open',
  },
  {
    id: '4',
    name: 'First Generation College Student Award',
    amount: '$7,500',
    deadline: 'Jan 31, 2024',
    eligibility: 'First-gen students',
    status: 'closing_soon',
  },
]

// Essay guides
const essayGuides = [
  { id: '1', title: 'Common App Essay Prompts 2024', type: 'Guide', readTime: '10 min' },
  { id: '2', title: 'How to Write a Compelling Personal Statement', type: 'Tutorial', readTime: '15 min' },
  { id: '3', title: 'Brainstorming Your Essay Topic', type: 'Workshop', readTime: '20 min' },
  { id: '4', title: 'Editing and Polishing Your Essay', type: 'Guide', readTime: '12 min' },
  { id: '5', title: 'Sample Essays That Worked', type: 'Examples', readTime: '30 min' },
]

export default function CollegePrepPage() {
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <div className="py-8 px-4">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">College Prep Center</h1>
              <p className="text-slate-600">Everything you need to get into your dream college</p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-blue-50 border-blue-100">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-3">
                <Target className="w-8 h-8 text-blue-600" />
                <div>
                  <p className="text-sm text-blue-600 font-medium">SAT Score</p>
                  <p className="text-2xl font-bold text-slate-900">1280</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-green-50 border-green-100">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
                <div>
                  <p className="text-sm text-green-600 font-medium">Tasks Done</p>
                  <p className="text-2xl font-bold text-slate-900">15/28</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-yellow-50 border-yellow-100">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-3">
                <DollarSign className="w-8 h-8 text-yellow-600" />
                <div>
                  <p className="text-sm text-yellow-600 font-medium">Scholarships</p>
                  <p className="text-2xl font-bold text-slate-900">$25K+</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-purple-50 border-purple-100">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-3">
                <FileText className="w-8 h-8 text-purple-600" />
                <div>
                  <p className="text-sm text-purple-600 font-medium">Essays</p>
                  <p className="text-2xl font-bold text-slate-900">1 Draft</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="timeline" className="space-y-6">
          <TabsList className="grid grid-cols-4 w-full max-w-xl">
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="test-prep">Test Prep</TabsTrigger>
            <TabsTrigger value="scholarships">Scholarships</TabsTrigger>
            <TabsTrigger value="essays">Essays</TabsTrigger>
          </TabsList>

          {/* Timeline Tab */}
          <TabsContent value="timeline" className="space-y-6">
            <div className="space-y-6">
              {timelineData.map((year, index) => (
                <Card
                  key={year.grade}
                  className={cn(
                    'relative',
                    year.current && 'ring-2 ring-blue-500 shadow-lg'
                  )}
                >
                  {year.current && (
                    <div className="absolute -top-3 left-4">
                      <span className="bg-blue-600 text-white text-sm px-3 py-1 rounded-full font-medium">
                        You are here
                      </span>
                    </div>
                  )}
                  <CardHeader className={year.current ? 'pt-8' : ''}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div
                          className={cn(
                            'w-14 h-14 rounded-xl flex items-center justify-center text-xl font-bold',
                            year.current
                              ? 'bg-blue-600 text-white'
                              : parseInt(year.grade) <= parseInt(userGrade)
                              ? 'bg-green-100 text-green-700'
                              : 'bg-slate-100 text-slate-400'
                          )}
                        >
                          {year.grade}
                        </div>
                        <div>
                          <CardTitle className="text-xl">{year.title}</CardTitle>
                          <CardDescription>{year.subtitle}</CardDescription>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-slate-500">Progress</p>
                        <p className="text-lg font-bold text-slate-900">
                          {year.tasks.filter(t => t.completed).length}/{year.tasks.length}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <h4 className="font-medium text-slate-700 mb-3">Key Tasks</h4>
                        {year.tasks.map((task, i) => (
                          <label
                            key={i}
                            className={cn(
                              'flex items-start gap-3 p-2 rounded-lg cursor-pointer transition-colors',
                              task.completed ? 'bg-green-50' : 'hover:bg-slate-50'
                            )}
                          >
                            <div className={cn(
                              'w-5 h-5 rounded border-2 flex items-center justify-center mt-0.5',
                              task.completed
                                ? 'bg-green-500 border-green-500'
                                : 'border-slate-300'
                            )}>
                              {task.completed && (
                                <CheckCircle2 className="w-4 h-4 text-white" />
                              )}
                            </div>
                            <span className={cn(
                              'text-sm',
                              task.completed ? 'text-slate-500 line-through' : 'text-slate-700'
                            )}>
                              {task.text}
                            </span>
                          </label>
                        ))}
                      </div>
                      <div>
                        <h4 className="font-medium text-slate-700 mb-3">Resources</h4>
                        <div className="space-y-2">
                          {year.resources.map((resource, i) => (
                            <Button
                              key={i}
                              variant="outline"
                              className="w-full justify-start"
                              asChild
                            >
                              <Link href="#">
                                <BookOpen className="w-4 h-4 mr-2" />
                                {resource}
                                <ArrowRight className="w-4 h-4 ml-auto" />
                              </Link>
                            </Button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Test Prep Tab */}
          <TabsContent value="test-prep" className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Search resources..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                Filter
                <ChevronDown className="w-4 h-4 ml-2" />
              </Button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {testPrepResources.map((resource) => (
                <Card key={resource.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <span className={cn(
                        'text-xs px-2 py-1 rounded-full font-medium',
                        resource.type === 'Course'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-purple-100 text-purple-700'
                      )}>
                        {resource.type}
                      </span>
                      {resource.rating && (
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span className="text-sm font-medium">{resource.rating}</span>
                        </div>
                      )}
                    </div>
                    <h3 className="font-semibold text-slate-900 mb-2">{resource.title}</h3>
                    <div className="flex items-center gap-2 text-sm text-slate-500 mb-3">
                      <Clock className="w-4 h-4" />
                      {resource.duration}
                    </div>
                    {resource.progress > 0 ? (
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-slate-600">Progress</span>
                          <span className="font-medium">{resource.progress}%</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${resource.progress}%` }}
                          />
                        </div>
                      </div>
                    ) : (
                      <Button className="w-full" size="sm">Start Learning</Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Scholarships Tab */}
          <TabsContent value="scholarships" className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input placeholder="Search scholarships..." className="pl-10" />
              </div>
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                Filter by Amount
              </Button>
            </div>

            <div className="space-y-4">
              {scholarships.map((scholarship) => (
                <Card
                  key={scholarship.id}
                  className={cn(
                    scholarship.status === 'closing_soon' && 'border-amber-200 bg-amber-50'
                  )}
                >
                  <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-slate-900">{scholarship.name}</h3>
                          {scholarship.status === 'closing_soon' && (
                            <span className="text-xs bg-amber-200 text-amber-800 px-2 py-0.5 rounded-full">
                              Closing Soon!
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-slate-600">{scholarship.eligibility}</p>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <p className="text-2xl font-bold text-green-600">{scholarship.amount}</p>
                          <p className="text-sm text-slate-500">Deadline: {scholarship.deadline}</p>
                        </div>
                        <Button asChild>
                          <Link href="#">
                            Apply
                            <ExternalLink className="w-4 h-4 ml-2" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="bg-gradient-to-r from-green-500 to-emerald-600 text-white">
              <CardContent className="py-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold mb-1">Need More Scholarships?</h3>
                    <p className="text-white/80">Search our database of 1000+ scholarships for Oromo students</p>
                  </div>
                  <Button variant="secondary" size="lg">
                    Browse All
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Essays Tab */}
          <TabsContent value="essays" className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <PenTool className="w-5 h-5 text-purple-600" />
                      Essay Writing Guides
                    </CardTitle>
                    <CardDescription>
                      Learn how to write compelling college essays
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {essayGuides.map((guide) => (
                      <Link
                        key={guide.id}
                        href="#"
                        className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                            <FileText className="w-5 h-5 text-purple-600" />
                          </div>
                          <div>
                            <h4 className="font-medium text-slate-900">{guide.title}</h4>
                            <div className="flex items-center gap-2 text-sm text-slate-500">
                              <span>{guide.type}</span>
                              <span>•</span>
                              <span>{guide.readTime}</span>
                            </div>
                          </div>
                        </div>
                        <ArrowRight className="w-5 h-5 text-slate-400" />
                      </Link>
                    ))}
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-4">
                <Card className="bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                  <CardContent className="pt-6">
                    <PenTool className="w-10 h-10 mb-4" />
                    <h3 className="text-xl font-bold mb-2">Essay Workshop</h3>
                    <p className="text-white/80 text-sm mb-4">
                      Get personalized feedback on your college essays from mentors
                    </p>
                    <Button variant="secondary" className="w-full">
                      Start Writing
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Your Essays</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="p-3 bg-slate-50 rounded-lg">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium text-slate-900">Personal Statement</h4>
                          <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">
                            Draft
                          </span>
                        </div>
                        <p className="text-sm text-slate-500">Last edited: 2 days ago</p>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full mt-4">
                      + New Essay
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
