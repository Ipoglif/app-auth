const { mysql } = require("../../config/config")
const db = require('knex')(mysql)

async function showUsers(req, res) {
    try {
        const result = await db('accounts').select('*')
        return res.json({
            allUsers : result
        })
    } catch (e) {
        console.error(e)
        return res.json({
            message: e
        })
    }
}

module.exports = {
    showUsers : showUsers
}