import fastify from 'fastify'
import fastifyJwt from '@fastify/jwt'
import { ZodError } from 'zod'
import { env } from '@/env'
import { usersRoutes } from './controllers/users/routes'
import { gymsRoutes } from './controllers/gyms/routes'
import { checkInsRoutes } from './controllers/check-ins/routes'

export const app = fastify()

app.register(fastifyJwt, { secret: env.JWT_SECRET })

app.register(usersRoutes)
app.register(gymsRoutes)
app.register(checkInsRoutes)

app.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError) {
    return reply.status(400).send({
      message: 'Validation error.',
      issues: error.flatten().fieldErrors,
    })
  }

  if (env.NODE_ENV !== 'production') {
    console.log(error)
  } else {
    // Here we should log to an external tool like (DataDog, NewRelic, Sentry)
  }

  return reply.status(500).send({ message: 'Internal server error.' })
})
