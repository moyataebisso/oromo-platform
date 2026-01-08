import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
})

// Helper to calculate age from birthday
export const calculateAge = (birthday: Date): number => {
  const today = new Date()
  let age = today.getFullYear() - birthday.getFullYear()
  const monthDiff = today.getMonth() - birthday.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthday.getDate())) {
    age--
  }
  return age
}

// Helper to determine age group
export const getAgeGroup = (age: number): 'kids' | 'teens' | 'adults' => {
  if (age < 13) return 'kids'
  if (age < 18) return 'teens'
  return 'adults'
}

// Grade levels for teens
export const gradeOptions = [
  { value: '9', label: '9th Grade (Freshman)' },
  { value: '10', label: '10th Grade (Sophomore)' },
  { value: '11', label: '11th Grade (Junior)' },
  { value: '12', label: '12th Grade (Senior)' },
] as const

export type GradeLevel = '9' | '10' | '11' | '12'
export type AgeGroup = 'kids' | 'teens' | 'adults'

export const signupSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string(),
  displayName: z.string().min(2, 'Display name must be at least 2 characters'),
  birthday: z.date({ message: 'Please select your birthday' }),
  // Parent email is required for kids under 13
  parentEmail: z.string().email('Please enter a valid parent email').optional().or(z.literal('')),
  // Grade level for teens
  gradeLevel: z.enum(['9', '10', '11', '12']).optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
}).refine((data) => {
  // If under 13, require parent email
  const age = calculateAge(data.birthday)
  if (age < 13 && (!data.parentEmail || data.parentEmail === '')) {
    return false
  }
  return true
}, {
  message: 'Parent email is required for users under 13',
  path: ['parentEmail'],
}).refine((data) => {
  // If 13-17, grade level is required
  const age = calculateAge(data.birthday)
  if (age >= 13 && age < 18 && !data.gradeLevel) {
    return false
  }
  return true
}, {
  message: 'Please select your grade level',
  path: ['gradeLevel'],
})

export const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
})

export type LoginFormData = z.infer<typeof loginSchema>
export type SignupFormData = z.infer<typeof signupSchema>
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>
