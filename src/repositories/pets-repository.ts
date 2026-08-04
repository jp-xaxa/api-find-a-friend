import type { $Enums, Pet, Prisma } from "@/generated/client.js"

export const PETS_PER_PAGE = 20

export interface PetFilters {
  age?: $Enums.Age
  size?: $Enums.AnimalSize
  energy_Level?: $Enums.EnergyLevel
  level_independence?: $Enums.LevelOfIndependence
  environment?: $Enums.Environment
  donation_requirements?: string[]
}

export interface SearchManyParams extends PetFilters {
  ongsIds: string[]
  page: number
}

export interface PetsRepository {
  findById(id: string): Promise<Pet | null>
  searchMany(params: SearchManyParams): Promise<Pet[]>
  create(data: Prisma.PetUncheckedCreateInput): Promise<Pet>
}
