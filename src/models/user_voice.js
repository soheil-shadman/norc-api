import { dbConnection } from '../sequelize_db';

const Sequelize = require('sequelize');
export class UserVoice extends Sequelize.Model {

}
UserVoice.init({
    userId: { type: Sequelize.INTEGER, allowNull: false, defaultValue: -1 },
    dateTime: { type: Sequelize.STRING, allowNull: false, defaultValue: '' },
    sessionId: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
    sequenceId: { type: Sequelize.INTEGER, allowNull: false, defaultValue: '1' },
    lengeth: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
    sampleRate: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
    channelType: { type: Sequelize.STRING, allowNull: false, defaultValue: '' },
    encoding: { type: Sequelize.STRING, allowNull: false, defaultValue: '' },
    data: { type: Sequelize.STRING, allowNull: false, defaultValue: '' },

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