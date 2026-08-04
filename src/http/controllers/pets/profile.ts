import type { FastifyReply, FastifyRequest } from "fastify"
import { z } from "zod"

import { ResourceNotFoundError } from "@/use-cases/errors/resource-not-found-error.js"
import { makeGetPetProfileUseCase } from "@/use-cases/factories/make-get-pet-profile-use-case.js"

export async function profilePet(request: FastifyRequest, reply: FastifyReply) {
  const profilePetParamsSchema = z.object({
    petId: z.string().uuid(),
  })

  const { petId } = profilePetParamsSchema.parse(request.params)

  const profilePetCase = makeGetPetProfileUseCase()

  try {
    const { pet } = await profilePetCase.execute({
      petId,
    })

    return reply.status(200).send({
      ...pet,
    })
  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: err.message })
    }

    throw err
  }
}
