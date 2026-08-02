import { Prisma } from "@/generated/client.js"
import { prisma } from "@/libs/prisma.js"

import type { PetsRepository } from "../pets-repository.js"

export class PrismaPetsRepository implements PetsRepository {
  // async findById(id: string) {
  //   const ong = await prisma.ong.findUnique({
  //     where: {
  //       id,
  //     },
  //   })

  //   return ong
  // }

  // async findByEmail(email: string) {
  //   const ong = await prisma.ong.findUnique({
  //     where: {
  //       email,
  //     },
  //   })

  //   return Promise.resolve(ong)
  // }

  async create(data: Prisma.PetUncheckedCreateInput) {
    const pet = await prisma.pet.create({
      data,
    })

    return Promise.resolve(pet)
  }
}
