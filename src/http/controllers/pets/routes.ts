import type { FastifyInstance } from "fastify"

import { verifyJwt } from "@/http/middlewares/verify-jwt.js"

import { registerPet } from "./register.js"
import { searchPet } from "./search.js"

export function petsRoutes(app: FastifyInstance) {
  app.post("/pet", { onRequest: [verifyJwt] }, registerPet)
  app.get("/searchPet", searchPet)
}
