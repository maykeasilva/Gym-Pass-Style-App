import { CheckIn, Prisma } from '@prisma/client'
import { CheckInsRepository } from '../check-ins-repository'
import { randomUUID } from 'node:crypto'
import dayjs from 'dayjs'

export class InMemoryCheckInsRepository implements CheckInsRepository {
  public database: CheckIn[] = []

  async countByUserId(userId: string) {
    const checkIns = this.database.filter(
      (items) => items.user_id === userId,
    ).length

    return checkIns
  }

  async findById(id: string) {
    const checkIn = this.database.find((item) => item.id === id)

    if (!checkIn) {
      return null
    }

    return checkIn
  }

  async findByUserIdOnDate(userId: string, date: Date) {
    const startOfTheDay = dayjs(date).startOf('date')
    const endOfTheDay = dayjs(date).endOf('date')

    const checkInOnSameDay = this.database.find((checkIn) => {
      const checkInDate = dayjs(checkIn.created_at)
      const isOnSameDate =
        checkInDate.isAfter(startOfTheDay) && checkInDate.isBefore(endOfTheDay)

      return checkIn.user_id === userId && isOnSameDate
    })

    if (!checkInOnSameDay) {
      return null
    }

    return checkInOnSameDay
  }

  async findManyByUserId(userId: string, page: number) {
    const checkIns = this.database
      .filter((item) => item.user_id === userId)
      .slice((page - 1) * 20, page * 20)

    return checkIns
  }

  async create(data: Prisma.CheckInUncheckedCreateInput) {
    const checkIn = {
      id: data.id ?? randomUUID(),
      user_id: data.user_id,
      gym_id: data.gym_id,
      validated_at: data.validated_at ? new Date(data.validated_at) : null,
      created_at: new Date(),
    }

    this.database.push(checkIn)

    return checkIn
  }

  async save(checkIn: CheckIn) {
    const checkInIndex = this.database.findIndex(
      (item) => item.id === checkIn.id,
    )

    if (checkInIndex >= 0) {
      this.database[checkInIndex] = checkIn
    }

    return checkIn
  }
}
