import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { ZodTypeProvider } from 'fastify-type-provider-zod'

import { verifyJWT } from '@/http/middlewares/verify-jwt'
import { register, registerBodySchema } from './register'
import { authenticate, authenticateBodySchema } from './authenticate'
import { profile } from './profile'

export async function usersRoutes(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/users',
    {
      schema: {
        summary: 'Register a user',
        tags: ['Users'],
        body: registerBodySchema,
        response: {
          201: z.object({
            userId: z.string().uuid(),
          }),
        },
      },
    },
    register,
  )
  app.withTypeProvider<ZodTypeProvider>().post(
    '/sessions',
    {
      schema: {
        summary: 'Authenticate a user',
        tags: ['Users'],
        body: authenticateBodySchema,
        response: {
          200: z.object({
            token: z.string(),
          }),
        },
      },
    },
    authenticate,
  )

  /** Authenticated */
  app.withTypeProvider<ZodTypeProvider>().get(
    '/me',
    {
      onRequest: [verifyJWT],
      schema: {
        summary: 'Get user profile',
        tags: ['Users'],
        response: {
          200: z.object({
            id: z.string().uuid(),
            name: z.string(),
            email: z.string().email(),
            role: z.enum(['ADMIN', 'MEMBER']).default('MEMBER'),
            created_at: z.date(),
          }),
        },
      },
    },
    profile,
  )
}
