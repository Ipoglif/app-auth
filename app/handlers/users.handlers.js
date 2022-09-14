const usersRepository = require('../repositories/users.repository')
const authRepository = require('../repositories/auth.repository')

async function me(req, res) {
    try {
        const [ empty, refreshToken ] = req.headers.cookie.split('=')

        await authRepository.search({refreshToken})
            .then( async ( {id} ) => {
                return res.json({
                    userData: await usersRepository.search({id})
                })
            })
    } catch (e) {
        console.error(e)
        return res.json({
            message: e
        })
    }
}

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
    me : me,
    showUsers : showUsers
}