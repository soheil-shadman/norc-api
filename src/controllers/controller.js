import { CatSocketEvents } from "../libs/cat_socket.js";
var express = require('express')
export class Controller
{
    constructor(catSocketEvents = new CatSocketEvents())
    {
        this.catSocketEvents = catSocketEvents;
        this.expressRouter = express.Router();
    }
}