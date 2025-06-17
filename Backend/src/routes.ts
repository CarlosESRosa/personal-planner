import { FastifyInstance } from 'fastify'
import { userRoutes } from './modules/user/user.routes'
import { loginBody, registerBody, updateBody } from './modules/user/user.schema'
import { zodToJsonSchema } from 'zod-to-json-schema'
import { taskRoutes } from './modules/task/task.routes'
import { createTaskBody, updateTaskBody, updateStatusBody, listTasksQuery, taskIdParam } from './modules/task/task.schema'


export async function routes(app: FastifyInstance) {
    // rota para testar aplicação
    app.get('/health', async () => ({ status: 'ok' }))

    // ping do banco
    app.get('/ping-db', {
        schema: {
            response: { 200: { type: 'object', properties: { db: { type: 'boolean' } } } }
        },
        handler: async (_req, reply) => {
            try {
                await app.prisma.$queryRaw`SELECT 1`
                reply.send({ db: true })
            } catch (e) {
                reply.code(500).send({ db: false })
            }
        }
    })

    app.addSchema({ $id: 'registerBody', ...zodToJsonSchema(registerBody, { target: 'openApi3' }) })
    app.addSchema({ $id: 'loginBody', ...zodToJsonSchema(loginBody, { target: 'openApi3' }) })
    app.addSchema({ $id: 'updateBody', ...zodToJsonSchema(updateBody, { target: 'openApi3' }) })

    app.addSchema({ $id: 'createTaskBody', ...zodToJsonSchema(createTaskBody, { target: 'openApi3' }) })
    app.addSchema({ $id: 'updateTaskBody', ...zodToJsonSchema(updateTaskBody, { target: 'openApi3' }) })
    app.addSchema({ $id: 'updateStatusBody', ...zodToJsonSchema(updateStatusBody, { target: 'openApi3' }) })
    app.addSchema({ $id: 'listTasksQuery', ...zodToJsonSchema(listTasksQuery, { target: 'openApi3' }) })
    app.addSchema({ $id: 'taskIdParam', ...zodToJsonSchema(taskIdParam, { target: 'openApi3' }) })

    /* resposta Task ------------------------------------- */
    app.addSchema({
        $id: 'TaskResponse',
        type: 'object',
        properties: {
            id: { type: 'string', format: 'uuid' },
            title: { type: 'string' },
            description: { type: 'string', nullable: true },
            status: { type: 'string', enum: ['PENDING', 'IN_PROGRESS', 'DONE'] },
            priority: { type: 'string', enum: ['LOW', 'MEDIUM', 'HIGH'] },
            dueDate: { type: 'string', format: 'date-time', nullable: true },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
        }
    })

    /* ----- rotas ----- */
    await userRoutes(app)
    await taskRoutes(app)

    /* imprime rota no boot (opcional) */
    app.ready(() => {
        app.log.info('\n' + app.printRoutes())
    })
}