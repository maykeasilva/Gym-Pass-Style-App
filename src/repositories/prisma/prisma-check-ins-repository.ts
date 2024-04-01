import { CheckInsRepository } from '../check-ins-repository'
import { CheckIn, Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import dayjs from 'dayjs'

export class PrismaCheckInsRepository implements CheckInsRepository {
  async countByUserId(userId: string) {
    const checkInsCount = await prisma.checkIn.count({
      where: {
        user_id: userId,
      },
    })

    return checkInsCount
  }

  async findById(id: string) {
    const checkIn = await prisma.checkIn.findUnique({
      where: {
        id,
      },
    })

    return checkIn
  }

  async findByUserIdOnDate(userId: string, date: Date) {
    const startOfTheDay = dayjs(date).startOf('date')
    const endOfTheDay = dayjs(date).endOf('date')

    const checkIns = await prisma.checkIn.findFirst({
      where: {
        user_id: userId,
        created_at: {
          gte: startOfTheDay.toDate(),
          lte: endOfTheDay.toDate(),
        },
      },
    })

    return checkIns
  }

  async findManyByUserId(userId: string, page: number) {
    const itemsPerPage = 20

    const checkIns = await prisma.checkIn.findMany({
      where: {
        user_id: userId,
      },
      take: itemsPerPage,
      skip: (page - 1) * itemsPerPage,
    })

    return checkIns
  }

  async create(data: Prisma.CheckInUncheckedCreateInput) {
    const checkIn = await prisma.checkIn.create({
      data,
    })

    return checkIn
  }

  async save(data: CheckIn) {
    const checkIn = await prisma.checkIn.update({
      where: {
        id: data.id,
      },
      data,
    })

    return checkIn
  }
}
