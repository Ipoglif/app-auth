const port =  process.env.PORT || 3000
const host = process.env.HOST || `http://localhost:${port}`

process.env.JWT_ACCESS_SECRET='SERVER_SECRET_KEY'
process.env.JWT_REFRESH_SECRET='SERVER_REFRESH_SECRET_KEY'

module.exports = {
    mysql: {
        client: 'mysql2',
        connection: {
            host: 'sql8.freemysqlhosting.net',
            port: 3306,
            user: 'sql8516569',
            password: 'u6Dfw5RN1r',
            database: 'sql8516569'
        }
    },
    ftp: {
        host: '185.219.43.43',
        port: 21,
        user: 'testblog',
        password: 'hX9nA5lI2c'
    },
    cookieOptions: {
        name: 'session',
        keys: ['key1'],
        maxAge: 60000,
        // secure: true,
        httpOnly: true,
        sameSite: 'none'
    },
    corsConfig: {
        origin: true,
        credentials: true
    },
    swagger: {
        definition: {
            openapi: '3.0.0',
            info: {
                title: 'Blog API',
                description: 'Blog API Methods',
                version: '1.0.1'
            },
            servers: [{
                url: host
            }]
        },
        apis: ['app/swagger.js']
    },
    port,host
}
