// src/modules/user/user.controller.ts
import { FastifyInstance } from 'fastify'
import bcrypt from 'bcrypt'

const JWT_OPTIONS = { expiresIn: "5m" };

export async function userController(app: FastifyInstance) {
    /* ----- /users/register ----- */
    app.post('/users/register', {
        schema: {
            body: { $ref: 'registerBody#' },
            response: {
                201: {
                    type: 'object',
                    properties: {
                        token: { type: 'string' },
                        user: { $ref: 'UserResponse#' },
                    },
                },
            },
        },
        handler: async (req, reply) => {
            const data = req.body as any;
            const hash = await bcrypt.hash(data.password, 12);

            const user = await app.prisma.user.create({
                data: { ...data, password: hash },
                select: { id: true, name: true, email: true, createdAt: true },
            });

            const token = app.jwt.sign({ id: user.id }, JWT_OPTIONS);

            reply.code(201).send({ token, user });
        },
    });

    /* ----- /users/login ----- */
    app.post('/users/login', {
        schema: {
            body: { $ref: 'loginBody#' },
            response: {
                200: {
                    type: 'object',
                    properties: {
                        token: { type: 'string' },
                        user: { $ref: 'UserResponse#' },
                    },
                },
            },
        },
        handler: async (req, reply) => {
            const { email, password } = req.body as any;

            const dbUser = await app.prisma.user.findUnique({ where: { email } });
            if (!dbUser || !(await bcrypt.compare(password, dbUser.password))) {
                return reply.code(400).send({ message: 'Invalid credentials' });
            }

            const user = {
                id: dbUser.id,
                name: dbUser.name,
                email: dbUser.email,
                createdAt: dbUser.createdAt,
            };
            const token = app.jwt.sign({ id: dbUser.id }, JWT_OPTIONS);

            reply.send({ token, user });
        },
    });
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
