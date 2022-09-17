const usersRepository = require('../repositories/users.repository')
const authRepository = require('../repositories/auth.repository')
const {login} = require("./auth.handlers");

async function me(req, res) {
    try {
        const [ empty, refreshToken ] = req.headers.cookie.split('=')

        await authRepository.search({refreshToken})
            .then( async ( {id} ) => {
                const userData = await usersRepository.search({user_id : id})
                return res.json({userData})
            })
    } catch (e) {
        console.error(e)
        return res.json({message: e})
    }
}

async function showUsers(req, res) {
    try {
        const result = await usersRepository.select()

        console.log(req.user)

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