import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { createTodoSchema } from "./schema.js";
import { prisma } from "../../utils/prisma.js";
import { TodoScalarFieldEnum } from "../../generated/prisma/internal/prismaNamespace.js";

export const todoRouter = new Hono()
  .get("/", async (c) => {
    try {
      const todos = await prisma.todo.findMany();
      console.log(todos);
      if (!todos) {
        return c.json({ message: "Not Found" }, 404);
      }
      return c.json({ todos });
    } catch (error) {
      return c.json({ message: "Terjadi kesalahan pada server" }, 500);
    }
  })

  .get("/:id", async (c) => {
    try {
      const todoId = Number(c.req.param("id"));
      const todo = await prisma.todo.findUnique({
        where: {
          id: todoId,
        },
      });
      if (!todo) {
        return c.json({ message: "Not Found" }, 404);
      }
      return c.json({ todo });
    } catch (error) {
      return c.json({ message: "Terjadi kesalahan pada server" }, 500);
    }
  })

  .patch("/:id", async (c) => {
    try {
      const todoId = Number(c.req.param("id"));
      const body = await c.req.json();
      const updatedTodo = await prisma.todo.update({
        where: {
          id: todoId,
        },
        data: {
          title: body.title,
          content: body.content,
        },
      });
      return c.json(updatedTodo);
    } catch (error) {
      return c.json({ message: "Data tidak ditemukan atau gagal diubah" }, 404);
    }
  })

  .delete("/:id", async (c) => {
    try {
      const todoId = Number(c.req.param("id"));

      const deleteTodo = await prisma.todo.delete({
        where: {
          id: todoId,
        },
      });
      return c.json({ message: "Data Berhasil Didelete", data: deleteTodo });
    } catch (error) {
      return c.json(
        { message: "Data tidak ditemukan atau gagal dihapus" },
        404,
      );
    }
  })

  .post("/", zValidator("json", createTodoSchema), async (c) => {
    try {
      const body = c.req.valid("json");

      const newTodo = await prisma.todo.create({
        data: {
          title: body.title,
          content: body.content,
        },
      });
      return c.json(newTodo, 201);
    } catch (error) {
      return c.json({ message: "Data gagal di insert" }, 401);
    }
  });
