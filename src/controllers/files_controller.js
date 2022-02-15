import { Controller } from "./controller";
import { CONFIG } from "../config";
import { isEmptyString } from "../utils/utils";
import { API_MODULES } from "../api_modules";
const fs = require('fs');
const path = require('path');
export default class FilesController extends Controller {
    constructor(socketEvents) {
        super(socketEvents);
        this.expressRouter.post('/upload', async (req, res) => {
            try {
                if (!req.api.hasUser()) {
                    res.sendUserMissing();
                    return;
                }
                if (isEmptyString(req.body.name)
                    || isEmptyString(req.body.startDate)
                    || isEmptyString(req.body.endDate)
                    || isEmptyString(req.body.type)) {
                    res.sendError('invalid parameters');
                    return;
                }
                if (!fs.existsSync('storage/'))
                    fs.mkdirSync('storage');
                if (!fs.existsSync(`storage/user-${req.api.user.id}/`))
                    fs.mkdirSync(`storage/user-${req.api.user.id}/`);
                const f = req.files.myFile;
                const fileFormat = f.name.substring(f.name.lastIndexOf('.'), f.name.length);
                const filePath = `storage/user-${req.api.user.id}/${req.body.name}-${Date.now()}` + fileFormat;
                f.mv(filePath, async (err) => {
                    if (err) {
                        res.sendError(err.toString());
                        return;
                    }
                    let userFile = API_MODULES.UserFile.build({
                        name: req.body.name,
                        startDate: req.body.startDate,
                        endDate: req.body.endDate,
                        type: req.body.type,
                        path: filePath,
                        userId: req.api.user.id,
                    });
                    await userFile.save();
                    res.sendResponse({
                        file: userFile,
                    });
                });
            }
            catch (err) {
                res.sendError(err);
            }
        });
    }
}