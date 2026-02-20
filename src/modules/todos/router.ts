import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { createTodoSchema } from "./schema.js";
import { prisma } from "../../utils/prisma.js";

export const todoRouter = new Hono()
.get("/", async(c)=>{
    const todos = await prisma.todo.findMany()
    return c.json({todos})
})
.get("/:id", (c) => {
    return c.json({message: "get single review"})
})
.post("/", zValidator("json",createTodoSchema),(c) => {
    const body =  c.req.json()
    return c.json({ message: "create todos", body})
})