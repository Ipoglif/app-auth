const db = require('../libs/db')
const { app } = require('../../app')
const request = require('supertest')

describe('Test auth methods', () => {
    it('Should test', async () => {
        const check = await request(app)
            .post('/api/login')
            .send({
                email: 'admin',
                password: 'admin'
            })
        expect(check.statusCode).toEqual(200)
        app.close()

    })
})