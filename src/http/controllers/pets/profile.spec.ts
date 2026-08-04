import request from "supertest"
import { afterAll, beforeAll, describe, expect, it } from "vitest"

import { app } from "@/app.js"
import { createAndAuthenticateUser } from "@/utils/create-and-authenticate-user.js"

interface ProfilePetResponse {
  id: string
  name: string
  about: string
  age: string
  size: string
  energy_Level: string
  level_independence: string
  environment: string
  donation_requirements: string[]
  created_at: string
  ong_id: string
}

describe("Profile Pet (e2e)", () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it("should be able to profile pets", async () => {
    const { token } = await createAndAuthenticateUser(app)

    const responseCreatePet = await request(app.server)
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
      
    expect(responseCreatePet.statusCode).toEqual(201)

    const pet = responseCreatePet.body as ProfilePetResponse

    const responseProfilePet = await request(app.server).get(
      `/profilePet/${pet.id}`,
    )

    const body = responseProfilePet.body as ProfilePetResponse

    expect(responseProfilePet.statusCode).toEqual(200)
    expect(body.name).toEqual("Thor")
  })
})
