<script setup lang="ts">
import FormSubmit from '~/components/form/buttons/FormSubmit.vue'
import FormLabel from '~/components/form/feedback/FormLabel.vue'
import FormInput from '~/components/form/inputs/FormInput.vue'
import FormTextArea from '~/components/form/inputs/FormTextArea.vue'
import FormGroup from '~/components/form/layout/FormGroup.vue'
import BaseForm from '~/components/form/templates/BaseForm.vue'
import { useAuth } from '~/composables/useAuth'
import type { Department } from '~/types'

const { userProfile } = useAuth()
const router = useRouter()

// Redirect if not admin
// TODO: move to middleware
// if (!userProfile.value?.roles.admin) {
//     router.push('/training/departments')
// }

const department = ref<Department>({
    id: '',
    name: '',
    description: '',
    slug: '',
    icon: '',
    contact: {
        email: '',
        userId: userProfile.value?.uid || ''
    },
    metadata: {
        createdBy: userProfile.value?.uid || '',
        createdAt: new Date(),
        isActive: false
    }
})

// Auto-generate slug from name
watch(() => department.value.name, (newName) => {
    department.value.slug = newName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
})

const isSubmitting = ref(false)
const error = ref<string | null>(null)

const handleSubmit = async (data: any) => {
    if (isSubmitting.value) return

    department.value = { ...department.value, ...data }

    console.log('Department form data received:', department.value)

    try {
        isSubmitting.value = true
        error.value = null

        await $fetch('/api/departments/create', {
            method: 'POST',
            body: department.value
        })

        await router.push('/training/departments')
    } catch (err: any) {
        error.value = err.message || 'Failed to create department'
    } finally {
        isSubmitting.value = false
    }
}

const handleCancel = () => {
    router.push('/training/departments')
}
</script>

<template>
    <div class="">
        <div class="">
            <h1 class="">Create New Department</h1>
            <p class="">Set up a new department for training modules</p>
        </div>

        <BaseForm @submit="handleSubmit" @cancel="handleCancel" class="">
            <div>
                <FormLabel>Department Name</FormLabel>
                <FormInput v-model="department.name" required placeholder="e.g. Technical" />
            </div>

            <FormGroup>
                <FormLabel>URL Slug</FormLabel>
                <FormInput v-model="department.slug" required placeholder="technical" pattern="[a-z0-9\-]+"
                    help="URL-friendly name (auto-generated from Department Name)" />
            </FormGroup>

            <FormGroup>
                <FormLabel>Description</FormLabel>
                <FormTextArea v-model="department.description" required :rows=3
                    placeholder="Describe the department's purpose and responsibilities" />
            </FormGroup>

            <FormGroup>
                <FormLabel>Icon</FormLabel>
                <FormInput v-model="department.icon" required placeholder="e.g. wrench"
                    help="Icon name from the icon library" />
            </FormGroup>

            <FormGroup>
                <FormLabel>Contact Email</FormLabel>
                <FormInput v-model="department.contact.email" type="email" required
                    placeholder="department@newtheatre.org.uk" />
            </FormGroup>

            <div v-if="error" class="">
                {{ error }}
            </div>
        </BaseForm>
    </div>
</template>
