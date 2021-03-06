'use strict';
const chai = require('chai')
const expect = chai.expect
const app = require('../../models')

describe('models/account', () => {

    describe('#register()', () => {

        beforeEach(async () => {
            this.Account = require('../../models').Account
            await this.Account.destroy({ truncate: {cascade: true}})
        })

        it('successfully creates an account', () => {
            return this.Account.register('username-test', 'test@email.com', 'Password!123')
                .then((account) => {
                    expect(account.username).to.equal('username-test')
                    expect(account.email).to.equal('test@email.com')
                    expect(account.password).to.not.equal('Password!123')
                }, (err) => {
                    throw err
                })
        })

        it('fails to create an account with a profane username', () => {
            return this.Account.register('fuck', 'test@email.com', 'Password!123')
                .then(account => {
                    throw new Error('was not supposed to succeed')
                }, err => {
                    expect(err.name).to.equal('ValidationError')
                    var errors = err.errors.map(subErr => { return { param: subErr.param, error: subErr.error } })
                    expect(errors).to.deep.include({param: 'username', error: 'ProfanityValidatorError'});
                })
        })

        it('fails to create an account with a username with an illegal char', () => {
            return this.Account.register('username(', 'test@email.com', 'Password!123')
                .then(account => {
                    throw new Error('was not supposed to succeed')
                }, err => {
                    expect(err.name).to.equal('ValidationError')
                    var errors = err.errors.map(subErr => { return { param: subErr.param, error: subErr.error } })
                    expect(errors).to.deep.include({param: 'username', error: 'CustomValidatorError'});
                })
        })

        it('fails to create an account with an invalid email', () => {
            return this.Account.register('username', 'test', 'Password!123')
                .then(account => {
                    throw new Error('was not supposed to succeed')
                }, err => {
                    expect(err.name).to.equal('ValidationError')
                    var errors = err.errors.map(subErr => { return { param: subErr.param, error: subErr.error } })
                    expect(errors).to.deep.include({param: 'email', error: 'EmailValidatorError'});
                })
        })

        it('fails to create an account with an invalid email', () => {
            return this.Account.register('username', 'test@email', 'Password!123')
                .then(account => {
                    throw new Error('was not supposed to succeed')
                }, err => {
                    expect(err.name).to.equal('ValidationError')
                    var errors = err.errors.map(subErr => { return { param: subErr.param, error: subErr.error } })
                    expect(errors).to.deep.include({param: 'email', error: 'EmailValidatorError'});
                })
        })

        it('fails to create an account with a password not containing a special character', () => {
            return this.Account.register('username', 'test@email.com', 'Password99')
                .then(account => {
                    throw new Error('was not supposed to succeed')
                }, err => {
                    expect(err.name).to.equal('ValidationError')
                    var errors = err.errors.map(subErr => { return { param: subErr.param, error: subErr.error } })
                    expect(errors).to.deep.include({param: 'password', error: 'CustomValidatorError'});
                })
        })

        it('fails to create an account with a password not containing a number', () => {
            return this.Account.register('username', 'test@email.com', 'Password$$$')
                .then(account => {
                    throw new Error('was not supposed to succeed')
                }, err => {
                    expect(err.name).to.equal('ValidationError')
                    var errors = err.errors.map(subErr => { return { param: subErr.param, error: subErr.error } })
                    expect(errors).to.deep.include({param: 'password', error: 'CustomValidatorError'});
                })
        })

        it('fails to create an account with a password not containing a letter', () => {
            return this.Account.register('username', 'test@email.com', '$$$$$$$$99')
                .then(account => {
                    throw new Error('was not supposed to succeed')
                }, err => {
                    expect(err.name).to.equal('ValidationError')
                    var errors = err.errors.map(subErr => { return { param: subErr.param, error: subErr.error } })
                    expect(errors).to.deep.include({param: 'password', error: 'CustomValidatorError'});
                })
        })

        it('fails to create an account with a duplicate username', async () => {
            try {
                await this.Account.register('userName', 'test@email.com', 'Password!123')
            } catch(err) {
                throw err
            }

            return this.Account.register('username', 'test2@email.com', 'Password!123')
                .then(account => {
                    throw new Error('Create was not supposed to succeed')
                }, err => {
                    expect(err.name).to.equal('ValidationError')
                    var errors = err.errors.map(subErr => { return { param: subErr.param, error: subErr.error } })
                    expect(errors).to.deep.include({param: 'username', error: 'UniqueValidatorError'});
                })
        })

        it('fails to create an account with a duplicate email', async () => {
            try{
                await this.Account.register('userName', 'test@email.com', 'Password!123')
            } catch(err) {
                throw err
            }

            return this.Account.register('username2', 'tesT@email.com', 'Password!123')
                .then(account => {
                    throw new Error('Create was not supposed to succeed')
                }, err => {
                    expect(err.name).to.equal('ValidationError')
                    var errors = err.errors.map(subErr => { return { param: subErr.param, error: subErr.error } })
                    expect(errors).to.deep.include({param: 'email', error: 'UniqueValidatorError'});
                })
        })

    })

    describe('#findByUsername()', () => {

        before(() => {
            return this.Account.destroy({ truncate: {cascade: true}})
        })

        it('succeeds in finding a user by username', async () => {
            try{
                await this.Account.register('userName', 'test@email.com', 'Password!123')
            } catch(err) {
                throw err
            }

            return this.Account.findByUsername('Username')
                .then(account => {
                    expect(account.username).to.eql('userName')
                    expect(account.password).to.not.be.ok
                }, err => {
                    throw err
                })
        })

        it('fails to find a non-existent user', () => {
            return this.Account.findByUsername('Username2')
                .then(account => {
                    expect(account).to.not.be.ok
                }, err => {
                    throw err
                })
        })
    })

    describe('#prototype.comparePassword()', () => {

        beforeEach(() => {
            return this.Account.destroy({ truncate: {cascade: true}})
        })

        it('succeeds with the right password', async () => {
            var account
            try{
                account = await this.Account.register('userName', 'test@email.com', 'Password!123')
            } catch(err) {
                throw err
            }

            return account.comparePassword('Password!123')
                .then(match => {
                    expect(match).to.be.true
                }, err => {
                    throw err
                })
        })

        it('fails with the wrong password', async () => {
            var account
            try{
                account = await this.Account.register('userName', 'test@email.com', 'Password!123')
            } catch(err) {
                throw err
            }

            return account.comparePassword('Password?123')
                .then(match => {
                    expect(match).to.be.false
                }, err => {
                    throw err
                })
        })
    })

    describe('#authenticate()', () => {

        beforeEach(() => {
            return this.Account.destroy({ truncate: {cascade: true}})
        })

        it('succeeds with the right password', async () => {
            var baseAccount
            try{
                baseAccount = await this.Account.register('userName', 'test@email.com', 'Password!123')
            } catch(err) {
                throw err
            }

            return this.Account.authenticate('Username', 'Password!123')
                .then(account => {
                    expect(account).to.be.ok
                    expect(account.username).to.eql('userName')
                    expect(account.username).to.eql(baseAccount.username)
                }, err => {
                    throw err
                })
        })

        it('fails with null with the wrong password', async () => {
            var baseAccount
            try{
                baseAccount = await this.Account.register('userName', 'test@email.com', 'Password!123')
            } catch(err) {
                throw err
            }

            return this.Account.authenticate('Username', 'Password?123')
                .then(account => {
                    expect(account).to.not.be.ok
                }, err => {
                    throw err
                })
        })

        it('fails with null with the wrong username', async () => {
            var baseAccount
            try{
                baseAccount = await this.Account.register('userName', 'test@email.com', 'Password!123')
            } catch(err) {
                throw err
            }

            return this.Account.authenticate('blah', 'Password!123')
                .then(account => {
                    expect(account).to.not.be.ok
                }, err => {
                    throw err
                })
        })

    })

    var user;
    describe('#prototype.setUser()', () => {

        beforeEach(async () => {
            await this.Account.destroy({ truncate: {cascade: true}})
            await require('../../models').User.destroy({ truncate: {cascade: true}})
            user = await require('../../models').User.addUser('username');
        })


        it('successfully creates an account with correct reference', async () => {
            let account = await this.Account.register('username-test', 'test@email.com', 'Password!123');
            await account.setUser(user);

            return this.Account.findByUsername('username-test')
                .then(account => {
                    expect(account.userUuid).to.eql(user.uuid);
                }, err => {
                    throw err
                })
        });

        it('successfully deletes itself when referenced table deletes its column', async () => {
            let account = await this.Account.register('username-test', 'test@email.com', 'Password!123');
            await account.setUser(user);

            await require('../../models').User.destroy({ where: { username: 'username' } })
            return this.Account.findByUsername('username-test')
                .then(account => {
                    expect(account).to.not.be.ok;
                });
        });
    })
})
