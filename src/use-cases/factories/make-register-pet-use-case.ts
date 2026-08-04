import { PrismaOngsRepository } from "@/repositories/prisma/prisma-ongs-repository.js"
import { PrismaPetsRepository } from "@/repositories/prisma/prisma-pets-repository.js"

import { RegisterPetCase } from "../register-pet.js"

export function makeRegisterPetCase() {
  const petsRepository = new PrismaPetsRepository()
  const ongsRepository = new PrismaOngsRepository()
  const registerPetCase = new RegisterPetCase(petsRepository, ongsRepository)

  return registerPetCase
}
