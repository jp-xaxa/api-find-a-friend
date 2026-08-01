import type { Ong } from "@/generated/client.js"
import { Prisma } from "@/generated/client.js"

export interface OngsRepository {
  // findById(id: string): Promise<Ong | null>
  findByEmail(email: string): Promise<Ong | null>
  create(data: Prisma.OngCreateInput): Promise<Ong>
}
