import { dbConnection } from '../sequelize_db';

const Sequelize = require('sequelize');
export class MusicMetaData extends Sequelize.Model {

}
MusicMetaData.init({
    userId: { type: Sequelize.INTEGER, allowNull: false, defaultValue: -1 },
    musicId: { type: Sequelize.INTEGER, allowNull: false, defaultValue: -1 },
    sessionId: { type: Sequelize.STRING, allowNull: false, defaultValue: '' },
    buffered: { type: Sequelize.STRING, allowNull: false, defaultValue: '' },
    muted: { type: Sequelize.STRING, allowNull: false, defaultValue: '' },
    position: { type: Sequelize.STRING, allowNull: false, defaultValue: '' },
    state: { type: Sequelize.STRING, allowNull: false, defaultValue: '' },
    volume: { type: Sequelize.STRING, allowNull: false, defaultValue: '' },
    playlistCount: { type: Sequelize.STRING, allowNull: false, defaultValue: '0' },
    repeatMode: { type: Sequelize.STRING, allowNull: false, defaultValue: '' },
    shuffleMode: { type: Sequelize.STRING, allowNull: false, defaultValue: '' },
    year: { type: Sequelize.INTEGER, allowNull: false, defaultValue: -1 },
    title: { type: Sequelize.STRING, allowNull: false, defaultValue: '' },
    artist: { type: Sequelize.STRING, allowNull: false, defaultValue: '' },
    album: { type: Sequelize.STRING, allowNull: false, defaultValue: '' },
    genre: { type: Sequelize.STRING, allowNull: false, defaultValue: '' },
    bitrate: { type: Sequelize.STRING, allowNull: false, defaultValue: '' },
    energy: { type: Sequelize.STRING, allowNull: false, defaultValue: '' },
    valence: { type: Sequelize.STRING, allowNull: false, defaultValue: '' }
   
}, {
    sequelize: dbConnection,
    modelName: 'music_meta_data',
});
MusicMetaData.Helpers = {

    hasDraft: () => { return false; },
    public: (doc) => {
        // doc = doc.dataValues;
        return doc;
    },
}