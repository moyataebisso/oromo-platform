import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

export default function CareersLoading() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header Skeleton */}
      <div className="h-16 bg-white border-b">
        <div className="mx-auto max-w-7xl px-4 h-full flex items-center justify-between">
          <Skeleton className="h-8 w-24" />
          <div className="flex gap-4">
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-20" />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8">
        {/* Hero Skeleton */}
        <div className="mb-12 text-center">
          <Skeleton className="h-12 w-80 mx-auto mb-4" />
          <Skeleton className="h-6 w-[450px] mx-auto" />
        </div>

        {/* Search Bar Skeleton */}
        <div className="flex flex-wrap gap-4 mb-8 p-6 bg-white rounded-xl shadow-sm">
          <Skeleton className="h-12 flex-1 min-w-[200px]" />
          <Skeleton className="h-12 w-40" />
          <Skeleton className="h-12 w-32" />
          <Skeleton className="h-12 w-28" />
        </div>

        {/* Stats Skeleton */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white p-4 rounded-lg">
              <Skeleton className="h-8 w-16 mb-2" />
              <Skeleton className="h-4 w-24" />
            </div>
          ))}
        </div>

        {/* Job List Skeleton */}
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Card key={i} className="p-6">
              <div className="flex items-start gap-4">
                <Skeleton className="h-16 w-16 rounded-lg flex-shrink-0" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-5 w-16" />
                  </div>
                  <Skeleton className="h-5 w-32 mb-2" />
                  <div className="flex flex-wrap gap-3">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-28" />
                  </div>
                </div>
                <Skeleton className="h-10 w-24" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
