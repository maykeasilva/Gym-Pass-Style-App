import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { ValidateCheckInUseCase } from './validate-check-in'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { LateCheckInValidationError } from './errors/late-check-in-validation-error'

let checkInsRepository: InMemoryCheckInsRepository
let sut: ValidateCheckInUseCase
describe('Validate Check-in Use Case', () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository()
    sut = new ValidateCheckInUseCase(checkInsRepository)

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to validate the check-in', async () => {
    const createCheckIn = await checkInsRepository.create({
      user_id: 'user-01',
      gym_id: 'gym-01',
    })

    const { checkIn } = await sut.execute({
      checkInId: createCheckIn.id,
    })

    expect(checkIn.validated_at).toEqual(expect.any(Date))
    expect(checkInsRepository.database[0].validated_at).toEqual(
      expect.any(Date),
    )
  })

  it('should not be able to validate the check-in after 20 minutes of its creation', async () => {
    await expect(() =>
      sut.execute({
        checkInId: 'non-exists-check-in-id',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to validate an inexistent check-in', async () => {
    vi.setSystemTime(new Date(2024, 0, 10, 8, 0, 0)) // 2024-01-10 08:00:00 UTC-3

    const createCheckIn = await checkInsRepository.create({
      user_id: 'user-01',
      gym_id: 'gym-01',
    })

    vi.advanceTimersByTime(1000 * 60 * 21) // Advancing 21 minutos

    await expect(() =>
      sut.execute({
        checkInId: createCheckIn.id,
      }),
    ).rejects.toBeInstanceOf(LateCheckInValidationError)
  })
})
