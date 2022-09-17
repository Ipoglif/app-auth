const port =  process.env.PORT || 3000
const host = process.env.HOST || `http://localhost:${port}`

module.exports = {
    api: {
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
    },
    connections: {
        mysql: {
            host: '141.8.192.193',
            port: 3306,
            user: 'a0717002_db-blog',
            password: 'eJ7pC8aJ9e',
            database: 'a0717002_db-blog'
        },
    },
    options: {
        cookie: {
            name: 'session',
            keys: ['key1'],
            maxAge: 60000,
            secure: true,
            httpOnly: true,
            sameSite: 'none',
            signed: false
        },
        cors: {
            origin: true,
            credentials: true
        },
    },
    port,host
}
