import { dbConnection } from '../sequelize_db';

const Sequelize = require('sequelize');
export class MusicMetaData extends Sequelize.Model {

}
MusicMetaData.init({
  
    musicId: { type: Sequelize.INTEGER, allowNull: false, defaultValue: -1 },
    year: { type: Sequelize.INTEGER, allowNull: false, defaultValue: -1 },
    title: { type: Sequelize.STRING, allowNull: false, defaultValue: '' },
    artist: { type: Sequelize.STRING, allowNull: false, defaultValue: '' },
    album: { type: Sequelize.STRING, allowNull: false, defaultValue: '' },
    genre: { type: Sequelize.STRING, allowNull: false, defaultValue: '' },
    bitrate: { type: Sequelize.STRING, allowNull: false, defaultValue: '' },
    energy: { type: Sequelize.STRING, allowNull: false, defaultValue: '' },
    valence: { type: Sequelize.STRING, allowNull: false, defaultValue: '' },

   
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