// GET /api/modules/:id/sessions
// List module sessions - can be filtered by date range (trainer/admin only)

import { requireTrainer } from "~/server/utils/roles"
import { Session } from "~/types"

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

    // Get the date range from the query
    const { start, end } = getQuery(event)

    // Get the module
    const module = await event.context.db.collection('modules').doc(id).get()
    if (!module.exists) {
        throw createError({
            statusCode: 404,
            message: 'Module not found'
        })
    }

    // if no date range is provided, get all sessions
    if (!start || !end) {
        const sessions = await event.context.db.collection('sessions')
            .where('moduleId', '==', id)
            .get()

        const data: Session[] = sessions.docs.map((doc: FirebaseFirestore.DocumentSnapshot) => doc.data() as Session)

        if (!data.length) {
            throw createError({
                statusCode: 404,
                message: 'No sessions found'
            })
        }

        return data
    }

    // Get the sessions
    const sessions = await event.context.db.collection('sessions')
        .where('moduleId', '==', id)
        .where('date', '>=', start)
        .where('date', '<=', end)
        .get()

    const data: Session[] = sessions.docs.map((doc: FirebaseFirestore.DocumentSnapshot) => doc.data() as Session)

    if (!data.length) {
        throw createError({
            statusCode: 404,
            message: 'No sessions found'
        })
    }

    return data
})