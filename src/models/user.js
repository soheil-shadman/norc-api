import { dbConnection } from '../sequelize_db.js';
import { base64_encode, decode_jwt_token, rot13_encode } from '../libs/encode.js';
const bcrypt = require('bcryptjs')
const Sequelize = require('sequelize');
export class User extends Sequelize.Model {
}
User.init({
    //user info:
    lastLogin: { type: Sequelize.STRING, allowNull: false, defaultValue: '' },
    accessTokens: { type: Sequelize.ARRAY(Sequelize.STRING), allowNull: false, defaultValue: [] },
    isAdmin: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
    username: { type: Sequelize.STRING, allowNull: false, defaultValue: '' },
    password: { type: Sequelize.STRING, allowNull: false, defaultValue: '' },
    email: { type: Sequelize.STRING, allowNull: false, defaultValue: '' },
    spotifyToken: { type: Sequelize.STRING, allowNull: true, defaultValue: null },
}, {
    sequelize: dbConnection,
    modelName: 'user',
});
User.Helpers = {
    ROLE_SUPER_ADMIN: 'admin',
    ROLE_TEACHER: 'teacher',
    hasDraft: () => { return false; },
    public: (doc) => {
        if (doc.dataValues)
            doc = doc.dataValues;
        delete (doc.accessTokens);
        delete (doc.password);
        delete (doc.email);
        delete (doc.phoneNumber);
        return doc;
    },
    isValidToken: (token) => {
        return new Promise((resolve, reject) => {
            User.findOne({
                where: {
                    accessTokens: {
                        [Sequelize.Op.contains]: [token],
                    }
                }
            }).then((user) => {
                if (user == null)
                    reject('invalid token');
                else {
                    var result = decode_jwt_token(token);
                    if (!result.valid)
                        reject('expired token');
                    else
                        resolve({ valid: true, user: user });
                }
            }).catch((err) => {
                reject(err);
            });
        });
    },
    hashPassword: (pass) => {
        return new Promise((resolve, reject) => {
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(pass, salt, (err, hash) => {
                    resolve(hash);
                });
            });
        });
    },
    checkPassword: (pass, hash) => {
        return new Promise((resolve, reject) => {
            // console.log(`pass and ${hash}`);
            bcrypt.compare(pass, hash, (err, same) => {
                if (err) {
                    resolve(false);
                    return;
                }
                resolve(same);
            });
        });
    }
}