// GET /api/departments/:slug
// Get a department by slug

import { Timestamp } from "firebase/firestore"
import { convertTimestamps } from "~/server/utils/timestamp"
import { Department } from "~/types"

export default defineEventHandler(async (event) => {
    const slug = getRouterParam(event, 'slug')

    const department = await event.context.db.collection('departments').where('slug', '==', slug).get().then((querySnapshot) => {
        if (querySnapshot.empty) {
            throw createError({
                statusCode: 404,
                message: 'Department not found'
            })
        }

        const data = querySnapshot.docs[0].data() as Department

        if (!data.metadata.isActive) {
            throw createError({
                statusCode: 404,
                message: 'Department not found'
            })
        }

        return convertTimestamps(data)
    })

    return department
})