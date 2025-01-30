// GET /api/categories/:slug
// Get a category by slug

import { convertTimestamps } from "~/server/utils/timestamp"
import { Category } from "~/types"

export default defineEventHandler(async (event) => {
    const slug = getRouterParam(event, 'slug')

    const category = await event.context.db.collection('categories').where('slug', '==', slug).get().then((querySnapshot) => {
        if (querySnapshot.empty) {
            throw createError({
                statusCode: 404,
                message: 'Category not found'
            })
        }

        const data = querySnapshot.docs[0].data() as Category

        if (!data.metadata.isActive) {
            throw createError({
                statusCode: 404,
                message: 'Category not found'
            })
        }

        return convertTimestamps(data)
    })

    return category
})