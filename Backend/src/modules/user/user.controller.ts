import { FastifyInstance } from 'fastify'
import bcrypt from 'bcrypt'

export async function userController(app: FastifyInstance) {
    app.post('/users/register', {
        schema: {
            body: { $ref: 'registerBody#' },
            response: { 201: { type: 'null' } },
        },
        handler: async (req, reply) => {
            const data = req.body as any // já validado
            const hash = await bcrypt.hash(data.password, 12)
            await app.prisma.user.create({
                data: { ...data, password: hash },
            })
            reply.code(201).send()
        },
    })
}