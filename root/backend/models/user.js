const Filter = require('bad-words');
const filter = new Filter();
const SchemaError = require('../utils/SchemaError');

module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        uuid: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                is: /^(?=.*[A-Za-z])[A-Za-z0-9d._-]{1,}$/,
                isNotProfane(value) {
                    if(filter.isProfane(value)) {
                        throw new Error('Inappropriate Username')
                    }
                }
            }
        }
    }, {});

    User.associate = function(models) {
    };

    User.addUser = function(username) {
        return new Promise((resolve, reject) => {
            User.create({
                username,
            })
                .then(user => {
                    return resolve(user);
                })
                .catch(err => {
                    if(SchemaError.isSchemaError(err)) return reject(new SchemaError(err));
                    return reject(err);
                })
        })
    };

    User.findByUsername = function(username) {
        return User.findOne({ where: {username: username} })
    }

    return User;
};
