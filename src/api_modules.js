import { CONFIG } from './config.js';
import { User } from './models/user.js';
import { UserFile } from './models/user_file.js';
import { UserLog } from './models/user_log.js';
import { UserMusic } from './models/user_music.js';
import { MobileSensor } from './models/mobile_sensor';
import { UserSpotify } from './models/user_spotify';
import { dbConnection } from './sequelize_db.js';
const fs = require('fs');
const path = require('path');

export const API_MODULES = {
    dbConnection: dbConnection,
    User,
    UserFile,
    UserLog,
    UserMusic,
    MobileSensor,
    UserSpotify
};