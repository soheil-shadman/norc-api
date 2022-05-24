import { Controller } from "./controller";
import { CONFIG } from "../config";
import { isEmptyString } from "../utils/utils";
import { API_MODULES } from "../api_modules";
const fs = require('fs');
const path = require('path');
export default class MusicDataController extends Controller {
    constructor(socketEvents) {
        super(socketEvents);
        this.expressRouter.post('/create-music-data', async (req, res) => {
            try {
                if (!req.api.hasUser()&&!req.api.isSystem()) {
                    res.sendError('access denied', 401);
                    return;
                }
                if (isEmptyString(req.body.name)) {
                    res.sendError('invalid parameters music file');
                    return;
                }
                if(req.files.myFile==undefined){
                    res.sendError('file is missing');
                    return;
                }
                if (isEmptyString(req.body.title)||isEmptyString(req.body.energy)||isEmptyString(req.body.valence)) {
                    res.sendError('invalid parameters music meta data');
                    return;
                }
               
                if (!fs.existsSync('storage/'))
                    fs.mkdirSync('storage');
                if (!fs.existsSync(`storage/musics/`))
                    fs.mkdirSync(`storage/musics/`);
                const f = req.files.myFile;
                const fileFormat = f.name.substring(f.name.lastIndexOf('.'), f.name.length);
                const filePath = `storage/musics/${req.body.name}-${Date.now()}` + fileFormat;
                f.mv(filePath, async (err) => {
                    if (err) {
                        res.sendError(err.toString());
                        return;
                    }
                    let musicMetaData = API_MODULES.MusicMetaData.build({
                        title: req.body.title,
                        valence:req.body.valence,
                        year:req.body.year,
                        bitrate:req.body.bitrate,
                        album:req.body.album,
                        genre:req.body.genre,
                        artist:req.body.artist,
                        energy:req.body.energy,
                        songImageURL:req.body.songImageURL,
                        albumImageURL:req.body.albumImageURL,
                        artistImageURL:req.body.artistImageURL,
                        genreImageURL:req.body.genreImageURL,
                        

                     
                    });
                    await musicMetaData.save();

                    let musicFile = API_MODULES.MusicData.build({
                        name: req.body.name,
                        path: filePath,
                        optionalData:req.body.optionalData,
                        musicMetaDataId:musicMetaData.id,
                        thumbnail:req.body.thumbnail,
                        musicUrl: req.body.musicUrl

                    });
                    await musicFile.save();
                    musicMetaData.musicId=musicFile.id;
                    await musicMetaData.save();

                    // Update
                    res.sendResponse({
                        musicFile: musicFile,
                        musicMetaData : musicMetaData
                    });
                });
            }
            catch (err) {
                res.sendError(err);
            }
        });
    }
}