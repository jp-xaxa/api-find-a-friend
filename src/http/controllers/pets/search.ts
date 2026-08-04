import type { FastifyReply, FastifyRequest } from "fastify"
import { z } from "zod"

import {
  Age,
  AnimalSize,
  EnergyLevel,
  Environment,
  LevelOfIndependence,
} from "@/generated/client.js"
import { makeSearchPetCase } from "@/use-cases/factories/make-search-pet-case.js"

const searchQuerySchema = z.object({
  city: z.string(),
  page: z.coerce.number().int().positive(),
  age: z.enum(Age).optional(),
  size: z.enum(AnimalSize).optional(),
  energy_Level: z.enum(EnergyLevel).optional(),
  level_independence: z.enum(LevelOfIndependence).optional(),
  environment: z.enum(Environment).optional(),
  // Aceita `?donation_requirements=a&donation_requirements=b` ou um valor único.
  donation_requirements: z
    .union([z.string(), z.array(z.string())])
    .transform((value) =>
      (Array.isArray(value) ? value : [value])
        .map((requirement) => requirement.trim())
        .filter((requirement) => requirement.length > 0),
    )
    .optional(),
})

type OptionalWithoutUndefined<T> = {
  [K in keyof T]?: Exclude<T[K], undefined>
}

/**
 * O Zod tipa campos `.optional()` como `chave?: T | undefined`, o que o
 * `exactOptionalPropertyTypes` não aceita repassar adiante. Em runtime o Zod
 * não cria a chave quando ela está ausente, então basta descartar valores
 * `undefined` para o objeto casar com o tipo de filtros do use case.
 */
function omitUndefined<T extends object>(
  value: T,
): OptionalWithoutUndefined<T> {
  return Object.fromEntries(
    Object.entries(value).filter(([, entry]) => entry !== undefined),
  ) as OptionalWithoutUndefined<T>
}

/**
 * Formulários costumam enviar filtros não preenchidos como string vazia
 * (`?age=&size=`). Descartamos essas chaves para que os filtros opcionais
 * sejam tratados como ausentes em vez de rejeitados pelos enums.
 */
function omitBlankFilters(query: unknown) {
  if (typeof query !== "object" || query === null) {
    return query
  }

  return Object.fromEntries(
    Object.entries(query).filter(([, value]) => value !== ""),
  )
}

export async function searchPet(request: FastifyRequest, reply: FastifyReply) {
  const { city, page, ...filters } = searchQuerySchema.parse(
    omitBlankFilters(request.query),
  )

  const searchPetCase = makeSearchPetCase()

  const { pets } = await searchPetCase.execute({
    city,
    page,
    ...omitUndefined(filters),
  })

  return reply.status(200).send({
    pets,
  })
}
