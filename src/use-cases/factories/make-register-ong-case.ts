import { PrismaOngsRepository } from "@/repositories/prisma/prisma-ongs-repository.js"

import { RegisterOngCase } from "../register.js"

export function makeRegisterOngCase() {
  const ongsRepository = new PrismaOngsRepository()
  const registerOngCase = new RegisterOngCase(ongsRepository)

  return registerOngCase
}
