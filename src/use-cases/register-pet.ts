import type { $Enums, Pet } from "@/generated/client.js"
import type { OngsRepository } from "@/repositories/ongs-repository.js"
import type { PetsRepository } from "@/repositories/pets-repository.js"

import { DataMandatoryAlreadyExistsError } from "./errors/data-mandatory-already-exists-error.js"
import { ResourceNotFoundError } from "./errors/resource-not-found-error.js"

interface RegisterPetCaseRequest {
  ongId: string
  name: string
  about: string
  age: $Enums.Age
  size: $Enums.AnimalSize
  level_independence: $Enums.LevelOfIndependence
  environment: $Enums.Environment
  donation_requirements: string[]
}

interface RegisterPetCaseResponse {
  pet: Pet
}

export class RegisterPetCase {
  constructor(
    private petsRepository: PetsRepository,
    private ongsRepository: OngsRepository,
  ) {}

  async execute({
    ongId,
    name,
    about,
    age,
    size,
    level_independence,
    environment,
    donation_requirements,
  }: RegisterPetCaseRequest): Promise<RegisterPetCaseResponse> {
    const verifyDataMandatory = name && about

    if (!verifyDataMandatory) {
      throw new DataMandatoryAlreadyExistsError()
    }

    const ong = await this.ongsRepository.findById(ongId)

    if (!ong) {
      throw new ResourceNotFoundError()
    }

    const pet = await this.petsRepository.create({
      ong_id: ongId,
      name,
      about,
      age,
      size,
      level_independence,
      environment,
      donation_requirements,
    })

    return {
      pet,
    }
  }
}
