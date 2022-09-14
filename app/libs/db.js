module.exports = require('knex')({
    client: 'mysql2',
    connection: __config.connections.mysql,
    log: {
        warn(message) {},
        deprecate(message) {},
        debug(message) {},
    },
    // migrations: {
    //     tableName: 'migrations'
    // },
})