const usersRepository = require('../repositories/users.repository')
const authRepository = require('../repositories/auth.repository')

async function me(req, res) {
    try {
        const { refreshToken } = req.session

        await authRepository.search({refreshToken})
            .then( async ( {id} ) => {
                const userData = await usersRepository.search({user_id: id})
                return res.json({userData})
            })
    } catch (e) {
        console.error(e)
        return res.status(500).json({message: e})
    }
}

async function showUsers(req, res) {
    try {
        const result = await usersRepository.select()

        return res.json({
            allUsers : result
        })
    } catch (e) {
        console.error(e)
        return res.status(500).json({message: e})
    }
}

module.exports = {
    me : me,
    showUsers : showUsers
}