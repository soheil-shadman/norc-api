import { dbConnection } from '../sequelize_db';

const Sequelize = require('sequelize');
export class UserMusic extends Sequelize.Model {

}
UserMusic.init({
    userId: { type: Sequelize.INTEGER, allowNull: false, defaultValue: -1 },
    name: { type: Sequelize.STRING, allowNull: false, defaultValue: '' },
}, {
    sequelize: dbConnection,
    modelName: 'user_log',
});
UserMusic.Helpers = {

    hasDraft: () => { return false; },
    public: (doc) => {
        // doc = doc.dataValues;
        return doc;
    },
}