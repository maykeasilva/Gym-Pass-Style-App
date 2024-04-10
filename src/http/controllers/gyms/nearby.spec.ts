import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { app } from '@/http/app'
import { prisma } from '@/lib/prisma'
import { createAndAuthenticateUser } from '@/utils/tests/create-and-authenticate-user'

describe('Fetch Nearby Gyms (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to fetch nearby gyms', async () => {
    const { token } = await createAndAuthenticateUser(app)

    await prisma.gym.create({
      data: {
        name: 'Near Gym',
        description: 'Description of the gym',
        phone: '32999110011',
        latitude: -20.9145873,
        longitude: -44.0732596,
      },
    })

    await prisma.gym.create({
      data: {
        name: 'Far Gym',
        description: 'Description of the gym',
        phone: '32999220022',
        latitude: -21.101402,
        longitude: -44.2285656,
      },
    })

    const response = await request(app.server)
      .get('/gyms/nearby')
      .query({
        latitude: -20.9205444,
        longitude: -44.0712663,
      })
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body.gyms).toHaveLength(1)
    expect(response.body.gyms).toEqual([
      expect.objectContaining({ name: 'Near Gym' }),
    ])
  })
})
