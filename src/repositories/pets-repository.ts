import type { Pet } from "@/generated/client.js"
import { Prisma } from "@/generated/client.js"

export interface PetsRepository {
  // findById(id: string): Promise<Ong | null>
  searchMany(ongsId: string[], page: number): Promise<Pet[]>
  create(data: Prisma.PetUncheckedCreateInput): Promise<Pet>
}
