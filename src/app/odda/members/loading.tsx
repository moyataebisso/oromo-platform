import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent } from '@/components/ui/card'

export default function MembersLoading() {
  return (
    <div className="bg-background">
      <div className="border-b">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <Skeleton className="h-8 w-32" />
        </div>
      </div>

      <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-background border-b">
        <div className="mx-auto max-w-7xl px-4 py-8">
          <Skeleton className="h-8 w-48 mb-4" />
          <div className="flex gap-4 max-w-3xl">
            <Skeleton className="h-10 flex-1" />
            <Skeleton className="h-10 flex-1" />
            <Skeleton className="h-10 w-24" />
          </div>
        </div>
      </div>

      <main className="py-8 px-4">
        <div className="mx-auto max-w-7xl">
          <Skeleton className="h-5 w-32 mb-6" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <Skeleton className="h-20 w-20 rounded-full mx-auto mb-4" />
                    <Skeleton className="h-6 w-32 mx-auto mb-2" />
                    <Skeleton className="h-4 w-48 mx-auto mb-4" />
                    <Skeleton className="h-4 w-24 mx-auto mb-4" />
                    <Skeleton className="h-9 w-full" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
