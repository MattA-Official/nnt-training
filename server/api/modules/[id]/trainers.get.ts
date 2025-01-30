// GET /api/modules/:id/trainers
// List all trainers for a module

import { requireTrainer } from "~/server/utils/roles"
import { UserProfile } from "~/types"

export default defineEventHandler(async (event) => {
    // Check if the user is a trainer
    requireTrainer(event)

    const id = getRouterParam(event, 'id')
    if (!id) {
        throw createError({
            statusCode: 400,
            message: 'Module ID is required'
        })
    }

    // Get the module
    const module = await event.context.db.collection('modules').doc(id).get()
    if (!module.exists) {
        throw createError({
            statusCode: 404,
            message: 'Module not found'
        })
    }

    // Get users who are trainers and have the module in their progress
    const trainers = await event.context.db.collectionGroup('progress').where('moduleId', '==', id).where('expiryDate', '<=', new Date()).get()

    const data: UserProfile[] = trainers.docs.map((doc: FirebaseFirestore.DocumentSnapshot) => doc.data() as UserProfile)


    if (!data.length) {
        throw createError({
            statusCode: 404,
            message: 'No trainers found'
        })
    }

    return data
})

