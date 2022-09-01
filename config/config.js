const port =  process.env.PORT || 3000
const host = process.env.HOST || `http://localhost:${port}`

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
