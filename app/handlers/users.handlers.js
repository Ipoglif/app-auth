const usersRepository = require('../repositories/users.repository')

async function showUsers(req, res) {
    try {
        const result = usersRepository.select()
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