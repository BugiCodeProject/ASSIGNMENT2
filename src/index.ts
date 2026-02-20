import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { todoRouter } from './modules/todos/router.js'
import "dotenv/config"

const app = new Hono()
.route("/todos",todoRouter)

serve({
  fetch: app.fetch,
  port: 3000
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})
