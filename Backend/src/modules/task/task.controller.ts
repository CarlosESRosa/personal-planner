import { FastifyInstance } from 'fastify'
import {
    createTaskBody, updateTaskBody, updateStatusBody,
    listTasksQuery, taskIdParam
} from './task.schema'

export async function taskController(app: FastifyInstance) {
    /* util para checar dono --------------------------------------- */
    async function assertOwner(taskId: string, userId: string) {
        const task = await app.prisma.task.findUnique({ where: { id: taskId } })
        if (!task || task.userId !== userId) {
            throw app.httpErrors.notFound('Task not found')
        }
        return task
    }

    /* POST /tasks -------------------------------------------------- */
    app.post('/tasks', {
        preHandler: [app.authenticate],
        schema: {
            body: { $ref: 'createTaskBody#' },
            response: { 201: { type: 'null' } },
            security: [{ bearerAuth: [] }]
        },
        handler: async (req, reply) => {
            await app.prisma.task.create({
                data: { ...(req.body as any), userId: (req.user as any).id }
            })
            reply.code(201).send()
        }
    })

    /* GET /tasks --------------------------------------------------- */
    app.get('/tasks', {
        preHandler: [app.authenticate],
        schema: {
            querystring: { $ref: 'listTasksQuery#' },
            response: { 200: { type: 'array', items: { $ref: 'TaskResponse#' } } },
            security: [{ bearerAuth: [] }]
        },
        handler: async (req) => {
            const { status, priority, due_start, due_end } = req.query as any
            return app.prisma.task.findMany({
                where: {
                    userId: (req.user as any).id,
                    status,
                    priority,
                    dueDate: {
                        gte: due_start ? new Date(due_start) : undefined,
                        lte: due_end ? new Date(due_end) : undefined
                    }
                },
                orderBy: { createdAt: 'desc' }
            })
        }
    })

    /* GET /tasks/:id ---------------------------------------------- */
    app.get('/tasks/:id', {
        preHandler: [app.authenticate],
        schema: {
            params: { $ref: 'taskIdParam#' },
            response: { 200: { $ref: 'TaskResponse#' } },
            security: [{ bearerAuth: [] }]
        },
        handler: async (req) => {
            const { id } = req.params as any
            return assertOwner(id, (req.user as any).id)
        }
    })

    /* PUT /tasks/:id ---------------------------------------------- */
    app.put('/tasks/:id', {
        preHandler: [app.authenticate],
        schema: {
            params: { $ref: 'taskIdParam#' },
            body: { $ref: 'updateTaskBody#' },
            response: { 200: { type: 'null' } },
            security: [{ bearerAuth: [] }]
        },
        handler: async (req, reply) => {
            const { id } = req.params as any
            await assertOwner(id, (req.user as any).id)
            await app.prisma.task.update({ where: { id }, data: req.body as any })
            reply.send()
        }
    })

    /* PATCH /tasks/:id/status ------------------------------------- */
    app.patch('/tasks/:id/status', {
        preHandler: [app.authenticate],
        schema: {
            params: { $ref: 'taskIdParam#' },
            body: { $ref: 'updateStatusBody#' },
            response: { 200: { type: 'null' } },
            security: [{ bearerAuth: [] }]
        },
        handler: async (req, reply) => {
            const { id } = req.params as any
            const { status } = req.body as any
            await assertOwner(id, (req.user as any).id)
            await app.prisma.task.update({ where: { id }, data: { status } })
            reply.send()
        }
    })

    /* DELETE /tasks/:id ------------------------------------------- */
    app.delete('/tasks/:id', {
        preHandler: [app.authenticate],
        schema: {
            params: { $ref: 'taskIdParam#' },
            response: { 204: { type: 'null' } },
            security: [{ bearerAuth: [] }]
        },
        handler: async (req, reply) => {
            const { id } = req.params as any
            await assertOwner(id, (req.user as any).id)
            await app.prisma.task.delete({ where: { id } })
            reply.code(204).send()
        }
    })
}
