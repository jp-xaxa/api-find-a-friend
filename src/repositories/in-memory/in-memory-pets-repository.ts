import { randomUUID } from "node:crypto"

import type { Pet } from "@/generated/client.js"
import { Prisma } from "@/generated/client.js"
import type { PetsRepository } from "@/repositories/pets-repository.js"

export class InMemoryPetsRepository implements PetsRepository {
  public items: Pet[] = []

  // async findById(id: string) {
  //   const ong = this.items.find((item) => item.id === id)

  //   return Promise.resolve(ong ?? null)
  // }

  // async findByEmail(email: string) {
  //   const ong = this.items.find((item) => item.email === email)

  //   return Promise.resolve(ong ?? null)
  // }

  async create(data: Prisma.PetUncheckedCreateInput) {
    const pet = {
      id: randomUUID(),
      ong_id: data.ong_id,
      name: data.name,
      about: data.about,
      age: data.age,
      size: data.size,
      level_independence: data.level_independence,
      environment: data.environment,
      donation_requirements: Array.isArray(data.donation_requirements)
        ? data.donation_requirements
        : (data.donation_requirements?.set ?? []),
      created_at: new Date(),
    }

    this.items.push(pet)

    return Promise.resolve(pet)
  }
}
