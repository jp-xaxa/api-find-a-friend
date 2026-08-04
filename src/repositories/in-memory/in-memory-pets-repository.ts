import { randomUUID } from "node:crypto"

import type { Pet } from "@/generated/client.js"
import { Prisma } from "@/generated/client.js"
import type { PetsRepository } from "@/repositories/pets-repository.js"

export class InMemoryPetsRepository implements PetsRepository {
  public items: Pet[] = []

  async searchMany(ongsId: string[], page: number) {
    const pets = this.items
      .filter((item) => ongsId.includes(item.ong_id))
      .slice((page - 1) * 20, page * 20)

    return Promise.resolve(pets)
  }

  async create(data: Prisma.PetUncheckedCreateInput) {
    const pet = {
      id: randomUUID(),
      ong_id: data.ong_id,
      name: data.name,
      about: data.about,
      age: data.age,
      size: data.size,
      energy_Level: data.energy_Level,
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
