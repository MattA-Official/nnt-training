import { EventHandlerRequest, H3Event } from 'h3'

export const requireUser = (event: H3Event<EventHandlerRequest>) => {
    if (!event.context.user) {
        throw createError({
            statusCode: 401,
            message: 'Unauthorized'
        })
    }
}

export const requireAdmin = (event: H3Event<EventHandlerRequest>) => {
    if (!event.context.user?.roles.admin) {
        throw createError({
            statusCode: 403,
            message: 'Forbidden'
        })
    }
}

export const requireTrainer = (event: H3Event<EventHandlerRequest>) => {
    if (!event.context.user?.roles.trainer) {
        throw createError({
            statusCode: 403,
            message: 'Forbidden'
        })
    }
}
