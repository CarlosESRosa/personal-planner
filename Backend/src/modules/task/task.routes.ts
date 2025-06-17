import { FastifyInstance } from 'fastify'
import { taskController } from './task.controller'

export async function taskRoutes(app: FastifyInstance) {
    app.log.info('>>> carregando taskRoutes')
    await taskController(app)
}
