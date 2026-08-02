import type { FastifyInstance } from "fastify"

import { verifyJwt } from "@/http/middlewares/verify-jwt.js"

import { registerPet } from "./register.js"

export function petsRoutes(app: FastifyInstance) {
  app.post("/pet", { onRequest: [verifyJwt] }, registerPet)
}
