import { dbConnection } from '../sequelize_db';

const Sequelize = require('sequelize');
export class UserVoice extends Sequelize.Model {

}
UserVoice.init({
    userId: { type: Sequelize.INTEGER, allowNull: false, defaultValue: -1 },
    name: { type: Sequelize.STRING, allowNull: false, defaultValue: '' },
    sessionId: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
    sequenceId: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 1},
    mood: { type: Sequelize.ENUM("sad", "happy", "neutral","angry","nervous"), allowNull: false, defaultValue:'neutral' },
    path: { type: Sequelize.STRING, allowNull: false, defaultValue: '' },

}, {
    sequelize: dbConnection,
    modelName: 'user_voice',
});
UserVoice.Helpers = {

    hasDraft: () => { return false; },
    public: (doc) => {
        // doc = doc.dataValues;
        return doc;
    },
}