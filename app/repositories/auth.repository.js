const { mysql } = require("../../config/config")

const db = require('knex')(mysql)

const TABLE_NAME = 'auth'

async function update(record, symbol) {
    await db(TABLE_NAME).update(record).where(symbol)
}

async function search(symbol) {
    const [result] = await db(TABLE_NAME).where(symbol)
    return result
}

async function insert(record) {
    await db(TABLE_NAME).insert(record)
}

module.exports = {
    insert: insert,
    update: update,
    search: search,
}