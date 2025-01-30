// Base Types
export interface BaseMetadata {
    createdAt: Date
    createdBy: string
    lastUpdatedAt?: Date
    lastUpdatedBy?: string
    isActive: boolean
}

// User & Auth Types
export type UserStatus = 'student' | 'alumni' | 'staff' | 'unknown'

export interface CommitteeInfo {
    departmentId?: string
    role: string
}

export interface UserRoles {
    admin: boolean
    trainer: boolean
    committee?: CommitteeInfo
}

export interface UserProfile {
    uid: string
    displayName: string
    email: string
    slug: string
    status: UserStatus
    gradYear: number | null
    course?: string
    studentId?: string
    roles: UserRoles
    profile: {
        photoURL: string | null
        bio: string | null
        contactNumber: string | null
        socialLinks?: {
            facebook?: string
        }
        preferences?: {
            emailNotifications: boolean
            pushNotifications: boolean
            language: string
        }
    }
    metadata: Omit<BaseMetadata, 'createdBy'> & {
        lastLoginAt: Date
        verifiedAt?: Date
    }
    progress?: TrainingProgress[]
}

// Department Types
export interface Department {
    id: string
    name: string
    slug: string
    icon: string
    description: string
    contact: {
        email: string
        userId: string
    }
    metadata: BaseMetadata
}

// Category Types
export interface Category {
    id: string
    departmentId: string
    name: string
    description: string
    slug: string
    order: number
    metadata: BaseMetadata
}

// Module Types
export interface Module {
    id: string
    categoryId: string
    name: string
    description: string
    slug: string
    order: number
    safety: boolean
    requirements?: {
        prerequisites?: string[]
        equipment?: string[]
        knowledge?: string[]
    }
    metadata: BaseMetadata
}

// Session Types
export type SessionStatus = 'scheduled' | 'in-progress' | 'completed' | 'cancelled'
export type AttendanceStatus = 'registered' | 'attended' | 'completed' | 'no-show'

export interface Session {
    id: string
    modules: Array<{
        moduleId: string
        name: string
    }>
    date: Date
    status: SessionStatus
    trainer: {
        uid: string
        name: string
    }
    trainees: Array<{
        uid: string
        name: string
        status: AttendanceStatus
        completedAt?: Date | null
    }>
    capacity: number
    notes: {
        public: string | null
        private: string | null
    }
    metadata: BaseMetadata
}

// Progress Types
export interface TrainingProgress {
    module: Module
    status: 'completed' | 'expired' // Computed based on expiry date
    completedAt: Date
    expiresAt: Date
    completedAs: 'trainee' | 'trainer'
    trainer: Partial<UserProfile>
    traineesCount?: number
    lastTrainingDelivered?: Date
}

// Form Types
export type WithoutMetadata<T> = Omit<T, 'metadata'>
export type WithoutId<T> = Omit<T, 'id'>
export type CreateForm<T> = WithoutMetadata<WithoutId<T>>
export type UpdateForm<T> = Partial<CreateForm<T>>

export type CreateUserProfileForm = Omit<UserProfile, 'uid' | 'metadata' | 'roles'>

export type UpdateUserProfileForm = Partial<CreateUserProfileForm>
export type CreateDepartmentForm = CreateForm<Department>
export type CreateCategoryForm = CreateForm<Category>
export type CreateModuleForm = CreateForm<Module>
export type CreateSessionForm = CreateForm<Session>