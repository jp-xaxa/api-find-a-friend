import { beforeEach, describe, expect, it } from "vitest"

import type { Pet } from "@/generated/client.js"
import { InMemoryPetsRepository } from "@/repositories/in-memory/in-memory-pets-repository.js"
import { ResourceNotFoundError } from "@/use-cases/errors/resource-not-found-error.js"
import { GetPetProfileCase } from "@/use-cases/get-pet-profile.js"

let petsRepository: InMemoryPetsRepository
let sut: GetPetProfileCase

interface profilePetResponse {
  pet: {
    id: string
    name: string
    about: string
    age: string
    size: string
    energy_Level: string
    level_independence: string
    environment: string
    donation_requirements: string[]
    created_at: Date
    ong_id: string
  }
}

describe("Get Pet Profile Use Case", () => {
  beforeEach(() => {
    petsRepository = new InMemoryPetsRepository()
    sut = new GetPetProfileCase(petsRepository)
  })

  it("should be able to get pet profile", async () => {
    const response = await petsRepository.create({
      ong_id: "id-1",
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

    const { id } = response as Pet

    const { pet }: profilePetResponse = await sut.execute({ petId: id })

    expect(pet.name).toEqual("Thor")
  })

  it("should not be able to get pet profile with wrong id", async () => {
    await expect(() =>
      sut.execute({
        petId: "non-existing-id",
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
