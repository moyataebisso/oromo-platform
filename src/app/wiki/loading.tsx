import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

export default function WikiLoading() {
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
          <Skeleton className="h-12 w-72 mx-auto mb-4" />
          <Skeleton className="h-6 w-[400px] mx-auto mb-6" />
          <Skeleton className="h-12 w-96 mx-auto" />
        </div>

        {/* Categories Skeleton */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-24 rounded-full" />
          ))}
        </div>

        {/* Featured Article Skeleton */}
        <Card className="mb-8 overflow-hidden">
          <div className="grid md:grid-cols-2 gap-6">
            <Skeleton className="h-64" />
            <CardContent className="p-6">
              <Skeleton className="h-5 w-20 mb-4" />
              <Skeleton className="h-8 w-full mb-4" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4 mb-4" />
              <Skeleton className="h-10 w-32" />
            </CardContent>
          </div>
        </Card>

        {/* Article Grid Skeleton */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-5 w-20 mb-2" />
                <Skeleton className="h-6 w-full" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3 mb-4" />
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-16" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
