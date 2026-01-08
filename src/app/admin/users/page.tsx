'use client'

import { useState } from 'react'
import { Search, MoreHorizontal, Mail, Shield, Ban, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const mockUsers = [
  { id: '1', email: 'bekele@example.com', display_name: 'Bekele Abera', role: 'admin', status: 'active', created_at: '2024-01-15', avatar_url: null },
  { id: '2', email: 'chaltu@example.com', display_name: 'Chaltu Bekele', role: 'user', status: 'active', created_at: '2024-02-20', avatar_url: null },
  { id: '3', email: 'abdii@example.com', display_name: 'Abdii Tolessa', role: 'moderator', status: 'active', created_at: '2024-03-10', avatar_url: null },
  { id: '4', email: 'lelise@example.com', display_name: 'Lelise Daba', role: 'user', status: 'suspended', created_at: '2024-03-15', avatar_url: null },
  { id: '5', email: 'gurmesa@example.com', display_name: 'Gurmesa Kebede', role: 'user', status: 'active', created_at: '2024-04-01', avatar_url: null },
  { id: '6', email: 'fayisa@example.com', display_name: 'Fayisa Gemechu', role: 'user', status: 'active', created_at: '2024-04-10', avatar_url: null },
]

const roleColors = {
  admin: 'bg-red-100 text-red-700',
  moderator: 'bg-purple-100 text-purple-700',
  user: 'bg-blue-100 text-blue-700',
}

const statusColors = {
  active: 'bg-green-100 text-green-700',
  suspended: 'bg-yellow-100 text-yellow-700',
  banned: 'bg-red-100 text-red-700',
}

export default function AdminUsersPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch = user.display_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRole = roleFilter === 'all' || user.role === roleFilter
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter
    return matchesSearch && matchesRole && matchesStatus
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">User Management</h1>
          <p className="text-slate-600">Manage user accounts and permissions</p>
        </div>
        <Button>Add User</Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search by name or email..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="moderator">Moderator</SelectItem>
                <SelectItem value="user">User</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
                <SelectItem value="banned">Banned</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Users ({filteredUsers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b text-left">
                  <th className="pb-3 font-medium text-slate-600">User</th>
                  <th className="pb-3 font-medium text-slate-600">Role</th>
                  <th className="pb-3 font-medium text-slate-600">Status</th>
                  <th className="pb-3 font-medium text-slate-600">Joined</th>
                  <th className="pb-3 font-medium text-slate-600 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b last:border-0">
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={user.avatar_url || undefined} />
                          <AvatarFallback>{user.display_name[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-slate-900">{user.display_name}</p>
                          <p className="text-sm text-slate-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4">
                      <Badge className={roleColors[user.role as keyof typeof roleColors]}>
                        {user.role}
                      </Badge>
                    </td>
                    <td className="py-4">
                      <Badge className={statusColors[user.status as keyof typeof statusColors]}>
                        {user.status}
                      </Badge>
                    </td>
                    <td className="py-4 text-slate-600">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Mail className="w-4 h-4 mr-2" />
                            Send Email
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Shield className="w-4 h-4 mr-2" />
                            Change Role
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-yellow-600">
                            <Ban className="w-4 h-4 mr-2" />
                            Suspend User
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete User
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
