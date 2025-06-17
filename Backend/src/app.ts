import Fastify from 'fastify'
import helmet from '@fastify/helmet'
import jwt from '@fastify/jwt'
import swagger from '@fastify/swagger'
import swaggerUi from '@fastify/swagger-ui'
import { env } from './config/env'
import { prismaPlugin } from './core/plugins/prisma'
import { swaggerConfig } from './core/plugins/swagger'
import { routes } from './routes'
import { authPlugin } from './core/plugins/auth'

export const app = Fastify({ logger: true })

app.register(helmet)
app.register(jwt, { secret: env.JWT_SECRET })
app.register(authPlugin)
app.register(prismaPlugin)
app.register(swagger, swaggerConfig)
app.register(swaggerUi, { routePrefix: '/docs' })

app.register(routes, { prefix: '/api/v1' })

app.setErrorHandler((err, _req, reply) => {
    const status = err.statusCode ?? 500
    reply.status(status).send({
        statusCode: status,
        error: err.name,
        message: err.message,
    })
})
