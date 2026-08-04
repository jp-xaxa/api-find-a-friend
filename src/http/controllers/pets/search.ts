import type { FastifyReply, FastifyRequest } from "fastify"
import { z } from "zod"

import {
  Age,
  AnimalSize,
  EnergyLevel,
  Environment,
  LevelOfIndependence,
} from "@/generated/client.js"
import { makeSearchPetCase } from "@/use-cases/factories/make-search-pet-use-case.js"

export async function searchPet(request: FastifyRequest, reply: FastifyReply) {
  const searchQuerySchema = z.object({
    city: z.string(),
    page: z.coerce.number().int().positive(),
    age: z.enum(Age).or(z.literal("")).optional(),
    size: z.enum(AnimalSize).or(z.literal("")).optional(),
    energy_Level: z.enum(EnergyLevel).or(z.literal("")).optional(),
    level_independence: z
      .enum(LevelOfIndependence)
      .or(z.literal(""))
      .optional(),
    environment: z.enum(Environment).or(z.literal("")).optional(),
    donation_requirements: z
      .union([z.string(), z.array(z.string())])
      .optional(),
  })

  const {
    city,
    page,
    age,
    size,
    energy_Level,
    level_independence,
    environment,
    donation_requirements,
  } = searchQuerySchema.parse(request.query)

  const searchPetCase = makeSearchPetCase()

  const { pets } = await searchPetCase.execute({
    city,
    page,
    ...(age && { age }),
    ...(size && { size }),
    ...(energy_Level && { energy_Level }),
    ...(level_independence && { level_independence }),
    ...(environment && { environment }),
    ...(donation_requirements && {
      donation_requirements: (Array.isArray(donation_requirements)
        ? donation_requirements
        : [donation_requirements]
      )
        .map((requirement) => requirement.trim())
        .filter((requirement) => requirement.length > 0),
    }),
  })

  return reply.status(200).send({
    pets,
  })
}
