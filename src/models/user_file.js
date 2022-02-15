import { dbConnection } from '../sequelize_db';

const Sequelize = require('sequelize');
export class UserFile extends Sequelize.Model {

}
UserFile.init({
    userId: { type: Sequelize.INTEGER, allowNull: false, defaultValue: -1 },
    path: { type: Sequelize.STRING, allowNull: false, defaultValue: -1 },
    name: { type: Sequelize.STRING, allowNull: false, defaultValue: '' },
    type: { type: Sequelize.STRING, allowNull: false, defaultValue: '' },
    startDate: { type: Sequelize.STRING, allowNull: false, defaultValue: '' },
    endDate: { type: Sequelize.STRING, allowNull: false, defaultValue: '' },
}, {
    sequelize: dbConnection,
    modelName: 'user_file',
});
UserFile.Helpers = {

    hasDraft: () => { return false; },
    public: (doc) => {
        // doc = doc.dataValues;
        return doc;
    },
}