// src/modules/user/user.controller.ts
import { FastifyInstance } from 'fastify'
import bcrypt from 'bcrypt'

export async function userController(app: FastifyInstance) {
    /* ----- /users/register ----- */
    app.post('/users/register', {
        schema: {
            body: { $ref: 'registerBody#' },
            response: { 201: { type: 'null' } }
        },
        handler: async (req, reply) => {
            const data = req.body as any
            const hash = await bcrypt.hash(data.password, 12)
            await app.prisma.user.create({
                data: { ...data, password: hash }
            })
            reply.code(201).send()
        }
    })

    /* ----- /users/login ----- */
    app.post('/users/login', {
        schema: {
            body: { $ref: 'loginBody#' },
            response: {
                200: {
                    type: 'object',
                    properties: { token: { type: 'string' } }
                }
            }
        },
        handler: async (req, reply) => {
            const { email, password } = req.body as any
            const user = await app.prisma.user.findUnique({ where: { email } })
            if (!user || !(await bcrypt.compare(password, user.password))) {
                return reply.code(400).send({ message: 'Invalid credentials' })
            }
            const token = app.jwt.sign({ id: user.id })
            reply.send({ token })
        }
    })

    /* ----- /users/me (GET) ----- */
    app.get('/users/me', {
        preHandler: [app.authenticate],
        schema: {
            security: [{ bearerAuth: [] }],
            response: {
                200: {
                    type: 'object',
                    properties: {
                        id: { type: 'string' },
                        name: { type: 'string' },
                        email: { type: 'string' },
                        createdAt: { type: 'string', format: 'date-time' }
                    }
                }
            }
        },
        handler: async (req) => {
            const user = await app.prisma.user.findUnique({
                where: { id: (req.user as any).id },
                select: { id: true, name: true, email: true, createdAt: true }
            })
            return user
        }
    })

    /* ----- /users/me (PUT) ----- */
    app.put('/users/me', {
        preHandler: [app.authenticate],
        schema: {
            security: [{ bearerAuth: [] }],
            body: { $ref: 'updateBody#' },
            response: { 200: { type: 'null' } }
        },
        handler: async (req, reply) => {
            const data = req.body as any
            await app.prisma.user.update({
                where: { id: (req.user as any).id },
                data
            })
            reply.send()
        }
    })
}
