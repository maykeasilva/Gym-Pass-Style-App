import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { ZodTypeProvider } from 'fastify-type-provider-zod'

import { verifyJWT } from '@/http/middlewares/verify-jwt'
import { verifyUserRole } from '@/http/middlewares/verify-user-role'
import { create, createGymBodySchema } from './create'
import { search, searchGymsQuerySchema } from './search'
import { nearby, nearbyGymsQuerySchema } from './nearby'

const arrayGymsSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string().nullable(),
  phone: z.string().nullable(),
  latitude: z.coerce.number().refine((value) => Math.abs(value) <= 90),
  longitude: z.coerce.number().refine((value) => Math.abs(value) <= 180),
})

export async function gymsRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJWT)

  /** Authenticated */
  app.withTypeProvider<ZodTypeProvider>().post(
    '/gyms',
    {
      onRequest: [verifyUserRole('ADMIN')],
      schema: {
        summary: 'Create a gym',
        tags: ['Gyms'],
        body: createGymBodySchema,
        response: {
          201: z.object({
            gymId: z.string().uuid(),
          }),
        },
      },
    },
    create,
  )

  app.withTypeProvider<ZodTypeProvider>().get(
    '/gyms/search',
    {
      schema: {
        summary: 'Search gyms',
        tags: ['Gyms'],
        querystring: searchGymsQuerySchema,
        response: {
          200: z.object({
            gyms: z.array(arrayGymsSchema),
          }),
        },
      },
    },
    search,
  )
  app.withTypeProvider<ZodTypeProvider>().get(
    '/gyms/nearby',
    {
      schema: {
        summary: 'Search nearby gyms',
        tags: ['Gyms'],
        querystring: nearbyGymsQuerySchema,
        response: {
          200: z.object({
            gyms: z.array(arrayGymsSchema),
          }),
        },
      },
    },
    nearby,
  )
}
