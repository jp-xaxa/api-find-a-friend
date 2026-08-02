import { hash } from "bcryptjs"
import type { FastifyInstance } from "fastify"
import request from "supertest"

import { prisma } from "@/libs/prisma.js"

interface AuthenticateResponseBody {
  token: string
}

export async function createAndAuthenticateUser(
  app: FastifyInstance,
): Promise<{ token: string }> {
  await prisma.ong.create({
    data: {
      name_responsavel: "João Pedro",
      email: "joaopedro@example.com",
      cep: "36400-014",
      address: "Rua Amaro Ribeiro, 07 , Rosário, Conselheiro Lafaiete - MG",
      phone: "(31) 9 9999-9999",
      password_hash: await hash("123456", 6),
    },
  })

  const authResponse = await request(app.server).post("/sessions").send({
    email: "joaopedro@example.com",
    password: "123456",
  })

  const { token } = authResponse.body as AuthenticateResponseBody

  return {
    token,
  }
}
