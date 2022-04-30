import { dbConnection } from '../sequelize_db';

const Sequelize = require('sequelize');
export class MusicData extends Sequelize.Model {

}
MusicData.init({
  
    name: { type: Sequelize.STRING, allowNull: false, defaultValue: '' },
    path: { type: Sequelize.STRING, allowNull: false, defaultValue: '' },
    thumbnail: { type: Sequelize.STRING, allowNull: false, defaultValue: 'https://img.icons8.com/windows/344/apple-music.png' },
    optionalData :{type:Sequelize.JSONB,allowNull:false,defaultValue:{}},
    musicMetaDataId:{type:Sequelize.INTEGER,allowNull:false,defaultValue:-1}

}, {
    sequelize: dbConnection,
    modelName: 'music_data',
});
MusicData.Helpers = {

    hasDraft: () => { return false; },
    public: (doc) => {
        // doc = doc.dataValues;
        return doc;
    },
}