import { z } from 'zod'

/* ---------- corpo: criar ---------- */
export const createTaskBody = z.object({
    title: z.string().min(3),
    description: z.string().optional(),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
    dueDate: z.string().datetime().optional()   // string ISO
})
export type CreateTaskBody = z.infer<typeof createTaskBody>

/* ---------- corpo: atualizar ---------- */
export const updateTaskBody = z.object({
    title: z.string().min(3).optional(),
    description: z.string().optional(),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
    dueDate: z.string().datetime().optional()
}).refine((d) => Object.keys(d).length > 0, { message: 'Send at least one field' })
export type UpdateTaskBody = z.infer<typeof updateTaskBody>

/* ---------- corpo: alterar status ---------- */
export const updateStatusBody = z.object({
    status: z.enum(['PENDING', 'IN_PROGRESS', 'DONE'])
})
export type UpdateStatusBody = z.infer<typeof updateStatusBody>

/* ---------- query: listagem ---------- */
export const listTasksQuery = z.object({
    status: z.enum(['PENDING', 'IN_PROGRESS', 'DONE']).optional(),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
    due_start: z.string().datetime().optional(),
    due_end: z.string().datetime().optional()
})
export type ListTasksQuery = z.infer<typeof listTasksQuery>

/* ---------- params: :id ---------- */
export const taskIdParam = z.object({ id: z.string().uuid() })
