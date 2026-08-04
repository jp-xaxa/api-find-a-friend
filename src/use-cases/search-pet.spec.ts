import { beforeEach, describe, expect, it } from "vitest"

import { InMemoryOngsRepository } from "@/repositories/in-memory/in-memory-ongs-repository.js"
import { InMemoryPetsRepository } from "@/repositories/in-memory/in-memory-pets-repository.js"

import { SearchPetsUseCase } from "./search-pet.js"

let petsRepository: InMemoryPetsRepository
let ongsRepository: InMemoryOngsRepository
let sut: SearchPetsUseCase

describe("Search pet Use Case", () => {
  beforeEach(() => {
    petsRepository = new InMemoryPetsRepository()
    ongsRepository = new InMemoryOngsRepository()
    sut = new SearchPetsUseCase(petsRepository, ongsRepository)
  })

  it("should be able to search for gyms", async () => {
    const ong_one = await ongsRepository.create({
      name_responsavel: "João Pedro",
      email: "joaopedro@example.com",
      cep: "36400-014",
      address: "Rua Amaro Ribeiro, 07 , Rosário, Conselheiro Lafaiete - MG",
      phone: "(31) 9 9999-9999",
      password_hash: "password-hash",
    })

    const ong_two = await ongsRepository.create({
      name_responsavel: "João Pedro",
      email: "joaopedro@example.com",
      cep: "36400-014",
      address: "Rua Amaro Ribeiro, 07 , Rosário, Ouro Branco - MG",
      phone: "(31) 9 9999-9999",
      password_hash: "password-hash",
    })

    await petsRepository.create({
      ong_id: ong_one.id,
      name: "Thor",
      about: "Descrição breve do thor",
      age: "Filhote",
      size: "Medio",
      level_independence: "Media",
      environment: "Pequeno",
      donation_requirements: [
        "Casa com área externa.",
        "Cão com intolerância a lactose.",
      ],
    })

    await petsRepository.create({
      ong_id: ong_two.id,
      name: "Zeus",
      about: "Descrição breve do zeus",
      age: "Adulto",
      size: "Grande",
      level_independence: "Alta",
      environment: "Medio",
      donation_requirements: [
        "Casa com área externa.",
        "Cão com intolerância a lactose.",
      ],
    })

    const { pets } = await sut.execute({
      city: "Conselheiro Lafaiete - MG",
      page: 1,
    })

    expect(pets).toHaveLength(1)
    expect(pets).toEqual([expect.objectContaining({ name: "Thor" })])
  })

  it("should be able to fetch paginated gym search", async () => {
    const ong_one = await ongsRepository.create({
      name_responsavel: "João Pedro",
      email: "joaopedro@example.com",
      cep: "36400-014",
      address: "Rua Amaro Ribeiro, 07 , Rosário, Conselheiro Lafaiete - MG",
      phone: "(31) 9 9999-9999",
      password_hash: "password-hash",
    })

    for (let i = 1; i <= 22; i++) {
      await petsRepository.create({
        ong_id: ong_one.id,
        name: `Thor ${i}`,
        about: "Descrição breve do thor",
        age: "Filhote",
        size: "Medio",
        level_independence: "Media",
        environment: "Pequeno",
        donation_requirements: [
          "Casa com área externa.",
          "Cão com intolerância a lactose.",
        ],
      })
    }

    const { pets } = await sut.execute({
      city: "Conselheiro Lafaiete - MG",
      page: 2,
    })

    expect(pets).toHaveLength(2)
    expect(pets).toEqual([
      expect.objectContaining({ name: "Thor 21" }),
      expect.objectContaining({ name: "Thor 22" }),
    ])
  })
})
