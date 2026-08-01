import request from "supertest"
import { afterAll, beforeAll, describe, expect, it } from "vitest"

import { app } from "@/app.js"

interface AuthenticateResponse {
  token: string
}

describe("Authenticate (e2e)", () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it("should be able to authenticate", async () => {
    await request(app.server).post("/ongs").send({
      name_responsavel: "João Pedro",
      email: "joaopedro@example.com",
      cep: "36400-014",
      address: "Rua Amaro Ribeiro, 07 , Rosário, Conselheiro Lafaiete - MG",
      phone: "(31) 9 9999-9999",
      password: "123456",
      password_confirm: "123456",
    })

    const response = await request(app.server).post("/sessions").send({
      email: "joaopedro@example.com",
      password: "123456",
    })

    const body = response.body as AuthenticateResponse

    expect(response.status).toEqual(200)
    expect(body.token).toEqual(expect.any(String))
  })
})
