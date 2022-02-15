import { CONFIG } from "./config";
const mongoose = require('mongoose');
mongoose.connect(CONFIG.DB_URL, (err) => {
    if (err) {
        console.log(err);
        return;
    }
});