import { dbConnection } from '../sequelize_db';

const Sequelize = require('sequelize');
export class UserSpotify extends Sequelize.Model {

}
UserSpotify.init({
    userId: { type: Sequelize.INTEGER, allowNull: false, defaultValue: -1 },
    dateTime: { type: Sequelize.STRING, allowNull: false, defaultValue: '' },
    episodeId: { type: Sequelize.STRING, allowNull: false, defaultValue: '' },
    trackId: { type: Sequelize.STRING, allowNull: false, defaultValue: '' },
    playbackRepeatState: { type: Sequelize.STRING, allowNull: false, defaultValue: '' },
    playbackContextUri: { type: Sequelize.STRING, allowNull: false, defaultValue: '' },
    playbackCurrentlyPlayingType: { type: Sequelize.STRING, allowNull: false, defaultValue: '' },
    playbackRepeatState: { type: Sequelize.STRING, allowNull: false, defaultValue: '' },
    playbackShuffleState: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
    playbackProgress: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
    deviceVolumePercent: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
    playbackTimeStamp: { type: Sequelize.BIGINT, allowNull: false, defaultValue: 0 },
    deviceIsActive: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
    deviceType: { type: Sequelize.STRING, allowNull: false, defaultValue: '' },
}, {
    sequelize: dbConnection,
    modelName: 'user_spotify',
});
UserSpotify.Helpers = {

    hasDraft: () => { return false; },
    public: (doc) => {
        // doc = doc.dataValues;
        return doc;
    },
}