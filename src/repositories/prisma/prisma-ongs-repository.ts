import { Prisma } from "@/generated/client.js"
import { prisma } from "@/libs/prisma.js"

import type { OngsRepository } from "../ongs-repository.js"

export class PrismaOngsRepository implements OngsRepository {
  async findById(id: string) {
    const ong = await prisma.ong.findUnique({
      where: {
        id,
      },
    })

    return ong
  }

  async findByEmail(email: string) {
    const ong = await prisma.ong.findUnique({
      where: {
        email,
      },
    })

    return Promise.resolve(ong)
  }

  async searchManyCity(city: string) {
    const ongs = await prisma.ong.findMany({
      where: {
        address: {
          contains: city,
        },
      },
    })

    return Promise.resolve(ongs)
  }

  async create(data: Prisma.OngCreateInput) {
    const ong = await prisma.ong.create({
      data,
    })

    return Promise.resolve(ong)
  }
}
