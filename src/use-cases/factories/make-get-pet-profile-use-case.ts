import { PrismaPetsRepository } from "@/repositories/prisma/prisma-pets-repository.js"

import { GetPetProfileCase } from "../get-pet-profile.js"

export function makeGetPetProfileUseCase() {
  const petsRepository = new PrismaPetsRepository()
  const petCase = new GetPetProfileCase(petsRepository)

  return petCase
}
