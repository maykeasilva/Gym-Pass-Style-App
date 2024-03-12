import type { Gym, Prisma } from '@prisma/client'

export interface findManyNearbyParams {
  userLatitude: number
  userLongitude: number
  page: number
}

export interface GymsRepository {
  findById(id: string): Promise<Gym | null>
  findManyNearby(params: findManyNearbyParams): Promise<Gym[]>
  searchMany(query: string, page: number): Promise<Gym[]>
  create(data: Prisma.GymCreateInput): Promise<Gym>
}
