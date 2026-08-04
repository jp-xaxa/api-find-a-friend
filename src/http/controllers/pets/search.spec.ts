import request from "supertest"
import { afterAll, beforeAll, describe, expect, it } from "vitest"

import { app } from "@/app.js"
import { createAndAuthenticateUser } from "@/utils/create-and-authenticate-user.js"

interface SearchPetResponse {
  pets: {
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
  }[]
}

describe("Search Pet (e2e)", () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it("should be able to search pets by city", async () => {
    const { token } = await createAndAuthenticateUser(app)

    await request(app.server)
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

    const responseSearchPet = await request(app.server)
      .get("/searchPet")
      .query({
        city: "Conselheiro Lafaiete - MG",
        page: 1,
      })
      .send()

    const body = responseSearchPet.body as SearchPetResponse

    expect(responseSearchPet.statusCode).toEqual(200)
    expect(body.pets).toHaveLength(1)
  })
})
