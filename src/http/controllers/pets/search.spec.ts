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

const THOR = {
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
}

const ZEUS = {
  name: "Zeus",
  about: "Descrição breve do Zeus",
  age: "Adulto",
  size: "Grande",
  energy_Level: "MEDIA",
  level_independence: "Baixa",
  environment: "Medio",
  donation_requirements: ["Casa sem escadas."],
}

describe("Search Pet (e2e)", () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it("should be able to search pets by city", async () => {
    // Cada teste usa a própria cidade para não depender da ordem de execução.
    const city = "Cidade Busca Por Cidade - MG"
    const { token } = await createAndAuthenticateUser(app, city)

    await request(app.server)
      .post("/pet")
      .set("Authorization", `Bearer ${token}`)
      .send(THOR)

    const responseSearchPet = await request(app.server)
      .get("/searchPet")
      .query({ city, page: 1 })
      .send()

    const body = responseSearchPet.body as SearchPetResponse

    expect(responseSearchPet.statusCode).toEqual(200)
    expect(body.pets).toHaveLength(1)
    expect(body.pets).toEqual([expect.objectContaining({ name: "Thor" })])
  })

  it("should be able to search pets by optional filters", async () => {
    const city = "Cidade Filtros Opcionais - MG"
    const { token } = await createAndAuthenticateUser(app, city)

    for (const pet of [THOR, ZEUS]) {
      await request(app.server)
        .post("/pet")
        .set("Authorization", `Bearer ${token}`)
        .send(pet)
    }

    const responseSearchPet = await request(app.server)
      .get("/searchPet")
      .query({
        city,
        page: 1,
        age: "Adulto",
        size: "Grande",
        energy_Level: "MEDIA",
        level_independence: "Baixa",
        environment: "Medio",
        donation_requirements: "Casa sem escadas.",
      })
      .send()

    const body = responseSearchPet.body as SearchPetResponse

    expect(responseSearchPet.statusCode).toEqual(200)
    expect(body.pets).toHaveLength(1)
    expect(body.pets).toEqual([expect.objectContaining({ name: "Zeus" })])
  })

  it("should treat blank optional filters as absent", async () => {
    const city = "Cidade Filtros Vazios - MG"
    const { token } = await createAndAuthenticateUser(app, city)

    await request(app.server)
      .post("/pet")
      .set("Authorization", `Bearer ${token}`)
      .send(THOR)

    const responseSearchPet = await request(app.server)
      .get("/searchPet")
      .query({
        city,
        page: 1,
        age: "",
        size: "",
        energy_Level: "",
        level_independence: "",
        environment: "",
        donation_requirements: "",
      })
      .send()

    const body = responseSearchPet.body as SearchPetResponse

    expect(responseSearchPet.statusCode).toEqual(200)
    expect(body.pets).toHaveLength(1)
  })

  it("should be able to filter by repeated donation_requirements params", async () => {
    const city = "Cidade Requisitos Repetidos - MG"
    const { token } = await createAndAuthenticateUser(app, city)

    for (const pet of [THOR, ZEUS]) {
      await request(app.server)
        .post("/pet")
        .set("Authorization", `Bearer ${token}`)
        .send(pet)
    }

    const responseSearchPet = await request(app.server)
      .get("/searchPet")
      .query({
        city,
        page: 1,
        donation_requirements: THOR.donation_requirements,
      })
      .send()

    const body = responseSearchPet.body as SearchPetResponse

    expect(responseSearchPet.statusCode).toEqual(200)
    expect(body.pets).toHaveLength(1)
    expect(body.pets).toEqual([expect.objectContaining({ name: "Thor" })])
  })

  it("should return 400 when an optional filter has an invalid value", async () => {
    const city = "Cidade Filtro Invalido - MG"
    const { token } = await createAndAuthenticateUser(app, city)

    await request(app.server)
      .post("/pet")
      .set("Authorization", `Bearer ${token}`)
      .send(THOR)

    const responseSearchPet = await request(app.server)
      .get("/searchPet")
      .query({ city, page: 1, age: "Bebe" })
      .send()

    expect(responseSearchPet.statusCode).toEqual(400)
  })
})
