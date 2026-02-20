import z from "zod";

export const createTodoSchema = z.object({
    title: z.string().min(8),
    content: z.string().min(8)
})