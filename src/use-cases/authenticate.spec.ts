import { randomUUID } from "node:crypto"

import { hash } from "bcryptjs"
import { beforeEach, describe, expect, it } from "vitest"

import { InMemoryOngsRepository } from "@/repositories/in-memory/in-memory-ongs-repository.js"

import { AuthenticateOngCase } from "./authenticate.js"
import { InvalidCredentialsError } from "./errors/invalid-credentials-error.js"

let ongsRepository: InMemoryOngsRepository
let sut: AuthenticateOngCase

describe("Authenticate Use Case", () => {
  beforeEach(() => {
    ongsRepository = new InMemoryOngsRepository()
    sut = new AuthenticateOngCase(ongsRepository)
  })

  it("should be able to authenticate", async () => {
    await ongsRepository.create({
      id: randomUUID(),
      name_responsavel: "João Pedro",
      email: "joaopedro@example.com",
      cep: "36400-014",
      address: "Rua Amaro Ribeiro, 07 , Rosário, Conselheiro Lafaiete - MG",
      phone: "(31) 9 9999-9999",
      password_hash: await hash("123456", 6),
    })

    const { ong } = await sut.execute({
      email: "joaopedro@example.com",
      password: "123456",
    })

    expect(ong.id).toEqual(expect.any(String))
  })

  it("should not be able to authenticate with wrong email", async () => {
    await expect(() =>
      sut.execute({
        email: "joaopedro@example.com",
        password: "123456",
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it("should not be able to authenticate with wrong email", async () => {
    await ongsRepository.create({
      id: randomUUID(),
      name_responsavel: "João Pedro",
      email: "joaopedro@example.com",
      cep: "36400-014",
      address: "Rua Amaro Ribeiro, 07 , Rosário, Conselheiro Lafaiete - MG",
      phone: "(31) 9 9999-9999",
      password_hash: await hash("123456", 6),
    })

    await expect(() =>
      sut.execute({
        email: "johndoe@example.com",
        password: "123123",
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})
