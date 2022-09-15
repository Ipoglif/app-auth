const db = require('../libs/db')

const TABLE_NAME = 'auth'

async function update(record, symbol) {
    const result = await db(TABLE_NAME).update(record).where(symbol)
    return result
}

async function search(symbol) {
    const [ result ] = await db(TABLE_NAME).where(symbol)
    return result
}

async function insert(record) {
    const [ id ] = await db(TABLE_NAME).insert(record)
    return id
}

module.exports = {
    insert: insert,
    update: update,
    search: search,
}