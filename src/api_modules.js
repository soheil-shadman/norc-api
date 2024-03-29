import { CONFIG } from './config.js';
import { User } from './models/user.js';
import { UserFile } from './models/user_file.js';
import { UserLog } from './models/user_log.js';
import { MusicData } from './models/music_data';
import { MobileSensor } from './models/mobile_sensor';
import { UserSpotify } from './models/user_spotify';
import { MusicMetaData } from './models/music_meta_data.js';
import { UserVoice } from './models/user_voice';
import { SpotifyStateData } from './models/spotify_state_data';
import { dbConnection } from './sequelize_db.js';
const fs = require('fs');
const path = require('path');

export const API_MODULES = {
    dbConnection: dbConnection,
    User,
    UserFile,
    UserLog,
    MusicData,
    MusicMetaData,
    MobileSensor,
    UserSpotify,
    UserVoice,
    SpotifyStateData
};