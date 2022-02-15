import { User } from "./models/user";
import { UserFile } from "./models/user_file";
import { UserLog } from "./models/user_log";
import { UserMusic } from "./models/user_music";
import { dbConnection } from "./sequelize_db";
const Sequelize = require('sequelize');
dbConnection
    .authenticate()
    .then(async () => {
        console.log('connected!');
        await User.sync();
        await UserFile.sync();
        await UserLog.sync();
        await UserMusic.sync();
        console.log('done');
    })
    .catch(err => {
        console.log(err);
    });
