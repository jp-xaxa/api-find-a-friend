import { hash } from "bcryptjs"
import { beforeEach, describe, expect, it } from "vitest"

import { InMemoryOngsRepository } from "@/repositories/in-memory/in-memory-ongs-repository.js"
import { InMemoryPetsRepository } from "@/repositories/in-memory/in-memory-pets-repository.js"

import { DataMandatoryAlreadyExistsError } from "./errors/data-mandatory-already-exists-error.js"
import { ResourceNotFoundError } from "./errors/resource-not-found-error.js"
import { RegisterPetCase } from "./register-pet.js"

let petsRepository: InMemoryPetsRepository
let ongsRepository: InMemoryOngsRepository
let sut: RegisterPetCase
let ongId: string

describe("Case register pet unit tests", () => {
  beforeEach(async () => {
    petsRepository = new InMemoryPetsRepository()
    ongsRepository = new InMemoryOngsRepository()
    sut = new RegisterPetCase(petsRepository, ongsRepository)

    const ong = await ongsRepository.create({
      name_responsavel: "John Doe",
      email: "johndoe@example.com",
      cep: "00000-000",
      address: "Rua das Flores, 123",
      phone: "11999999999",
      password_hash: await hash("123456", 6),
    })

    ongId = ong.id
  })

  it("should to register", async () => {
    const { pet } = await sut.execute({
      ongId,
      name: "Thor",
      about: "Descrição breve do thor",
      age: "Filhote",
      size: "Medio",
      energy_Level: "BAIXA",
      level_independence: "Media",
      environment: "Pequeno",
      donation_requirements: [
        "Casa com área externa.",
        "Cão com intolerância a lactose.",
      ],
    })

    expect(pet.id).toEqual(expect.any(String))
  })

  it("should not be able to register without data mandatory", async () => {
    await expect(() =>
      sut.execute({
        ongId,
        name: "",
        about: "Descrição breve do thor",
        age: "Filhote",
        size: "Pequeno",
        energy_Level: "ALTA",
        level_independence: "Media",
        environment: "Pequeno",
        donation_requirements: [
          "Casa com área externa.",
          "Cão com intolerância a lactose.",
        ],
      }),
    ).rejects.toBeInstanceOf(DataMandatoryAlreadyExistsError)
  })

  it("should not be able to register a pet with a non-existing ong", async () => {
    await expect(() =>
      sut.execute({
        ongId: "non-existing-ong-id",
        name: "Thor",
        about: "Descrição breve do thor",
        age: "Filhote",
        size: "Medio",
        energy_Level: "MEDIA",
        level_independence: "Media",
        environment: "Pequeno",
        donation_requirements: [
          "Casa com área externa.",
          "Cão com intolerância a lactose.",
        ],
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
