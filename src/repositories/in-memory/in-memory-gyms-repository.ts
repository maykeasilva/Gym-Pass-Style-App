import { Gym, Prisma } from '@prisma/client'
import { GymsRepository, findManyNearbyParams } from '../gyms-repository'
import { randomUUID } from 'node:crypto'
import { getDistanceBetweenCoordinates } from '@/utils/get-distance-between-coordinates'

export class InMemoryGymsRepository implements GymsRepository {
  private database: Gym[] = []

  async findById(id: string) {
    const gym = this.database.find((item) => item.id === id)

    if (!gym) {
      return null
    }

    return gym
  }

  async findManyNearby({
    userLatitude,
    userLongitude,
    page,
  }: findManyNearbyParams) {
    const maxDistanceInKilometers = 10

    const gyms = this.database
      .filter((item) => {
        const distance = getDistanceBetweenCoordinates(
          { latitude: userLatitude, longitude: userLongitude },
          {
            latitude: item.latitude.toNumber(),
            longitude: item.longitude.toNumber(),
          },
        )

        return distance < maxDistanceInKilometers
      })
      .slice((page - 1) * 20, page * 20)

    return gyms
  }

  async searchMany(query: string, page: number) {
    const gyms = this.database
      .filter((item) => item.name.includes(query))
      .slice((page - 1) * 20, page * 20)

    return gyms
  }

  async create(data: Prisma.GymCreateInput) {
    const gym = {
      id: data.id ?? randomUUID(),
      name: data.name,
      description: data.description ?? null,
      phone: data.phone ?? null,
      latitude: new Prisma.Decimal(data.latitude.toString()),
      longitude: new Prisma.Decimal(data.longitude.toString()),
    }

    this.database.push(gym)

    return gym
  }
}
