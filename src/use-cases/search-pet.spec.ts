import { beforeEach, describe, expect, it } from "vitest"

import type { Prisma } from "@/generated/client.js"
import { InMemoryOngsRepository } from "@/repositories/in-memory/in-memory-ongs-repository.js"
import { InMemoryPetsRepository } from "@/repositories/in-memory/in-memory-pets-repository.js"

import { SearchPetsUseCase } from "./search-pet.js"

let petsRepository: InMemoryPetsRepository
let ongsRepository: InMemoryOngsRepository
let sut: SearchPetsUseCase

const CITY = "Conselheiro Lafaiete - MG"

function createOng(city: string) {
  return ongsRepository.create({
    name_responsavel: "João Pedro",
    email: `ong-${city}@example.com`,
    cep: "36400-014",
    address: `Rua Amaro Ribeiro, 07 , Rosário, ${city}`,
    phone: "(31) 9 9999-9999",
    password_hash: "password-hash",
  })
}

function createPet(
  ong_id: string,
  overrides: Partial<Prisma.PetUncheckedCreateInput> = {},
) {
  return petsRepository.create({
    ong_id,
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
    ...overrides,
  })
}

describe("Search pet Use Case", () => {
  beforeEach(() => {
    petsRepository = new InMemoryPetsRepository()
    ongsRepository = new InMemoryOngsRepository()
    sut = new SearchPetsUseCase(petsRepository, ongsRepository)
  })

  it("should be able to search for pets city and page mandatory", async () => {
    const ong_one = await createOng(CITY)
    const ong_two = await createOng("Ouro Branco - MG")

    await createPet(ong_one.id, { name: "Thor" })
    await createPet(ong_two.id, { name: "Zeus" })

    const { pets } = await sut.execute({
      city: CITY,
      page: 1,
    })

    expect(pets).toHaveLength(1)
    expect(pets).toEqual([expect.objectContaining({ name: "Thor" })])
  })

  it("should be able to fetch paginated pets search", async () => {
    const ong_one = await createOng(CITY)

    for (let i = 1; i <= 22; i++) {
      await createPet(ong_one.id, { name: `Thor ${i}` })
    }

    const { pets } = await sut.execute({
      city: CITY,
      page: 2,
    })

    expect(pets).toHaveLength(2)
    expect(pets).toEqual([
      expect.objectContaining({ name: "Thor 21" }),
      expect.objectContaining({ name: "Thor 22" }),
    ])
  })

  it("should be able to search pets by optional filters", async () => {
    const ong = await createOng(CITY)

    await createPet(ong.id, { name: "Thor" })
    await createPet(ong.id, {
      name: "Zeus",
      age: "Adulto",
      size: "Grande",
      energy_Level: "MEDIA",
      level_independence: "Alta",
      environment: "Medio",
      donation_requirements: ["Casa sem escadas."],
    })

    const { pets } = await sut.execute({
      city: CITY,
      page: 1,
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

    expect(pets).toHaveLength(1)
    expect(pets).toEqual([expect.objectContaining({ name: "Thor" })])
  })

  it.each([
    { filter: { age: "Adulto" }, label: "age" },
    { filter: { size: "Grande" }, label: "size" },
    { filter: { energy_Level: "MEDIA" }, label: "energy_Level" },
    { filter: { level_independence: "Alta" }, label: "level_independence" },
    { filter: { environment: "Medio" }, label: "environment" },
  ] as const)(
    "should exclude pets that do not match the $label filter",
    async ({ filter }) => {
      const ong = await createOng(CITY)

      await createPet(ong.id, { name: "Thor" })

      const { pets } = await sut.execute({
        city: CITY,
        page: 1,
        ...filter,
      })

      expect(pets).toHaveLength(0)
    },
  )

  it("should not return pets that only meet part of the donation requirements", async () => {
    const ong = await createOng(CITY)

    await createPet(ong.id, {
      name: "Thor",
      donation_requirements: ["Casa com área externa."],
    })

    const { pets } = await sut.execute({
      city: CITY,
      page: 1,
      donation_requirements: [
        "Casa com área externa.",
        "Cão com intolerância a lactose.",
      ],
    })

    expect(pets).toHaveLength(0)
  })

  it("should return every pet in the city when no optional filter is sent", async () => {
    const ong = await createOng(CITY)

    await createPet(ong.id, { name: "Thor" })
    await createPet(ong.id, {
      name: "Zeus",
      age: "Idoso",
      size: "Grande",
      energy_Level: "MUITO_BAIXA",
      level_independence: "Baixa",
      environment: "Grande",
      donation_requirements: [],
    })

    const { pets } = await sut.execute({
      city: CITY,
      page: 1,
    })

    expect(pets).toHaveLength(2)
  })

  it("should ignore the donation requirements filter when it is empty", async () => {
    const ong = await createOng(CITY)

    await createPet(ong.id, { name: "Thor" })
    await createPet(ong.id, { name: "Zeus", donation_requirements: [] })

    const { pets } = await sut.execute({
      city: CITY,
      page: 1,
      donation_requirements: [],
    })

    expect(pets).toHaveLength(2)
  })
})
