import { dbConnection } from '../sequelize_db';

const Sequelize = require('sequelize');
export class SpotifyStateData extends Sequelize.Model {

}
SpotifyStateData.init({
  
    musicId: { type: Sequelize.INTEGER, allowNull: false, defaultValue: -1 },
    year: { type: Sequelize.INTEGER, allowNull: false, defaultValue: -1 },
    title: { type: Sequelize.STRING, allowNull: false, defaultValue: '' },
    artist: { type: Sequelize.STRING, allowNull: false, defaultValue: '' },
    mediaType: { type: Sequelize.STRING, allowNull: false, defaultValue: '' },
    year: { type: Sequelize.STRING, allowNull: false, defaultValue: '' },
    album: { type: Sequelize.STRING, allowNull: false, defaultValue: '' },
    duration: { type: Sequelize.STRING, allowNull: false, defaultValue: '0' },
    genre: { type: Sequelize.STRING, allowNull: false, defaultValue: '' },
    bitrate: { type: Sequelize.STRING, allowNull: false, defaultValue: '' },
    energy: { type: Sequelize.STRING, allowNull: false, defaultValue: '' },
    valence: { type: Sequelize.STRING, allowNull: false, defaultValue: '' },
    songImageURL: { type: Sequelize.STRING, allowNull: false, defaultValue: 'https://img.icons8.com/windows/344/apple-music.png' },
    albumImageURL: { type: Sequelize.STRING, allowNull: false, defaultValue: 'https://img.icons8.com/windows/344/apple-music.png' },
    artistImageURL: { type: Sequelize.STRING, allowNull: false, defaultValue: 'https://img.icons8.com/windows/344/apple-music.png' },
    genreImageURL: { type: Sequelize.STRING, allowNull: false, defaultValue: 'https://img.icons8.com/windows/344/apple-music.png' },
   
}, {
    sequelize: dbConnection,
    modelName: 'spotify_state_data',
});
SpotifyStateData.Helpers = {

    hasDraft: () => { return false; },
    public: (doc) => {
        // doc = doc.dataValues;
        return doc;
    },
}