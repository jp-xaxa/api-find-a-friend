import type { Pet } from "@/generated/client.js"
import type { OngsRepository } from "@/repositories/ongs-repository.js"
import type {
  PetFilters,
  PetsRepository,
} from "@/repositories/pets-repository.js"

interface SearchPetsUseCaseRequest extends PetFilters {
  city: string
  page: number
}

interface SearchPetsUseCaseResponse {
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
    ...filters
  }: SearchPetsUseCaseRequest): Promise<SearchPetsUseCaseResponse> {
    const ongs = await this.ongsRepository.searchManyCity(city)

    const ongsIds = ongs.map((ong) => ong.id)

    const pets = await this.petsRepository.searchMany({
      ongsIds,
      page,
      ...filters,
    })

    return {
      pets,
    }
  }
}
