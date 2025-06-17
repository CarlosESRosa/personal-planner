import fp from 'fastify-plugin'

export const authPlugin = fp(async (app) => {
    app.decorate(
        'authenticate',
        async (request, reply) => {
            try {
                await request.jwtVerify()
            } catch (err) {
                reply.code(401).send({ message: 'Unauthorized' })
            }
        }
    )
})

declare module 'fastify' {
    interface FastifyInstance {
        authenticate: any
    }
    interface FastifyRequest {
        user: { id: string }     // payload que você assina no token
    }
}
