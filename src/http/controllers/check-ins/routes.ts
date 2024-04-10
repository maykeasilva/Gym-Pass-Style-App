import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { ZodTypeProvider } from 'fastify-type-provider-zod'

import { verifyJWT } from '@/http/middlewares/verify-jwt'
import { verifyUserRole } from '@/http/middlewares/verify-user-role'
import {
  create,
  createCheckInBodySchema,
  createCheckInParamsSchema,
} from './create'
import { checkInsHistoryQuerySchema, history } from './history'
import { metrics } from './metrics'
import { validate, validateCheckInParamsSchema } from './validate'

export async function checkInsRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJWT)

  /** Authenticated */
  app.withTypeProvider<ZodTypeProvider>().post(
    '/gyms/:gymId/check-ins',
    {
      schema: {
        summary: 'Create a check-in',
        tags: ['Check-ins'],
        params: createCheckInParamsSchema,
        body: createCheckInBodySchema,
        response: {
          201: z.object({
            checkInId: z.string().uuid(),
          }),
        },
      },
    },
    create,
  )

  app.withTypeProvider<ZodTypeProvider>().get(
    '/check-ins/history',
    {
      schema: {
        summary: 'Get user history',
        tags: ['Check-ins'],
        querystring: checkInsHistoryQuerySchema,
        response: {
          200: z.object({
            checkIns: z.array(
              z.object({
                id: z.string().uuid(),
                user_id: z.string().uuid(),
                gym_id: z.string().uuid(),
                created_at: z.date(),
                validated_at: z.date().nullable(),
              }),
            ),
          }),
        },
      },
    },
    history,
  )
  app.withTypeProvider<ZodTypeProvider>().get(
    '/check-ins/metrics',
    {
      schema: {
        summary: 'Get user metrics',
        tags: ['Check-ins'],
        response: {
          200: z.object({
            checkInsCount: z.coerce.number().int(),
          }),
        },
      },
    },
    metrics,
  )

  app.withTypeProvider<ZodTypeProvider>().patch(
    '/check-ins/:checkInId/validate',
    {
      onRequest: [verifyUserRole('ADMIN')],
      schema: {
        summary: 'Validate a check-in',
        tags: ['Check-ins'],
        params: validateCheckInParamsSchema,
        response: {
          204: z.object({}).strict(),
        },
      },
    },
    validate,
  )
}
