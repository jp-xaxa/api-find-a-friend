import type { Prisma } from "@/generated/client.js"
import { prisma } from "@/libs/prisma.js"

import type { PetsRepository, SearchManyParams } from "../pets-repository.js"
import { PETS_PER_PAGE } from "../pets-repository.js"

export class PrismaPetsRepository implements PetsRepository {
  async findById(id: string) {
    const pet = await prisma.pet.findUnique({
      where: {
        id,
      },
    })

    return pet
  }

  async searchMany({
    ongsIds,
    page,
    donation_requirements,
    ...filters
  }: SearchManyParams) {
    const pets = await prisma.pet.findMany({
      where: {
        ong_id: {
          in: ongsIds,
        },

        // Filtros de enum ausentes não entram no where (equality direta).
        ...filters,

        ...(donation_requirements &&
          donation_requirements.length > 0 && {
            donation_requirements: {
              hasEvery: donation_requirements,
            },
          }),
      },

      take: PETS_PER_PAGE,
      skip: (page - 1) * PETS_PER_PAGE,
    })

    return pets
  }

  async create(data: Prisma.PetUncheckedCreateInput) {
    const pet = await prisma.pet.create({
      data,
    })

    return Promise.resolve(pet)
  }
}
