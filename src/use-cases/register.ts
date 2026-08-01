import { hash } from "bcryptjs"

import type { Ong } from "@/generated/client.js"
import type { OngsRepository } from "@/repositories/ongs-repository.js"
import { OngAlreadyExistsError } from "@/use-cases/errors/ong-already-exists-error.js"

import { DataMandatoryAlreadyExistsError } from "./errors/data-mandatory-already-exists-error.js"
import { EmailNotEqualError } from "./errors/email-not-equal-error.js"

interface RegisterOngCaseRequest {
  name_responsavel: string
  email: string
  cep: string
  address: string
  phone: string
  password: string
  password_confirm: string
}

interface RegisterOngCaseResponse {
  ong: Ong
}

export class RegisterOngCase {
  constructor(private ongsRepository: OngsRepository) {}

  async execute({
    name_responsavel,
    email,
    cep,
    address,
    phone,
    password,
    password_confirm,
  }: RegisterOngCaseRequest): Promise<RegisterOngCaseResponse> {
    const password_hash = await hash(password, 6)

    const ongWithSameEmail = await this.ongsRepository.findByEmail(email)

    if (ongWithSameEmail) {
      throw new OngAlreadyExistsError()
    }

    const verifyPasswordWithPasswordConfirm = password === password_confirm

    if (!verifyPasswordWithPasswordConfirm) {
      throw new EmailNotEqualError()
    }

    const verifyDataMandatory = cep && address && phone

    if (!verifyDataMandatory) {
      throw new DataMandatoryAlreadyExistsError()
    }

    const ong = await this.ongsRepository.create({
      name_responsavel,
      email,
      cep,
      address,
      phone,
      password_hash,
    })

    return {
      ong,
    }
  }
}
