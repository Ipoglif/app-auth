const db = require('../libs/db')
const { app } = require('../../app')
const request = require('supertest')

describe('Test status request methods', () => {
    it('Should registration', async () => {
        const check = await request(app)
            .post('/api/registration')
            .send({
                email: 'abc',
                password: 'abc'
            })
        expect(check.statusCode).toEqual(400)
    })

    it('Should login', async () => {
        const check = await request(app)
            .post('/api/login')
            .send({
                email: 'admin',
                password: 'admin'
            })
        expect(check.statusCode).toEqual(200)
    })

    it('Should logout', async () => {
        const check = await request(app)
            .get('/api/logout')
            .send()
            .set('Cookie', 'test')
        expect(check.statusCode).toEqual(200)
    })
})