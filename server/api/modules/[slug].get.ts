// GET /api/modules/:slug
// Get a module by slug

import { convertTimestamps } from "~/server/utils/timestamp"
import { Module } from "~/types"

export default defineEventHandler(async (event) => {
    const slug = getRouterParam(event, 'slug')

    const module = await event.context.db.collection('modules').where('slug', '==', slug).get().then((querySnapshot) => {
        if (querySnapshot.empty) {
            throw createError({
                statusCode: 404,
                message: 'Module not found'
            })
        }

        const data = querySnapshot.docs[0].data() as Module

        if (!data.metadata.isActive) {
            throw createError({
                statusCode: 404,
                message: 'Module not found'
            })
        }

        return convertTimestamps(data)
    })

    return module
})