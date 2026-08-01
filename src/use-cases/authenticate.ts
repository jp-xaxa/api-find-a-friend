import { compare } from "bcryptjs"

import type { Ong } from "@/generated/client.js"
import type { OngsRepository } from "@/repositories/ongs-repository.js"

import { InvalidCredentialsError } from "./errors/invalid-credentials-error.js"

interface AuthenticateOngCaseRequest {
  email: string
  password: string
}

interface AuthenticateOngCaseResponse {
  ong: Ong
}

export class AuthenticateOngCase {
  constructor(private ongsRepository: OngsRepository) {}

  async execute({
    email,
    password,
  }: AuthenticateOngCaseRequest): Promise<AuthenticateOngCaseResponse> {
    const ong = await this.ongsRepository.findByEmail(email)

    if (!ong) {
      throw new InvalidCredentialsError()
    }

    const doestPasswordMatches = await compare(password, ong.password_hash)

    if (!doestPasswordMatches) {
      throw new InvalidCredentialsError()
    }

    return {
      ong,
    }
  }
}
