import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { app } from '@/http/app'
import { prisma } from '@/lib/prisma'
import { createAndAuthenticateUser } from '@/utils/tests/create-and-authenticate-user'

describe('Create Check-in (e2e)', () => {
  beforeAll(async () => {
    app.ready()
  })

  afterAll(async () => {
    app.close()
  })

  it('should be able to create check-in', async () => {
    const { token } = await createAndAuthenticateUser(app)

    const gym = await prisma.gym.create({
      data: {
        name: 'Alpha Gym',
        description: 'Description of the gym',
        phone: '32999110011',
        latitude: -20.9145873,
        longitude: -44.0732596,
      },
    })

    const response = await request(app.server)
      .post(`/gyms/${gym.id}/check-ins`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        latitude: -20.9145873,
        longitude: -44.0732596,
      })

    expect(response.statusCode).toEqual(201)
  })
})
