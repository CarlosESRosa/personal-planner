import { FastifyInstance } from 'fastify'
import { userController } from './user.controller'

export async function userRoutes(app: FastifyInstance) {
    await userController(app)
}