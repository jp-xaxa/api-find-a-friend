import type { FastifyReply, FastifyRequest } from "fastify"
import { z } from "zod"

import {
  Age,
  AnimalSize,
  EnergyLevel,
  Environment,
  LevelOfIndependence,
} from "@/generated/client.js"
import { DataMandatoryAlreadyExistsError } from "@/use-cases/errors/data-mandatory-already-exists-error.js"
import { ResourceNotFoundError } from "@/use-cases/errors/resource-not-found-error.js"
import { makeRegisterPetCase } from "@/use-cases/factories/make-register-pet-case.js"

export async function registerPet(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const ongId = request.user.sub

  const registerBodySchema = z.object({
    name: z.string(),
    about: z.string(),
    age: z.enum(Age),
    size: z.enum(AnimalSize),
    energy_Level: z.enum(EnergyLevel),
    level_independence: z.enum(LevelOfIndependence),
    environment: z.enum(Environment),
    donation_requirements: z.array(z.string()),
  })

  const {
    name,
    about,
    age,
    size,
    energy_Level,
    level_independence,
    environment,
    donation_requirements,
  } = registerBodySchema.parse(request.body)

  try {
    const registerPetCase = makeRegisterPetCase()

    await registerPetCase.execute({
      ongId,
      name,
      about,
      age,
      size,
      energy_Level,
      level_independence,
      environment,
      donation_requirements,
    })
  } catch (err) {
    if (err instanceof DataMandatoryAlreadyExistsError) {
      return reply.status(409).send({ message: err.message })
    }

    if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: err.message })
    }

    throw err
  }

  return reply.status(201).send()
}
