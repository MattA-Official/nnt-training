// User and Auth Types
export interface UserProfile {
    uid: string
    displayName: string
    email: string
    slug: string
    roles: {
        trainer: boolean
        admin: boolean
        committee?: {
            departmentId?: string
            role?: string
        }
    }
    profile: {
        photoURL?: string
        bio?: string
        contactNumber?: string
    }
    metadata: {
        createdAt: Date
        lastLoginAt: Date
        lastUpdatedAt?: Date
    }
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
    metadata: {
        createdAt: Date
        createdBy: string
        isActive: boolean
        lastUpdatedAt?: Date
        lastUpdatedBy?: string
    }
}

// Category Types
export interface Category {
    id: string
    departmentId: string
    name: string
    description: string
    slug: string
    order: number
    metadata: {
        createdAt: Date
        createdBy: string
        isActive: boolean
        lastUpdatedAt?: Date
        lastUpdatedBy?: string
    }
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
    metadata: {
        createdAt: Date
        createdBy: string
        isActive: boolean
        lastUpdatedAt?: Date
        lastUpdatedBy?: string
    }
}

// Session Types
export type SessionStatus = 'scheduled' | 'in-progress' | 'completed' | 'cancelled'

export interface Session {
    id: string
    moduleId: string
    date: Date
    status: SessionStatus
    trainer: {
        uid: string
        name: string
    }
    trainees: Array<{
        uid: string
        name: string
        status: 'registered' | 'attended' | 'completed' | 'no-show'
        completedAt?: Date
    }>
    capacity: {
        min: number
        max: number
        current: number
    }
    notes: {
        public?: string
        private?: string
    }
    metadata: {
        createdAt: Date
        createdBy: string
        lastUpdatedAt?: Date
        lastUpdatedBy?: string
    }
}

// Progress Types
export interface Progress {
    moduleId: string
    status: 'not-started' | 'in-progress' | 'completed'
    sessions: Array<{
        sessionId: string
        date: Date
        trainerId: string
        status: 'attended' | 'completed'
        notes?: string
    }>
    completedAt?: Date
    certifiedBy?: {
        uid: string
        name: string
    }
    metadata: {
        createdAt: Date
        createdBy: string
        lastUpdatedAt?: Date
        lastUpdatedBy?: string
    }
}

// Component Prop Types
export interface BreadcrumbItem {
    label: string
    to?: string
}

export interface SelectOption {
    value: string | number
    label: string
    disabled?: boolean
}

export interface ProgressData {
    total: number
    completed: number
    inProgress: number
    notStarted: number
}

// Form Types (for validation and submission)
export type CreateUserProfileForm = Omit<UserProfile, 'uid' | 'metadata'>

export type CreateDepartmentForm = Omit<Department, 'id' | 'metadata'>

export type CreateCategoryForm = Omit<Category, 'id' | 'metadata'>

export type CreateModuleForm = Omit<Module, 'id' | 'metadata'>

export type CreateSessionForm = Omit<Session, 'id' | 'metadata' | 'status' | 'capacity.current'>

export type UpdateUserProfileForm = Partial<CreateUserProfileForm>

export type UpdateDepartmentForm = Partial<CreateDepartmentForm>

export type UpdateCategoryForm = Partial<CreateCategoryForm>

export type UpdateModuleForm = Partial<CreateModuleForm>

export type UpdateSessionForm = Partial<CreateSessionForm>