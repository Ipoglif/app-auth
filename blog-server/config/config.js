module.exports = {
    mysql: {
        client: 'mysql2',
        connection: {
            host: process.env.MYSQL_HOST || '127.0.0.1',
            port: process.env.MYSQL_PORT || 3307,
            user: process.env.MYSQL_USER || 'user',
            password: process.env.MYSQL_MYSQL_PASSWORD || '123456',
            database: process.env.MYSQL_MYSQL_DATABASE || 'db-blog'
        }
    },
    secret: 'SERVER_SECRET_KEY'
}