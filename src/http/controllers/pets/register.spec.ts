import request from "supertest"
import { afterAll, beforeAll, describe, expect, it } from "vitest"

import { app } from "@/app.js"
import { createAndAuthenticateUser } from "@/utils/create-and-authenticate-user.js"

describe("Register Pet (e2e)", () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it("should be able to register", async () => {
    const { token } = await createAndAuthenticateUser(app)

    const responseRegisterPet = await request(app.server)
      .post("/pet")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Thor",
        about: "Descrição breve do thor",
        age: "Filhote",
        size: "Medio",
        energy_Level: "ALTA",
        level_independence: "Media",
        environment: "Pequeno",
        donation_requirements: [
          "Casa com área externa.",
          "Cão com intolerância a lactose.",
        ],
      })

    expect(responseRegisterPet.statusCode).toEqual(201)
  })
})
