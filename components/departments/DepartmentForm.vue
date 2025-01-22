<template>
    <BaseForm @submit="handleSubmit" @cancel="handleCancel">
        <FormGroup>
            <FormLabel>Department Name</FormLabel>
            <FormInput v-model="department.name" required placeholder="e.g. Technical" />
        </FormGroup>

        <FormGroup>
            <FormLabel>URL Slug</FormLabel>
            <FormInput v-model="department.slug" required placeholder="technical" pattern="[a-z0-9\-]+"
                :disabled="type === 'edit'" help="URL-friendly name (auto-generated from Department Name)" />
        </FormGroup>

        <FormGroup>
            <FormLabel>Description</FormLabel>
            <FormTextArea v-model="department.description" required :rows="3"
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

        <div v-if="error" class="error">{{ error }}</div>
    </BaseForm>

    <button v-if="type === 'edit'" type="button" @click="handleDelete" class="">Delete Department</button>
</template>

<script setup lang="ts">
import type { CreateDepartmentForm, Department, UpdateDepartmentForm } from '~/types'
import { useAuth } from '~/composables/useAuth'
import BaseForm from '../form/templates/BaseForm.vue'
import FormGroup from '../form/layout/FormGroup.vue'
import FormLabel from '../form/feedback/FormLabel.vue'
import FormInput from '../form/inputs/FormInput.vue'
import FormTextArea from '../form/inputs/FormTextArea.vue'

const { userProfile } = useAuth()
const router = useRouter()

const props = defineProps({
    type: {
        type: String as () => 'create' | 'edit',
        required: true,
        validator: (value: string) => ['create', 'edit'].includes(value)
    },
    initialData: {
        type: Object as () => Department | null,
        default: () => ({})
    }
})

const department = ref<CreateDepartmentForm>({
    name: '',
    description: '',
    slug: '',
    icon: '',
    contact: {
        email: '',
        userId: userProfile.value?.uid || ''
    },
})

if (props.type === 'edit' && props.initialData) {
    department.value = {
        name: props.initialData.name,
        description: props.initialData.description,
        slug: props.initialData.slug,
        icon: props.initialData.icon,
        contact: {
            email: props.initialData.contact.email,
            userId: props.initialData.contact.userId
        }
    }
}

watch(() => department.value.name, (newName) => {
    if (props.type === 'create') {
        department.value.slug = newName
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '')
    }
})

const isSubmitting = ref(false)
const error = ref<string | null>(null)

const emit = defineEmits(['submit', 'cancel'])

const handleSubmit = async () => {
    if (isSubmitting.value) return
    emit('submit', department.value)
}

const handleCancel = () => {
    emit('cancel')
}

const handleDelete = async () => {
    if (isSubmitting.value) return

    if (!confirm('Are you sure you want to delete this department?')) return // TODO: Replace with a modal dialog

    try {
        isSubmitting.value = true
        error.value = null

        await $fetch(`/api/departments/${props.initialData?.id}`, {
            method: 'DELETE'
        })

        await router.push('/training/departments')
    } catch (err: any) {
        error.value = err.message || 'Failed to delete department'
    } finally {
        isSubmitting.value = false
    }
}
</script>