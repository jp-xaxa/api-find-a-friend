import type { FastifyReply, FastifyRequest } from "fastify"
import { z } from "zod"

import { InvalidCredentialsError } from "@/use-cases/errors/invalid-credentials-error.js"
import { makeAuthenticateOngCase } from "@/use-cases/factories/make-authenticate-use-case.js"

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const authenticateBodySchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  })

  const { email, password } = authenticateBodySchema.parse(request.body)

  try {
    const authenticateOngCase = makeAuthenticateOngCase()

    const { ong } = await authenticateOngCase.execute({
      email,
      password,
    })

    const token = await reply.jwtSign(
      {},
      {
        sign: {
          sub: ong.id,
        },
      },
    )

    const refreshToken = await reply.jwtSign(
      {},
      {
        sign: {
          sub: ong.id,
          expiresIn: "7d",
        },
      },
    )

    return reply
      .setCookie("refreshToken", refreshToken, {
        path: "/",
        secure: true,
        sameSite: true,
        httpOnly: true,
      })
      .status(200)
      .send({
        token,
      })
  } catch (err) {
    if (err instanceof InvalidCredentialsError) {
      return reply.status(400).send({ message: err.message })
    }

    throw err
  }
}
