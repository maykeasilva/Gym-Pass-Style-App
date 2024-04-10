import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { app } from '@/http/app'
import { createAndAuthenticateAdmin } from '@/utils/tests/create-and-authenticate-admin'

describe('Create Gym (e2e)', () => {
  beforeAll(async () => {
    app.ready()
  })

  afterAll(async () => {
    app.close()
  })

  it('should be able to create gym', async () => {
    const { token } = await createAndAuthenticateAdmin(app)

    const response = await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Alpha Gym',
        description: 'Description of the gym',
        phone: '32999110011',
        latitude: 0,
        longitude: 0,
      })

    expect(response.statusCode).toEqual(201)
  })
})
