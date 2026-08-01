import type { FastifyReply, FastifyRequest } from "fastify"
import { z } from "zod"

import { OngAlreadyExistsError } from "@/use-cases/errors/ong-already-exists-error.js"
import { makeRegisterOngCase } from "@/use-cases/factories/make-register-ong-case.js"

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    name_responsavel: z.string(),
    email: z.string().email(),
    cep: z.string(),
    address: z.string(),
    phone: z.string(),
    password: z.string().min(6),
    password_confirm: z.string().min(6),
  })

  const {
    name_responsavel,
    email,
    cep,
    address,
    phone,
    password,
    password_confirm,
  } = registerBodySchema.parse(request.body)

  try {
    console.log("Aqui")
    const registerOngCase = makeRegisterOngCase()

    await registerOngCase.execute({
      name_responsavel,
      email,
      cep,
      address,
      phone,
      password,
      password_confirm,
    })
  } catch (err) {
    if (err instanceof OngAlreadyExistsError) {
      return reply.status(409).send({ message: err.message })
    }

    throw err
  }

  return reply.status(201).send()
}
