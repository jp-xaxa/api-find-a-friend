import { compare } from "bcryptjs"
import { beforeEach, describe, expect, it } from "vitest"

import { InMemoryOngsRepository } from "@/repositories/in-memory/in-memory-ongs-repository.js"

import { DataMandatoryAlreadyExistsError } from "./errors/data-mandatory-already-exists-error.js"
import { EmailNotEqualError } from "./errors/email-not-equal-error.js"
import { OngAlreadyExistsError } from "./errors/ong-already-exists-error.js"
import { RegisterOngCase } from "./register.js"

let ongsRepository: InMemoryOngsRepository
let sut: RegisterOngCase

describe("Case register unit tests", () => {
  beforeEach(() => {
    ongsRepository = new InMemoryOngsRepository()
    sut = new RegisterOngCase(ongsRepository)
  })

  it("should to register", async () => {
    const { ong } = await sut.execute({
      name_responsavel: "João Pedro",
      email: "joaopedro@example.com",
      cep: "36400-014",
      address: "Rua Amaro Ribeiro, 07 , Rosário, Conselheiro Lafaiete - MG",
      phone: "(31) 9 9999-9999",
      password: "123456",
      password_confirm: "123456",
    })

    expect(ong.id).toEqual(expect.any(String))
  })

  it("should hash ong password upon registration", async () => {
    const { ong } = await sut.execute({
      name_responsavel: "João Pedro",
      email: "joaopedro@example.com",
      cep: "36400-014",
      address: "Rua Amaro Ribeiro, 07 , Rosário, Conselheiro Lafaiete - MG",
      phone: "(31) 9 9999-9999",
      password: "123456",
      password_confirm: "123456",
    })

    const isPasswordCorrectlyHashed = await compare("123456", ong.password_hash)

    expect(isPasswordCorrectlyHashed).toBe(true)
  })

  it("should not be able to register with same email twice", async () => {
    const email = "joaopedro@example.com"

    await sut.execute({
      name_responsavel: "João Pedro",
      email,
      cep: "36400-014",
      address: "Rua Amaro Ribeiro, 07 , Rosário, Conselheiro Lafaiete - MG",
      phone: "(31) 9 9999-9999",
      password: "123456",
      password_confirm: "123456",
    })

    await expect(() =>
      sut.execute({
        name_responsavel: "João Pedro",
        email,
        cep: "36400-014",
        address: "Rua Amaro Ribeiro, 07 , Rosário, Conselheiro Lafaiete - MG",
        phone: "(31) 9 9999-9999",
        password: "123456",
        password_confirm: "123456",
      }),
    ).rejects.toBeInstanceOf(OngAlreadyExistsError)
  })

  it("should not be able to register with different passwords and confirmation passwords", async () => {
    await expect(() =>
      sut.execute({
        name_responsavel: "João Pedro",
        email: "joaopedro@example.com",
        cep: "36400-014",
        address: "Rua Amaro Ribeiro, 07 , Rosário, Conselheiro Lafaiete - MG",
        phone: "(31) 9 9999-9999",
        password: "123456",
        password_confirm: "654321",
      }),
    ).rejects.toBeInstanceOf(EmailNotEqualError)
  })

  it("should not be able to register without data mandatory", async () => {
    await expect(() =>
      sut.execute({
        name_responsavel: "João Pedro",
        email: "joaopedro@example.com",
        cep: "",
        address: "",
        phone: "",
        password: "123456",
        password_confirm: "123456",
      }),
    ).rejects.toBeInstanceOf(DataMandatoryAlreadyExistsError)
  })
})
