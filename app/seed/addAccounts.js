exports.seed = function (knex) {
    return knex('auth').insert({
        email: 'testJest',
        password: 'testJest',
    })
}
