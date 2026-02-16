import { createClient } from './server'
import type {
  ProfessionalProfile,
  Experience,
  Education,
  Skill,
  Connection,
  ConnectionStatus,
  ProfileFormData,
  ExperienceFormData,
  EducationFormData,
  MemberFilters
} from '@/types/odda'

// ============ PROFILES ============

type ProfileWithRelations = ProfessionalProfile & {
  experiences?: Experience[]
  education?: Education[]
  skills?: Skill[]
}

export async function getMyProfile(): Promise<ProfessionalProfile | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  const { data, error } = await supabase
    .from('professional_profiles')
    .select(`
      *,
      user:profiles!professional_profiles_user_id_fkey(id, display_name, username, avatar_url, email),
      experiences(*),
      education(*),
      skills(*)
    `)
    .eq('user_id', user.id)
    .single() as { data: ProfileWithRelations | null; error: Error | null }

  if (error) return null
  return data
}

export async function getProfileByUserId(userId: string): Promise<ProfessionalProfile | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('professional_profiles')
    .select(`
      *,
      user:profiles!professional_profiles_user_id_fkey(id, display_name, username, avatar_url, email),
      experiences(*),
      education(*),
      skills(*)
    `)
    .eq('user_id', userId)
    .single() as { data: ProfileWithRelations | null; error: Error | null }

  if (error || !data) return null

  // Sort experiences and education by order_index
  if (data.experiences) {
    data.experiences.sort((a: Experience, b: Experience) => a.order_index - b.order_index)
  }
  if (data.education) {
    data.education.sort((a: Education, b: Education) => a.order_index - b.order_index)
  }

  return data
}

export async function incrementProfileViews(profileId: string): Promise<void> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Don't count self views
  const { data: profile } = await supabase
    .from('professional_profiles')
    .select('user_id')
    .eq('id', profileId)
    .single() as { data: { user_id: string } | null }

  if (profile && user && profile.user_id !== user.id) {
    await supabase.rpc('increment_profile_views', { profile_id: profileId } as never)
  }
}

export async function hasProfile(): Promise<boolean> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return false

  const { count } = await supabase
    .from('professional_profiles')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)

  return (count || 0) > 0
}

export async function createProfile(profileData: ProfileFormData): Promise<ProfessionalProfile> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Must be logged in to create a profile')

  const { data: profile, error } = await supabase
    .from('professional_profiles')
    .insert({
      user_id: user.id,
      headline: profileData.headline || null,
      bio: profileData.bio || null,
      location: profileData.location || null,
      website_url: profileData.website_url || null,
      linkedin_url: profileData.linkedin_url || null,
      twitter_url: profileData.twitter_url || null,
      github_url: profileData.github_url || null,
      is_open_to_work: profileData.is_open_to_work,
      is_open_to_hire: profileData.is_open_to_hire,
    } as never)
    .select()
    .single() as { data: ProfessionalProfile | null; error: Error | null }

  if (error || !profile) throw error || new Error('Failed to create profile')
  return profile
}

export async function updateProfile(profileId: string, profileData: Partial<ProfileFormData>): Promise<void> {
  const supabase = await createClient()
  const { error } = await supabase
    .from('professional_profiles')
    .update({
      headline: profileData.headline,
      bio: profileData.bio,
      location: profileData.location,
      website_url: profileData.website_url,
      linkedin_url: profileData.linkedin_url,
      twitter_url: profileData.twitter_url,
      github_url: profileData.github_url,
      is_open_to_work: profileData.is_open_to_work,
      is_open_to_hire: profileData.is_open_to_hire,
      updated_at: new Date().toISOString(),
    } as never)
    .eq('id', profileId)

  if (error) throw error
}

// ============ EXPERIENCES ============

export async function addExperience(profileId: string, expData: ExperienceFormData): Promise<Experience> {
  const supabase = await createClient()

  // Get max order_index
  const { data: existing } = await supabase
    .from('experiences')
    .select('order_index')
    .eq('profile_id', profileId)
    .order('order_index', { ascending: false })
    .limit(1) as { data: { order_index: number }[] | null }

  const orderIndex = existing && existing.length > 0 ? existing[0].order_index + 1 : 0

  const { data: experience, error } = await supabase
    .from('experiences')
    .insert({
      profile_id: profileId,
      company_name: expData.company_name,
      title: expData.title,
      location: expData.location || null,
      start_date: expData.start_date,
      end_date: expData.is_current ? null : expData.end_date || null,
      is_current: expData.is_current,
      description: expData.description || null,
      order_index: orderIndex,
    } as never)
    .select()
    .single() as { data: Experience | null; error: Error | null }

  if (error || !experience) throw error || new Error('Failed to add experience')
  return experience
}

export async function updateExperience(experienceId: string, expData: Partial<ExperienceFormData>): Promise<void> {
  const supabase = await createClient()
  const { error } = await supabase
    .from('experiences')
    .update({
      company_name: expData.company_name,
      title: expData.title,
      location: expData.location,
      start_date: expData.start_date,
      end_date: expData.is_current ? null : expData.end_date,
      is_current: expData.is_current,
      description: expData.description,
    } as never)
    .eq('id', experienceId)

  if (error) throw error
}

export async function deleteExperience(experienceId: string): Promise<void> {
  const supabase = await createClient()
  const { error } = await supabase
    .from('experiences')
    .delete()
    .eq('id', experienceId)

  if (error) throw error
}

// ============ EDUCATION ============

export async function addEducation(profileId: string, eduData: EducationFormData): Promise<Education> {
  const supabase = await createClient()

  // Get max order_index
  const { data: existing } = await supabase
    .from('education')
    .select('order_index')
    .eq('profile_id', profileId)
    .order('order_index', { ascending: false })
    .limit(1) as { data: { order_index: number }[] | null }

  const orderIndex = existing && existing.length > 0 ? existing[0].order_index + 1 : 0

  const { data: education, error } = await supabase
    .from('education')
    .insert({
      profile_id: profileId,
      institution_name: eduData.institution_name,
      degree: eduData.degree || null,
      field_of_study: eduData.field_of_study || null,
      start_date: eduData.start_date || null,
      end_date: eduData.end_date || null,
      description: eduData.description || null,
      order_index: orderIndex,
    } as never)
    .select()
    .single() as { data: Education | null; error: Error | null }

  if (error || !education) throw error || new Error('Failed to add education')
  return education
}

export async function updateEducation(educationId: string, eduData: Partial<EducationFormData>): Promise<void> {
  const supabase = await createClient()
  const { error } = await supabase
    .from('education')
    .update({
      institution_name: eduData.institution_name,
      degree: eduData.degree,
      field_of_study: eduData.field_of_study,
      start_date: eduData.start_date,
      end_date: eduData.end_date,
      description: eduData.description,
    } as never)
    .eq('id', educationId)

  if (error) throw error
}

export async function deleteEducation(educationId: string): Promise<void> {
  const supabase = await createClient()
  const { error } = await supabase
    .from('education')
    .delete()
    .eq('id', educationId)

  if (error) throw error
}

// ============ SKILLS ============

export async function addSkill(profileId: string, name: string): Promise<Skill> {
  const supabase = await createClient()

  const { data: skill, error } = await supabase
    .from('skills')
    .insert({
      profile_id: profileId,
      name: name.trim(),
    } as never)
    .select()
    .single() as { data: Skill | null; error: Error | null }

  if (error || !skill) throw error || new Error('Failed to add skill')
  return skill
}

export async function deleteSkill(skillId: string): Promise<void> {
  const supabase = await createClient()
  const { error } = await supabase
    .from('skills')
    .delete()
    .eq('id', skillId)

  if (error) throw error
}

export async function endorseSkill(skillId: string): Promise<void> {
  const supabase = await createClient()
  await supabase.rpc('endorse_skill', { skill_id: skillId } as never)
}

// ============ CONNECTIONS ============

export async function getConnectionStatus(userId: string): Promise<ConnectionStatus> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || user.id === userId) return 'none'

  type ConnectionData = { status: string; requester_id: string; addressee_id: string }
  const { data } = await supabase
    .from('connections')
    .select('*')
    .or(`and(requester_id.eq.${user.id},addressee_id.eq.${userId}),and(requester_id.eq.${userId},addressee_id.eq.${user.id})`)
    .single() as { data: ConnectionData | null }

  if (!data) return 'none'
  if (data.status === 'accepted') return 'connected'
  if (data.status === 'pending') {
    return data.requester_id === user.id ? 'pending_sent' : 'pending_received'
  }
  return 'none'
}

export async function sendConnectionRequest(addresseeId: string, message?: string): Promise<void> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Must be logged in to send connection request')
  if (user.id === addresseeId) throw new Error('Cannot connect with yourself')

  const { error } = await supabase
    .from('connections')
    .insert({
      requester_id: user.id,
      addressee_id: addresseeId,
      message: message || null,
    } as never)

  if (error) throw error
}

export async function acceptConnection(connectionId: string): Promise<void> {
  const supabase = await createClient()
  const { error } = await supabase
    .from('connections')
    .update({ status: 'accepted', updated_at: new Date().toISOString() } as never)
    .eq('id', connectionId)

  if (error) throw error
}

export async function rejectConnection(connectionId: string): Promise<void> {
  const supabase = await createClient()
  const { error } = await supabase
    .from('connections')
    .delete()
    .eq('id', connectionId)

  if (error) throw error
}

export async function removeConnection(connectionId: string): Promise<void> {
  const supabase = await createClient()
  const { error } = await supabase
    .from('connections')
    .delete()
    .eq('id', connectionId)

  if (error) throw error
}

export async function getMyConnections(): Promise<Connection[]> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return []

  const { data, error } = await supabase
    .from('connections')
    .select(`
      *,
      requester:professional_profiles!connections_requester_id_fkey(
        *,
        user:profiles!professional_profiles_user_id_fkey(id, display_name, avatar_url)
      ),
      addressee:professional_profiles!connections_addressee_id_fkey(
        *,
        user:profiles!professional_profiles_user_id_fkey(id, display_name, avatar_url)
      )
    `)
    .eq('status', 'accepted')
    .or(`requester_id.eq.${user.id},addressee_id.eq.${user.id}`) as { data: Connection[] | null; error: Error | null }

  if (error) throw error
  return data || []
}

export async function getPendingRequests(): Promise<Connection[]> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return []

  const { data, error } = await supabase
    .from('connections')
    .select(`
      *,
      requester:professional_profiles!connections_requester_id_fkey(
        *,
        user:profiles!professional_profiles_user_id_fkey(id, display_name, avatar_url)
      )
    `)
    .eq('status', 'pending')
    .eq('addressee_id', user.id) as { data: Connection[] | null; error: Error | null }

  if (error) throw error
  return data || []
}

export async function getSentRequests(): Promise<Connection[]> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return []

  const { data, error } = await supabase
    .from('connections')
    .select(`
      *,
      addressee:professional_profiles!connections_addressee_id_fkey(
        *,
        user:profiles!professional_profiles_user_id_fkey(id, display_name, avatar_url)
      )
    `)
    .eq('status', 'pending')
    .eq('requester_id', user.id) as { data: Connection[] | null; error: Error | null }

  if (error) throw error
  return data || []
}

export async function getMutualConnections(userId: string): Promise<ProfessionalProfile[]> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || user.id === userId) return []

  // Get my connections
  const myConnections = await getMyConnections()
  const myConnectionIds = new Set(
    myConnections.map(c => c.requester_id === user.id ? c.addressee_id : c.requester_id)
  )

  // Get their connections
  type ConnectionIds = { requester_id: string; addressee_id: string }
  const { data: theirConnections } = await supabase
    .from('connections')
    .select('requester_id, addressee_id')
    .eq('status', 'accepted')
    .or(`requester_id.eq.${userId},addressee_id.eq.${userId}`) as { data: ConnectionIds[] | null }

  const theirConnectionIds = new Set(
    (theirConnections || []).map(c => c.requester_id === userId ? c.addressee_id : c.requester_id)
  )

  // Find intersection
  const mutualIds = [...myConnectionIds].filter(id => theirConnectionIds.has(id))

  if (mutualIds.length === 0) return []

  const { data: mutuals } = await supabase
    .from('professional_profiles')
    .select(`
      *,
      user:profiles!professional_profiles_user_id_fkey(id, display_name, avatar_url)
    `)
    .in('user_id', mutualIds) as { data: ProfessionalProfile[] | null }

  return mutuals || []
}

// ============ MEMBERS DIRECTORY ============

type MemberWithSkills = ProfessionalProfile & { skills?: { name: string }[] }

export async function getMembers(filters: MemberFilters = {}): Promise<{ members: ProfessionalProfile[], total: number }> {
  const supabase = await createClient()
  const { search, location, skill, is_open_to_work, page = 1, limit = 20 } = filters
  const offset = (page - 1) * limit

  let query = supabase
    .from('professional_profiles')
    .select(`
      *,
      user:profiles!professional_profiles_user_id_fkey(id, display_name, username, avatar_url),
      skills(name)
    `, { count: 'exact' })

  // Filters
  if (location) {
    query = query.ilike('location', `%${location}%`)
  }

  if (is_open_to_work) {
    query = query.eq('is_open_to_work', true)
  }

  // Search by user display_name or headline
  if (search) {
    query = query.or(`headline.ilike.%${search}%,bio.ilike.%${search}%`)
  }

  query = query
    .order('connection_count', { ascending: false })
    .range(offset, offset + limit - 1)

  const { data, error, count } = await query as { data: MemberWithSkills[] | null; error: Error | null; count: number | null }

  if (error) throw error

  // Filter by skill if provided (post-query filter)
  let members = data || []
  if (skill) {
    members = members.filter(m =>
      m.skills?.some((s: { name: string }) => s.name.toLowerCase().includes(skill.toLowerCase()))
    )
  }

  return { members, total: count || 0 }
}

export async function getFeaturedMembers(limit = 6): Promise<ProfessionalProfile[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('professional_profiles')
    .select(`
      *,
      user:profiles!professional_profiles_user_id_fkey(id, display_name, username, avatar_url)
    `)
    .order('connection_count', { ascending: false })
    .limit(limit) as { data: ProfessionalProfile[] | null; error: Error | null }

  if (error) throw error
  return data || []
}

export async function getSuggestedConnections(limit = 5): Promise<ProfessionalProfile[]> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return []

  // Get my existing connections and pending requests
  type ConnectionIds = { requester_id: string; addressee_id: string }
  const { data: existing } = await supabase
    .from('connections')
    .select('requester_id, addressee_id')
    .or(`requester_id.eq.${user.id},addressee_id.eq.${user.id}`) as { data: ConnectionIds[] | null }

  const excludeIds = new Set([user.id])
  existing?.forEach(c => {
    excludeIds.add(c.requester_id)
    excludeIds.add(c.addressee_id)
  })

  // Get profiles not in exclude list
  const { data, error } = await supabase
    .from('professional_profiles')
    .select(`
      *,
      user:profiles!professional_profiles_user_id_fkey(id, display_name, username, avatar_url)
    `)
    .not('user_id', 'in', `(${[...excludeIds].join(',')})`)
    .order('connection_count', { ascending: false })
    .limit(limit) as { data: ProfessionalProfile[] | null; error: Error | null }

  if (error) throw error
  return data || []
}

// ============ STATS ============

export async function getOddaStats(): Promise<{ members: number, connections: number, openToWork: number }> {
  const supabase = await createClient()

  const [membersResult, connectionsResult, openToWorkResult] = await Promise.all([
    supabase.from('professional_profiles').select('*', { count: 'exact', head: true }),
    supabase.from('connections').select('*', { count: 'exact', head: true }).eq('status', 'accepted'),
    supabase.from('professional_profiles').select('*', { count: 'exact', head: true }).eq('is_open_to_work', true),
  ])

  return {
    members: membersResult.count || 0,
    connections: connectionsResult.count || 0,
    openToWork: openToWorkResult.count || 0,
  }
}
