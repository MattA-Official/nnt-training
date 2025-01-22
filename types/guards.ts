import type {
    UserProfile,
    Department,
    Category,
    Module,
    Session,
    Progress,
    SessionStatus,
    CreateUserProfileForm,
    CreateDepartmentForm,
    CreateCategoryForm,
    CreateModuleForm,
    CreateSessionForm,
    UpdateUserProfileForm,
    UpdateDepartmentForm,
    UpdateCategoryForm,
    UpdateModuleForm,
    UpdateSessionForm
} from "."

export function isUserProfile(obj: any): obj is UserProfile {
    return (
        typeof obj === 'object' &&
        typeof obj.uid === 'string' &&
        typeof obj.displayName === 'string' &&
        typeof obj.email === 'string' &&
        typeof obj.slug === 'string' &&
        typeof obj.roles === 'object' &&
        typeof obj.roles.trainer === 'boolean' &&
        typeof obj.roles.admin === 'boolean' &&
        typeof obj.profile === 'object' &&
        typeof obj.metadata === 'object' &&
        obj.metadata.createdAt instanceof Date &&
        obj.metadata.lastLoginAt instanceof Date
    )
}

export function isDepartment(obj: any): obj is Department {
    return (
        typeof obj === 'object' &&
        typeof obj.id === 'string' &&
        typeof obj.name === 'string' &&
        typeof obj.slug === 'string' &&
        typeof obj.icon === 'string' &&
        typeof obj.description === 'string' &&
        typeof obj.contact === 'object' &&
        typeof obj.contact.email === 'string' &&
        typeof obj.contact.userId === 'string' &&
        typeof obj.metadata === 'object' &&
        obj.metadata.createdAt instanceof Date &&
        typeof obj.metadata.createdBy === 'string' &&
        typeof obj.metadata.isActive === 'boolean'
    )
}

export function isCategory(obj: any): obj is Category {
    return (
        typeof obj === 'object' &&
        typeof obj.id === 'string' &&
        typeof obj.departmentId === 'string' &&
        typeof obj.name === 'string' &&
        typeof obj.description === 'string' &&
        typeof obj.slug === 'string' &&
        typeof obj.order === 'number' &&
        typeof obj.metadata === 'object' &&
        obj.metadata.createdAt instanceof Date &&
        typeof obj.metadata.createdBy === 'string' &&
        typeof obj.metadata.isActive === 'boolean'
    )
}

export function isModule(obj: any): obj is Module {
    return (
        typeof obj === 'object' &&
        typeof obj.id === 'string' &&
        typeof obj.categoryId === 'string' &&
        typeof obj.name === 'string' &&
        typeof obj.description === 'string' &&
        typeof obj.slug === 'string' &&
        typeof obj.order === 'number' &&
        typeof obj.safety === 'boolean' &&
        typeof obj.metadata === 'object' &&
        obj.metadata.createdAt instanceof Date &&
        typeof obj.metadata.createdBy === 'string' &&
        typeof obj.metadata.isActive === 'boolean'
    )
}

export function isSessionStatus(status: any): status is SessionStatus {
    return ['scheduled', 'in-progress', 'completed', 'cancelled'].includes(status)
}

export function isSession(obj: any): obj is Session {
    return (
        typeof obj === 'object' &&
        typeof obj.id === 'string' &&
        typeof obj.moduleId === 'string' &&
        obj.date instanceof Date &&
        isSessionStatus(obj.status) &&
        typeof obj.trainer === 'object' &&
        typeof obj.trainer.uid === 'string' &&
        typeof obj.trainer.name === 'string' &&
        Array.isArray(obj.trainees) &&
        typeof obj.capacity === 'object' &&
        typeof obj.capacity.min === 'number' &&
        typeof obj.capacity.max === 'number' &&
        typeof obj.capacity.current === 'number' &&
        typeof obj.notes === 'object' &&
        typeof obj.metadata === 'object' &&
        obj.metadata.createdAt instanceof Date &&
        typeof obj.metadata.createdBy === 'string'
    )
}

export function isProgress(obj: any): obj is Progress {
    return (
        typeof obj === 'object' &&
        typeof obj.moduleId === 'string' &&
        ['not-started', 'in-progress', 'completed'].includes(obj.status) &&
        Array.isArray(obj.sessions) &&
        typeof obj.metadata === 'object' &&
        obj.metadata.createdAt instanceof Date &&
        typeof obj.metadata.createdBy === 'string'
    )
}

export function isCreateUserProfileForm(obj: any): obj is CreateUserProfileForm {
    return (
        typeof obj === 'object' &&
        typeof obj.displayName === 'string' &&
        typeof obj.email === 'string' &&
        typeof obj.slug === 'string' &&
        typeof obj.roles === 'object' &&
        typeof obj.roles.trainer === 'boolean' &&
        typeof obj.roles.admin === 'boolean' &&
        typeof obj.profile === 'object'
    )
}

export function isCreateDepartmentForm(obj: any): obj is CreateDepartmentForm {
    return (
        typeof obj === 'object' &&
        typeof obj.name === 'string' &&
        typeof obj.slug === 'string' &&
        typeof obj.icon === 'string' &&
        typeof obj.description === 'string' &&
        typeof obj.contact === 'object' &&
        typeof obj.contact.email === 'string' &&
        typeof obj.contact.userId === 'string'
    )
}

export function isCreateCategoryForm(obj: any): obj is CreateCategoryForm {
    return (
        typeof obj === 'object' &&
        typeof obj.departmentId === 'string' &&
        typeof obj.name === 'string' &&
        typeof obj.description === 'string' &&
        typeof obj.slug === 'string' &&
        typeof obj.order === 'number'
    )
}

export function isCreateModuleForm(obj: any): obj is CreateModuleForm {
    return (
        typeof obj === 'object' &&
        typeof obj.categoryId === 'string' &&
        typeof obj.name === 'string' &&
        typeof obj.description === 'string' &&
        typeof obj.slug === 'string' &&
        typeof obj.order === 'number' &&
        typeof obj.safety === 'boolean'
    )
}

export function isCreateSessionForm(obj: any): obj is CreateSessionForm {
    return (
        typeof obj === 'object' &&
        typeof obj.moduleId === 'string' &&
        obj.date instanceof Date &&
        typeof obj.trainer === 'object' &&
        typeof obj.trainer.uid === 'string' &&
        typeof obj.trainer.name === 'string' &&
        Array.isArray(obj.trainees) &&
        typeof obj.capacity === 'object' &&
        typeof obj.capacity.min === 'number' &&
        typeof obj.capacity.max === 'number'
    )
}

export function isUpdateUserProfileForm(obj: any): obj is UpdateUserProfileForm {
    if (typeof obj !== 'object' || obj === null) return false
    const keys = Object.keys(obj)
    return keys.every(key => {
        switch (key) {
            case 'displayName':
            case 'email':
            case 'slug':
                return typeof obj[key] === 'string'
            case 'roles':
                return typeof obj[key] === 'object' &&
                    (obj[key].trainer === undefined || typeof obj[key].trainer === 'boolean') &&
                    (obj[key].admin === undefined || typeof obj[key].admin === 'boolean')
            case 'profile':
                return typeof obj[key] === 'object'
            default:
                return false
        }
    })
}

export function isUpdateDepartmentForm(obj: any): obj is UpdateDepartmentForm {
    if (typeof obj !== 'object' || obj === null) return false
    const keys = Object.keys(obj)
    return keys.every(key => {
        switch (key) {
            case 'name':
            case 'slug':
            case 'icon':
            case 'description':
                return typeof obj[key] === 'string'
            case 'contact':
                return typeof obj[key] === 'object' &&
                    (obj[key].email === undefined || typeof obj[key].email === 'string') &&
                    (obj[key].userId === undefined || typeof obj[key].userId === 'string')
            default:
                return false
        }
    })
}

export function isUpdateCategoryForm(obj: any): obj is UpdateCategoryForm {
    if (typeof obj !== 'object' || obj === null) return false
    const keys = Object.keys(obj)
    return keys.every(key => {
        switch (key) {
            case 'departmentId':
            case 'name':
            case 'description':
            case 'slug':
                return typeof obj[key] === 'string'
            case 'order':
                return typeof obj[key] === 'number'
            default:
                return false
        }
    })
}

export function isUpdateModuleForm(obj: any): obj is UpdateModuleForm {
    if (typeof obj !== 'object' || obj === null) return false
    const keys = Object.keys(obj)
    return keys.every(key => {
        switch (key) {
            case 'categoryId':
            case 'name':
            case 'description':
            case 'slug':
                return typeof obj[key] === 'string'
            case 'order':
                return typeof obj[key] === 'number'
            case 'safety':
                return typeof obj[key] === 'boolean'
            case 'requirements':
                return typeof obj[key] === 'object'
            default:
                return false
        }
    })
}

export function isUpdateSessionForm(obj: any): obj is UpdateSessionForm {
    if (typeof obj !== 'object' || obj === null) return false
    const keys = Object.keys(obj)
    return keys.every(key => {
        switch (key) {
            case 'moduleId':
                return typeof obj[key] === 'string'
            case 'date':
                return obj[key] instanceof Date
            case 'trainer':
                return typeof obj[key] === 'object' &&
                    (obj[key].uid === undefined || typeof obj[key].uid === 'string') &&
                    (obj[key].name === undefined || typeof obj[key].name === 'string')
            case 'trainees':
                return Array.isArray(obj[key])
            case 'capacity':
                return typeof obj[key] === 'object' &&
                    (obj[key].min === undefined || typeof obj[key].min === 'number') &&
                    (obj[key].max === undefined || typeof obj[key].max === 'number')
            case 'notes':
                return typeof obj[key] === 'object'
            default:
                return false
        }
    })
}

