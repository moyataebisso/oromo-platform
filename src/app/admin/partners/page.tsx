'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Search,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Plus,
  Building2,
  Star,
  Home,
  ExternalLink,
  Loader2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { createClient } from '@/lib/supabase/client'

interface Partner {
  id: string
  name: string
  slug: string
  description: string | null
  logo_url: string | null
  website: string | null
  is_featured: boolean
  show_on_homepage: boolean
  status: string
  created_at: string
}

export default function AdminPartnersPage() {
  const router = useRouter()
  const [partners, setPartners] = useState<Partner[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState<string | null>(null)
  const [deletePartner, setDeletePartner] = useState<Partner | null>(null)

  // Fetch partners
  const fetchPartners = async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('businesses')
        .select('id, name, slug, description, logo_url, website, is_featured, show_on_homepage, status, created_at')
        .or('is_featured.eq.true,show_on_homepage.eq.true')
        .order('name')

      if (error) {
        console.error('Error fetching partners:', error)
      } else {
        setPartners(data || [])
      }
    } catch (err) {
      console.error('Error fetching partners:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchPartners()
  }, [])

  // Filter partners by search
  const filteredPartners = partners.filter(partner =>
    partner.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    partner.website?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Toggle featured status
  const handleToggleFeatured = async (id: string, currentValue: boolean) => {
    setIsUpdating(id)
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('businesses')
        .update({ is_featured: !currentValue, updated_at: new Date().toISOString() } as never)
        .eq('id', id)

      if (error) {
        console.error('Error updating partner:', error)
      } else {
        setPartners(partners.map(p =>
          p.id === id ? { ...p, is_featured: !currentValue } : p
        ))
      }
    } catch (err) {
      console.error('Error updating partner:', err)
    } finally {
      setIsUpdating(null)
    }
  }

  // Toggle show on homepage status
  const handleToggleHomepage = async (id: string, currentValue: boolean) => {
    setIsUpdating(id)
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('businesses')
        .update({ show_on_homepage: !currentValue, updated_at: new Date().toISOString() } as never)
        .eq('id', id)

      if (error) {
        console.error('Error updating partner:', error)
      } else {
        setPartners(partners.map(p =>
          p.id === id ? { ...p, show_on_homepage: !currentValue } : p
        ))
      }
    } catch (err) {
      console.error('Error updating partner:', err)
    } finally {
      setIsUpdating(null)
    }
  }

  // Delete partner
  const handleDelete = async () => {
    if (!deletePartner) return

    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('businesses')
        .delete()
        .eq('id', deletePartner.id)

      if (error) {
        console.error('Error deleting partner:', error)
      } else {
        setPartners(partners.filter(p => p.id !== deletePartner.id))
      }
    } catch (err) {
      console.error('Error deleting partner:', err)
    } finally {
      setDeletePartner(null)
    }
  }

  const featuredCount = partners.filter(p => p.is_featured).length
  const homepageCount = partners.filter(p => p.show_on_homepage).length
  const withLogoCount = partners.filter(p => p.logo_url).length

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Featured Partners Management</h1>
          <p className="text-muted-foreground">Manage partners displayed on the homepage</p>
        </div>
        <Button onClick={() => router.push('/admin/partners/add')}>
          <Plus className="w-4 h-4 mr-2" />
          Add Partner
        </Button>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-4 gap-4">
        <Card className="bg-card/50 border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{partners.length}</p>
                <p className="text-sm text-muted-foreground">Total Partners</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                <Star className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{featuredCount}</p>
                <p className="text-sm text-muted-foreground">Featured</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center">
                <Home className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{homepageCount}</p>
                <p className="text-sm text-muted-foreground">On Homepage</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{withLogoCount}</p>
                <p className="text-sm text-muted-foreground">With Logo</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card className="bg-card/50 border-border/50">
        <CardContent className="p-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search partners..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Partners Table */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle>Partners ({filteredPartners.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-border/50 hover:bg-transparent">
                <TableHead>Logo</TableHead>
                <TableHead>Partner</TableHead>
                <TableHead>Website</TableHead>
                <TableHead>Featured</TableHead>
                <TableHead>On Homepage</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPartners.map((partner) => (
                <TableRow key={partner.id} className="border-border/50">
                  <TableCell>
                    <div className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center overflow-hidden">
                      {partner.logo_url ? (
                        <img
                          src={partner.logo_url}
                          alt={partner.name}
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <Building2 className="w-6 h-6 text-gray-400" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium text-foreground">{partner.name}</p>
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {partner.description || 'No description'}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    {partner.website ? (
                      <a
                        href={partner.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-primary hover:underline text-sm"
                      >
                        <ExternalLink className="w-3 h-3" />
                        {new URL(partner.website).hostname}
                      </a>
                    ) : (
                      <span className="text-muted-foreground text-sm">No website</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={partner.is_featured}
                      onCheckedChange={() => handleToggleFeatured(partner.id, partner.is_featured)}
                      disabled={isUpdating === partner.id}
                    />
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={partner.show_on_homepage}
                      onCheckedChange={() => handleToggleHomepage(partner.id, partner.show_on_homepage)}
                      disabled={isUpdating === partner.id}
                    />
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={
                        partner.status === 'active' || partner.status === 'approved'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                      }
                    >
                      {partner.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {partner.website && (
                          <DropdownMenuItem asChild>
                            <a href={partner.website} target="_blank" rel="noopener noreferrer">
                              <Eye className="w-4 h-4 mr-2" />
                              Visit Website
                            </a>
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem onClick={() => router.push(`/admin/partners/${partner.id}/edit`)}>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => setDeletePartner(partner)}
                          className="text-red-400"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {filteredPartners.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    {searchQuery ? 'No partners found matching your search' : 'No partners yet. Add your first partner!'}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletePartner} onOpenChange={() => setDeletePartner(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Partner</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{deletePartner?.name}&quot;? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
