```js
// Collection: departments
{
  id: string,           // Auto-generated document ID
  name: string,         // e.g., "Tech", "Workshop", etc.
  slug: string,         // URL-friendly name
  description: string,
  icon: string,         // Icon identifier/name
  contact: {
    email: string,      // Committee member contact
    userId: string      // Reference to users/uid of committee member
  },
  metadata: {
    createdAt: timestamp,
    lastUpdatedAt: timestamp,
    isActive: boolean
  }
}

// Collection: categories
{
  id: string,           // Auto-generated document ID
  departmentId: string, // Reference to departments/id
  name: string,
  description: string,
  slug: string,         // URL-friendly name
  order: number,        // Display order within department
  metadata: {
    createdAt: timestamp,
    createdBy: string,  // Reference to users/uid
    isActive: boolean
  }
}

// Collection: modules
{
  id: string,           // Auto-generated document ID
  categoryId: string,   // Reference to categories/id
  name: string,
  description: string,
  slug: string,         // URL-friendly name
  order: number,
  requirements: {
    prerequisites: string[],    // Array of module IDs required before this
    equipment: string[],        // Required equipment
    software: string[],         // Required software
    skills: string[]            // Required skills
  },
  metadata: {
    createdAt: timestamp,
    createdBy: string,  // Reference to users/uid
    isActive: boolean,
    lastUpdatedAt: timestamp
  }
}

// Collection: sessions
{
  id: string,           // Auto-generated document ID
  modules: string[],    // Reference to modules/id
  date: timestamp,
  status: string,       // 'scheduled' | 'in-progress' | 'completed' | 'cancelled'
  trainer: {
    uid: string,        // Reference to users/uid
    name: string        // Denormalized for quick access
  },
  trainees: [{          // Array of trainee objects
    uid: string,        // Reference to users/uid
    name: string,       // Denormalized for quick access
    status: string,     // 'registered' | 'attended' | 'completed' | 'no-show'
    completedAt?: timestamp
  }],
  capacity: {
    min: number,
    max: number,
    current: number     // Current registration count
  },
  notes: {
    public?: string,    // Visible to all users
    private?: string    // Visible only to trainers/admins
  },
  metadata: {
    createdAt: timestamp,
    createdBy: string,  // Reference to users/uid
    lastUpdatedAt: timestamp
  }
}

// Collection: users
{
  uid: string,           // Firebase Auth UID (document ID)
  displayName: string,   // Full name
  slug: string,         // URL-friendly name
  email: string,
  roles: {              // Consolidated role management
    trainer: boolean,
    admin: boolean,
    committee: {
      departmentId?: string,  // Reference to departments/id if they're a committee member
      role?: string           // Specific committee role title
    }
  },
  profile: {
    photoURL?: string,
    bio?: string,
    contactNumber?: string
  },
  metadata: {
    createdAt: timestamp,
    lastLoginAt: timestamp,
    lastUpdatedAt: timestamp
  }
}

// Collection: progress (subcollection under users)
// Path: users/{uid}/progress/{moduleId}
{
  moduleId: string,     // Reference to modules/id (document ID)
  status: string,       // 'not-started' | 'in-progress' | 'completed'
  sessions: [{          // Array of attended sessions
    sessionId: string,  // Reference to sessions/id
    date: timestamp,
    trainerId: string,  // Reference to users/uid
    status: string,     // 'attended' | 'completed'
    notes?: string
  }],
  completedAt?: timestamp,
  certifiedBy?: {       // Trainer who certified completion
    uid: string,        // Reference to users/uid
    name: string        // Denormalized for quick access
  },
  metadata: {
    createdAt: timestamp,
    lastUpdatedAt: timestamp
  }
}
```