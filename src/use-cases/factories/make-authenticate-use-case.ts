import { PrismaOngsRepository } from "@/repositories/prisma/prisma-ongs-repository.js"

import { AuthenticateOngCase } from "../authenticate.js"

export function makeAuthenticateOngCase() {
  const ongsRepository = new PrismaOngsRepository()
  const authenticateOngCase = new AuthenticateOngCase(ongsRepository)

  return authenticateOngCase
}
