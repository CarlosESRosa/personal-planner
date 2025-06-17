import { z } from 'zod'

export const registerBody = z.object({
    name: z.string().min(3),
    email: z.string().email(),
    password: z.string().min(6),
})
export type RegisterBody = z.infer<typeof registerBody>
