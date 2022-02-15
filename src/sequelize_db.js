import { CONFIG } from "./config";
const Sequelize = require('sequelize');

export const dbConnection = new Sequelize(CONFIG.DB_URL);