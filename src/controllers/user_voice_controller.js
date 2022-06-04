import { Controller } from "./controller";
import { CONFIG } from "../config";
import { isEmptyString } from "../utils/utils";
import { API_MODULES } from "../api_modules";
import { Console } from "console";
const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
export default class UserVoiceController extends Controller {
    constructor(socketEvents) {
        super(socketEvents);
        this.expressRouter.post('/create-user-voice', async (req, res) => {
            try {
                if (!req.api.hasUser() && !req.api.isSystem()) {
                    res.sendError('access denied', 401);
                    return;
                }
                if (isEmptyString(req.body.name)) {
                    res.sendError('invalid parameters user-voice file');
                    return;
                }
                if(req.body.name.includes('-')){
                    res.sendError('invalid naming for name');
                    return;
                }
                if (req.files.myFile == undefined) {
                    res.sendError('file is missing');
                    return;
                }
                if (isEmptyString(req.body.sessionId) || isEmptyString(req.body.sequenceId)) {
                    res.sendError('invalid parameters');
                    return;
                }
                let sessionIdInt = parseInt(req.body.sessionId);
                let sequenceIdInt = parseInt(req.body.sequenceId);
                if(sequenceIdInt==undefined||sessionIdInt==undefined){
                    res.sendError('invalid parameters int to string');
                    return;
                }
                let redundadntData = await API_MODULES.UserVoice.findAll({
                    where: {
                        [Sequelize.Op.or]: [
                            {
                                userId: {
                                    [Sequelize.Op.eq]:req.api.user.id,
                                },
                                sessionId: {
                                    [Sequelize.Op.eq]: sessionIdInt,
                                },
                                sequenceId: {
                                    [Sequelize.Op.eq]: sequenceIdInt,
                                }
                            }
                        ]
                    }
                });
                if(redundadntData.length!=0){
                    res.sendError(`SequenceId ${sequenceIdInt} for Session :${sessionIdInt} already exist`);
                    return;
                }

                if (!fs.existsSync('storage/'))
                    fs.mkdirSync('storage');
                if (!fs.existsSync(`storage/user-voice/`))
                    fs.mkdirSync(`storage/user-voice/`);
                const f = req.files.myFile;
                const fileFormat = f.name.substring(f.name.lastIndexOf('.'), f.name.length);
                const filePath = `storage/user-voice/${req.body.name}-${req.api.user.id}-${req.body.sessionId}-${req.body.sequenceId}-${Date.now()}` + fileFormat;
                f.mv(filePath, async (err) => {
                    if (err) {
                        res.sendError(err.toString());
                        return;
                    }

                    let userVoice = API_MODULES.UserVoice.build({
                        userId: req.api.user.id,
                        name: req.body.name,
                        sessionId: req.body.sessionId,
                        sequenceId: req.body.sequenceId,
                        mood: req.body.mood,
                        path: filePath
                    });

                    await userVoice.save();


                    res.sendResponse({
                        userVoice: userVoice,

                    });
                });
            }
            catch (err) {
                res.sendError(err);
            }
        });
        // this.expressRouter.get('/search-music-name', async (req, res) => {
        //     try {

        //         let search = req.query.search;
        //         if (isEmptyString(search)) {
        //             res.sendError('invalid parameters');
        //             return;
        //         }

        //         let music = await API_MODULES.MusicData.findAll({
        //             where: {
        //                 [Sequelize.Op.or]: [
        //                     {
        //                         name: {
        //                             [Sequelize.Op.like]: `%${search}%`,
        //                         }
        //                     }
        //                 ]
        //             }
        //         });
        //         if(music==undefined){
        //             res.sendError('no music found');
        //             return;
        //         }




        //         res.sendResponse({
        //             music
        //         })
        //     }
        //     catch (err) {
        //         res.sendError(err.error);
        //     }
        // });
        // this.expressRouter.get('/search-music-whole-id', async (req, res) => {
        //     try {


        //         if (isEmptyString(req.query.id)) {
        //             res.sendError('invalid parameters');
        //             return;
        //         }
        //         let id = parseInt(req.query.id);
        //         let music = await API_MODULES.MusicData.findByPk(id);
        //         if(music==undefined){
        //             res.sendError('no music found');
        //             return;
        //         }
        //         let musicMeta = await API_MODULES.MusicMetaData.findByPk(music.musicMetaDataId);
        //         res.sendResponse({
        //             music,
        //             musicMeta
        //         })
        //     }
        //     catch (err) {
        //         res.sendError(err.error);
        //     }
        // });
    }
}