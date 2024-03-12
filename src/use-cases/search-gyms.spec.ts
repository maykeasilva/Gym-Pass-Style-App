import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { SearchGymsUseCase } from './search-gyms'

let gymsRepository: InMemoryGymsRepository
let sut: SearchGymsUseCase

describe('Search Gyms Use Case', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new SearchGymsUseCase(gymsRepository)
  })

  it('should be able to search for gyms', async () => {
    await gymsRepository.create({
      name: 'Alpha Gym',
      latitude: 0,
      longitude: 0,
    })

    await gymsRepository.create({
      name: 'Beta Gym',
      latitude: 0,
      longitude: 0,
    })

    const { gyms } = await sut.execute({
      query: 'Alpha',
      page: 1,
    })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([expect.objectContaining({ name: 'Alpha Gym' })])
  })

  it('should be able to fetch paginated gyms search', async () => {
    for (let i = 1; i <= 22; i++) {
      await gymsRepository.create({
        name: `Gym ${i}`,
        latitude: 0,
        longitude: 0,
      })
    }

    const { gyms } = await sut.execute({
      query: 'Gym',
      page: 2,
    })

    expect(gyms).toHaveLength(2)
    expect(gyms).toEqual([
      expect.objectContaining({ name: 'Gym 21' }),
      expect.objectContaining({ name: 'Gym 22' }),
    ])
  })

  it('should not be able to search for gyms with wrong name', async () => {
    const { gyms } = await sut.execute({
      query: 'non-exists-name',
      page: 1,
    })

    expect(gyms).toHaveLength(0)
  })
})
