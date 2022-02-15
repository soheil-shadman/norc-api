import { dbConnection } from '../sequelize_db';

const Sequelize = require('sequelize');
export class UserLog extends Sequelize.Model {

}
UserLog.init({
    userId: { type: Sequelize.INTEGER, allowNull: false, defaultValue: -1 },
    action: { type: Sequelize.STRING, allowNull: false, defaultValue: '' },
}, {
    sequelize: dbConnection,
    modelName: 'user_log',
});
UserLog.Helpers = {

    hasDraft: () => { return false; },
    public: (doc) => {
        // doc = doc.dataValues;
        return doc;
    },
}