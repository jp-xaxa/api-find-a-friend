import { randomUUID } from "node:crypto"

import type { Ong } from "@/generated/client.js"
import { Prisma } from "@/generated/client.js"
import type { OngsRepository } from "@/repositories/ongs-repository.js"

export class InMemoryOngsRepository implements OngsRepository {
  public items: Ong[] = []

  // async findById(id: string) {
  //   const user = this.items.find((item) => item.id === id)

  //   if (!user) {
  //     return null
  //   }

  //   return user
  // }

  async findByEmail(email: string) {
    const ong = this.items.find((item) => item.email === email)

    return Promise.resolve(ong ?? null)
  }

  async create(data: Prisma.OngCreateInput) {
    const ong = {
      id: randomUUID(),
      name_responsavel: data.name_responsavel,
      email: data.email,
      cep: data.cep,
      address: data.address,
      phone: data.phone,
      password_hash: data.password_hash,
      created_at: new Date(),
    }

    this.items.push(ong)

    return Promise.resolve(ong)
  }
}
