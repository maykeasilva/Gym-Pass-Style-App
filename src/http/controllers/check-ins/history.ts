import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { makeFetchUserCheckInsHistoryUseCase } from '@/use-cases/factories/make-fetch-user-check-ins-use-case'

export const checkInsHistoryQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
})

export async function history(request: FastifyRequest, reply: FastifyReply) {
  const { page } = checkInsHistoryQuerySchema.parse(request.query)

  const fetchUserCheckInsHistoryUseCase = makeFetchUserCheckInsHistoryUseCase()

  const { checkIns } = await fetchUserCheckInsHistoryUseCase.execute({
    userId: request.user.sub,
    page,
  })

  return reply.status(200).send({ checkIns })
}
