import request from 'supertest'
import { FastifyInstance } from 'fastify'
import { prisma } from '@/lib/prisma'
import { hash } from 'bcryptjs'

export async function createAndAuthenticateAdmin(app: FastifyInstance) {
  await prisma.user.create({
    data: {
      name: 'Admin',
      email: 'admin@example.com',
      password: await hash('admin123', 6),
      role: 'ADMIN',
    },
  })

  const authResponse = await request(app.server).post('/sessions').send({
    email: 'admin@example.com',
    password: 'admin123',
  })

  const { token } = authResponse.body

  return {
    token,
  }
}
