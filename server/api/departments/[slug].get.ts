// GET /api/departments/:slug
// Get a department by slug

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

        return querySnapshot.docs[0].data() as Department
    })

    console.log('Department:', department)

    return department
})