import { randomUUID } from "node:crypto"

import type { Pet, Prisma } from "@/generated/client.js"
import type {
  PetsRepository,
  SearchManyParams,
} from "@/repositories/pets-repository.js"
import { PETS_PER_PAGE } from "@/repositories/pets-repository.js"

export class InMemoryPetsRepository implements PetsRepository {
  public items: Pet[] = []

  async searchMany({
    ongsIds,
    page,
    age,
    size,
    energy_Level,
    level_independence,
    environment,
    donation_requirements,
  }: SearchManyParams) {
    const pets = this.items
      .filter((item) => ongsIds.includes(item.ong_id))
      .filter((item) => !age || item.age === age)
      .filter((item) => !size || item.size === size)
      .filter((item) => !energy_Level || item.energy_Level === energy_Level)
      .filter(
        (item) =>
          !level_independence || item.level_independence === level_independence,
      )
      .filter((item) => !environment || item.environment === environment)
      .filter(
        (item) =>
          !donation_requirements?.length ||
          donation_requirements.every((requirement) =>
            item.donation_requirements.includes(requirement),
          ),
      )
      .slice((page - 1) * PETS_PER_PAGE, page * PETS_PER_PAGE)

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
