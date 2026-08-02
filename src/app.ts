import fastifyCookie from "@fastify/cookie"
import fastifyJwt from "@fastify/jwt"
import fastify from "fastify"
import { ZodError } from "zod"

import { env } from "@/env/index.js"
import { ongsRoutes } from "@/http/controllers/ongs/routes.js"
import { petsRoutes } from "@/http/controllers/pets/routes.js"
import { formatValidationError } from "@/utils/format-validation-error.js"

export const app = fastify()

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
  cookie: {
    cookieName: "refreshToken",
    signed: false,
  },
  sign: {
    expiresIn: "10m",
  },
})

app.register(fastifyCookie)

app.register(ongsRoutes)
app.register(petsRoutes)

app.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError) {
    return reply.status(400).send(formatValidationError(error))
  }

  if (env.NODE_ENV !== "production") {
    console.error(error)
  } else {
    // TODO: Here we should log to a external tool like DataDog/NewRelic/Sentry
  }

  return reply.status(500).send({ message: "Internal server error." })
})
