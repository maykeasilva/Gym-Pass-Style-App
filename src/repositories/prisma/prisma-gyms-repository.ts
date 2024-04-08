import { GymsRepository, findManyNearbyParams } from '../gyms-repository'
import { Gym, Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'

export class PrismaGymsRepository implements GymsRepository {
  async findById(id: string) {
    const gym = await prisma.gym.findUnique({
      where: {
        id,
      },
    })

    return gym
  }

  async findManyNearby({ userLatitude, userLongitude }: findManyNearbyParams) {
    const maxDistanceInKilometers = 10

    const gyms = await prisma.$queryRaw<Gym[]>`
      SELECT * from gyms
      WHERE ( 6371 * acos( cos( radians(${userLatitude}) ) * cos( radians( latitude ) ) * cos( radians( longitude ) - radians(${userLongitude}) ) + sin( radians(${userLatitude}) ) * sin( radians( latitude ) ) ) ) <= ${maxDistanceInKilometers}
    `

    return gyms
  }

  async searchMany(query: string, page: number) {
    const itemsPerPage = 20

    const gyms = await prisma.gym.findMany({
      where: {
        name: {
          contains: query.toLowerCase(),
          mode: 'insensitive',
        },
      },
      take: itemsPerPage,
      skip: (page - 1) * itemsPerPage,
    })

    return gyms
  }

  async create(data: Prisma.GymCreateInput) {
    const gym = await prisma.gym.create({
      data,
    })

    return gym
  }
}
