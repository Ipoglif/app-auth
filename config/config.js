const port =  process.env.PORT || 3000
const host = process.env.HOST || `http://localhost:${port}`

module.exports = {
    mysql: {
        client: 'mysql2',
        connection: {
            host: '185.219.43.14',
            port: 3306,
            user: 'test-user',
            password: 'zE5bU4gU5u',
            database: 'db-blog'
        }
    },
    ftp: {
        host: '185.219.43.43',
        port: 21,
        user: 'testblog',
        password: 'hX9nA5lI2c'
    },
    swagger: {
        definition: {
            openapi: '3.0.0',
            info: {
                title: 'Blog API',
                version: '1.0.0'
            },
            servers: [{
                url: host
            }]
        },
        apis: ['app/swagger.js']
    },
    secret: 'SERVER_SECRET_KEY',
    port,host
}
