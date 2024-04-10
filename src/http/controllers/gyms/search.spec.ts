import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { app } from '@/http/app'
import { prisma } from '@/lib/prisma'
import { createAndAuthenticateUser } from '@/utils/tests/create-and-authenticate-user'

describe('Search Gyms (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to search gyms', async () => {
    const { token } = await createAndAuthenticateUser(app)

    await prisma.gym.create({
      data: {
        name: 'Alpha Gym',
        description: 'Description of the gym',
        phone: '32999110011',
        latitude: 0,
        longitude: 0,
      },
    })

    await prisma.gym.create({
      data: {
        name: 'Beta Gym',
        description: 'Description of the gym',
        phone: '32999220022',
        latitude: 0,
        longitude: 0,
      },
    })

    const response = await request(app.server)
      .get('/gyms/search')
      .query({
        query: 'Alpha',
      })
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body.gyms).toHaveLength(1)
    expect(response.body.gyms).toEqual([
      expect.objectContaining({ name: 'Alpha Gym' }),
    ])
  })
})
