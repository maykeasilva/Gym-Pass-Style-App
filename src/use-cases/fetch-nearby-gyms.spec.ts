import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { FetchNearbyGymsUseCase } from './fetch-nearby-gyms'

let gymsRepository: InMemoryGymsRepository
let sut: FetchNearbyGymsUseCase

describe('Fetch Nearby Gyms Use Case', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new FetchNearbyGymsUseCase(gymsRepository)
  })

  it('should be able to fetch nearby gyms', async () => {
    await gymsRepository.create({
      name: 'Near Gym',
      description: null,
      phone: null,
      latitude: -20.9145873,
      longitude: -44.0732596,
    })

    await gymsRepository.create({
      name: 'Far Gym',
      description: null,
      phone: null,
      latitude: -21.101402,
      longitude: -44.2285656,
    })

    const { gyms } = await sut.execute({
      userLatitude: -20.9205444,
      userLongitude: -44.0712663,
      page: 1,
    })

    expect(gyms).toHaveLength(1)
  })

  it('should be able to fetch paginated search for nearby gyms', async () => {
    for (let i = 1; i <= 22; i++) {
      await gymsRepository.create({
        name: `Near Gym ${i}`,
        latitude: -20.9145873,
        longitude: -44.0732596,
      })
    }

    await gymsRepository.create({
      name: 'Far Gym',
      description: null,
      phone: null,
      latitude: -21.101402,
      longitude: -44.2285656,
    })

    const { gyms } = await sut.execute({
      userLatitude: -20.9205444,
      userLongitude: -44.0712663,
      page: 2,
    })

    expect(gyms).toHaveLength(2)
    expect(gyms).toEqual([
      expect.objectContaining({ name: 'Near Gym 21' }),
      expect.objectContaining({ name: 'Near Gym 22' }),
    ])
  })
})
