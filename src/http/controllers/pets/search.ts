import type { FastifyReply, FastifyRequest } from "fastify"
import { z } from "zod"

import { ResourceNotFoundError } from "@/use-cases/errors/resource-not-found-error.js"
import { makeSearchPetCase } from "@/use-cases/factories/make-search-pet-case.js"

export async function searchPet(request: FastifyRequest, reply: FastifyReply) {
  const registerQuerySchema = z.object({
    city: z.string(),
    page: z.coerce.number().int().positive(),
  })

  const { city, page } = registerQuerySchema.parse(request.query)

  try {
    const searchPetCase = makeSearchPetCase()

    const { pets } = await searchPetCase.execute({
      city,
      page,
    })

    return reply.status(200).send({
      pets,
    })
  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: err.message })
    }

    throw err
  }
}
