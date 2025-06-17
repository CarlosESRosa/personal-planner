import { FastifyInstance } from 'fastify'
import { userRoutes } from './modules/user/user.routes'
import { loginBody, registerBody, updateBody } from './modules/user/user.schema'
import { zodToJsonSchema } from 'zod-to-json-schema'

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

    // Registrando schemas Zod para Swagger
    app.addSchema({ $id: 'registerBody', ...zodToJsonSchema(registerBody, { target: 'openApi3' }) })
    app.addSchema({ $id: 'loginBody', ...zodToJsonSchema(loginBody, { target: 'openApi3' }) })
    app.addSchema({ $id: 'updateBody', ...zodToJsonSchema(updateBody, { target: 'openApi3' }) })


    await userRoutes(app)
}