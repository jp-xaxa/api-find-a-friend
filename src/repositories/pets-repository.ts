import type { Pet } from "@/generated/client.js"
import { Prisma } from "@/generated/client.js"

export interface PetsRepository {
  // findById(id: string): Promise<Ong | null>
  //findByEmail(email: string): Promise<Ong | null>
  create(data: Prisma.PetUncheckedCreateInput): Promise<Pet>
}
