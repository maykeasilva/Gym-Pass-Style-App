import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'
import { MaxDistanceError } from '@/use-cases/errors/max-distance-error'
import { MaxNumberOfCheckInsError } from '@/use-cases/errors/max-number-of-check-ins-error'
import { makeCheckInUseCase } from '@/use-cases/factories/make-check-in-use-case'

export const createCheckInParamsSchema = z.object({
  gymId: z.string().uuid(),
})

export const createCheckInBodySchema = z.object({
  latitude: z.coerce.number().refine((value) => Math.abs(value) <= 90),
  longitude: z.coerce.number().refine((value) => Math.abs(value) <= 180),
})

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const { gymId } = createCheckInParamsSchema.parse(request.params)
  const { latitude, longitude } = createCheckInBodySchema.parse(request.body)

  try {
    const checkInUseCase = makeCheckInUseCase()

    const { checkIn } = await checkInUseCase.execute({
      userId: request.user.sub,
      gymId,
      userLatitude: latitude,
      userLongitude: longitude,
    })

    return reply.status(201).send({ checkInId: checkIn.id })
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: error.message })
    }

    if (
      error instanceof MaxNumberOfCheckInsError ||
      error instanceof MaxDistanceError
    ) {
      return reply.status(400).send({ message: error.message })
    }

    throw error
  }
}
