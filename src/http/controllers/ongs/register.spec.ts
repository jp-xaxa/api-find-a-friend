import request from "supertest"
import { afterAll, beforeAll, describe, expect, it } from "vitest"

import { app } from "@/app.js"

describe("Register Ong (e2e)", () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it("should be able to register", async () => {
    const response = await request(app.server).post("/ongs").send({
      name_responsavel: "João Pedro",
      email: "joaopedro@example.com",
      cep: "36400-014",
      address: "Rua Amaro Ribeiro, 07 , Rosário, Conselheiro Lafaiete - MG",
      phone: "(31) 9 9999-9999",
      password: "123456",
      password_confirm: "123456",
    })

    expect(response.statusCode).toEqual(201)
  })
})
