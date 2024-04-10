import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { app } from '@/http/app'

describe('Authenticate (e2e)', () => {
  beforeAll(async () => {
    app.ready()
  })

  afterAll(async () => {
    app.close()
  })

  it('should be able to authenticate', async () => {
    await request(app.server).post('/users').send({
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      password: '123456',
    })

    const response = await request(app.server).post('/sessions').send({
      email: 'johndoe@gmail.com',
      password: '123456',
    })

    expect(response.statusCode).toEqual(200)
    expect(response.body).toEqual({ token: expect.any(String) })
  })
})
