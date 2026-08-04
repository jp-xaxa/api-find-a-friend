import { PrismaOngsRepository } from "@/repositories/prisma/prisma-ongs-repository.js"
import { PrismaPetsRepository } from "@/repositories/prisma/prisma-pets-repository.js"

import { SearchPetsUseCase } from "../search-pet.js"

export function makeSearchPetCase() {
  const petsRepository = new PrismaPetsRepository()
  const ongsRepository = new PrismaOngsRepository()
  const searchPetCase = new SearchPetsUseCase(petsRepository, ongsRepository)

  return searchPetCase
}
