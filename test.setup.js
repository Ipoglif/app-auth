
let t =  require('./config/test/config')
const db = require('knex')({
    client: 'mysql2',
    connection: {
        host: 'localhost',
        port: 3306,
        user: 'user',
        password: '123456',
        database: 'db-blog'
    }
})
const cleaner = require('knex-cleaner')

beforeAll( async () => {
    await cleaner.clean(db, {
        mode: 'truncate',
        restartIdentity: true,
    })
})

beforeEach( async () => {
    await db.seed.run({directory: './seed'})
})

afterEach( async () => {
    await cleaner.clean(db, {
        mode: 'truncate',
        restartIdentity: true,
    })
})

afterAll(() => {
    return db.destroy()
})