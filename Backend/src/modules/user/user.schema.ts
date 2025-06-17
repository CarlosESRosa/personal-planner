// src/modules/user/user.schema.ts
import { z } from 'zod'

/* ---------- register ---------- */
export const registerBody = z.object({
    name: z.string().min(3),
    email: z.string().email(),
    password: z.string().min(6)
})
export type RegisterBody = z.infer<typeof registerBody>

/* ---------- login ---------- */
export const loginBody = z.object({
    email: z.string().email(),
    password: z.string().min(6)
})
export type LoginBody = z.infer<typeof loginBody>

/* ---------- update ---------- */
export const updateBody = z.object({
    name: z.string().min(3).optional(),
    email: z.string().email().optional()
}).refine(data => Object.keys(data).length > 0, {
    message: 'Send at least one field'
})
export type UpdateBody = z.infer<typeof updateBody>
