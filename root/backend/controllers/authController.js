const passport = require('passport')

const APIError = require('../utils/errorBuilder').APIError

// defines the strategy that calls the Account model functions
require('../services/auth.service')(passport)

module.exports = {
    authorizeAccount: function(req, res, next){
        let promise = new Promise((resolve, reject) => {
            passport.authenticate('local', (account, error, info) => {
                if(error) {
                    reject(error)
                }
                if(!account) {
                    error = new APIError({
                        title: 'Invalid credentials',
                        detail: 'Username and/or password are incorrect.'
                    })
                    reject(error)
                }

                //TODO: generate jwt, send back both account and jwt
                //TODO: if user verified, generate jwt
                resolve(account)
            })(req, res)
        })
            .then(account => {
                //TODO: change this to result because it will store both token
                //and account
                var accountJson = account.toJSON()
                delete accountJson.password
                res.status(201).json(accountJson)
            })
            .catch(error => {
                res.status(400).send(error)
            })
    }
}
