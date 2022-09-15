const { connections } = require('../../config/config')

module.exports = require('knex')({
    client: 'mysql2',
    connection: connections.mysql,
    log: {
        warn(message) {},
        deprecate(message) {},
        debug(message) {},
    },
    // migrations: {
    //     tableName: 'migrations'
    // },
})