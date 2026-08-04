import type { Pet } from "@prisma/client"

import type { OngsRepository } from "@/repositories/ongs-repository.js"
import type { PetsRepository } from "@/repositories/pets-repository.js"

interface CreatePetUseCaseRequest {
  city: string
  page: number
}

interface CreatePetsUseCaseResponse {
  pets: Pet[]
}

export class SearchPetsUseCase {
  constructor(
    private petsRepository: PetsRepository,
    private ongsRepository: OngsRepository,
  ) {}

  async execute({
    city,
    page,
  }: CreatePetUseCaseRequest): Promise<CreatePetsUseCaseResponse> {
    const ongs = await this.ongsRepository.searchManyCity(city)

    const ongsIds = ongs.map((ong) => ong.id)

    const pets = await this.petsRepository.searchMany(ongsIds, page)

    return {
      pets,
    }
  }
}
