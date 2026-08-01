import type { FastifyInstance } from "fastify"

//import { authenticate } from "./authenticate"
//import { refresh } from "./refresh"
import { register } from "./register.js"

export function ongsRoutes(app: FastifyInstance) {
  app.post("/ongs", register)
  //app.post("/sessions", authenticate)

  //app.patch("/token/refresh", refresh)
}
