'use client'

import { ExternalLink, Star } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Resource, resourceCategoryColors, resourceCategoryLabels, resourceCategoryIcons } from '@/types/resources'
import { cn } from '@/lib/utils'

interface ResourceCardProps {
  resource: Resource
  featured?: boolean
}

export const ResourceCard = ({ resource, featured = false }: ResourceCardProps) => {
  const categoryIcon = resourceCategoryIcons[resource.category]
  const categoryColor = resourceCategoryColors[resource.category]

  return (
    <Card
      className={cn(
        'group bg-card/50 backdrop-blur border-border/50 overflow-hidden transition-all duration-300',
        'hover:border-primary/50 hover:shadow-xl hover:-translate-y-1',
        featured && 'md:col-span-2 lg:col-span-1'
      )}
    >
      <CardHeader className={cn('pb-3', featured && 'pb-4')}>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            {resource.logo_url ? (
              <div className="w-12 h-12 rounded-lg bg-white flex items-center justify-center overflow-hidden">
                <img
                  src={resource.logo_url}
                  alt={resource.name}
                  className="w-full h-full object-contain"
                />
              </div>
            ) : (
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center">
                <span className="text-2xl">{categoryIcon}</span>
              </div>
            )}
            <div className="flex-1 min-w-0">
              <CardTitle className={cn(
                'text-foreground group-hover:text-primary transition-colors line-clamp-1',
                featured ? 'text-xl' : 'text-lg'
              )}>
                {resource.name}
              </CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge className={cn('border text-xs', categoryColor)}>
                  {resourceCategoryLabels[resource.category]}
                </Badge>
                {resource.is_featured && (
                  <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/20 border">
                    <Star className="w-3 h-3 mr-1 fill-amber-400" />
                    Featured
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {resource.description && (
          <CardDescription className={cn(
            'text-muted-foreground mb-4',
            featured ? 'line-clamp-3' : 'line-clamp-2'
          )}>
            {resource.description}
          </CardDescription>
        )}
        <Button
          variant="outline"
          size="sm"
          className="w-full group-hover:bg-primary group-hover:text-white transition-colors"
          asChild
        >
          <a href={resource.url} target="_blank" rel="noopener noreferrer">
            Visit Website
            <ExternalLink className="w-4 h-4 ml-2" />
          </a>
        </Button>
      </CardContent>
    </Card>
  )
}
