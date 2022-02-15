import express from 'express';
import session from 'express-session';
import cors from 'cors'
import morgan from 'morgan';
export class MyExpress
{
    constructor(settings = {
        hasSessionEngine: false,
        mongoUrl: undefined,
        serveFiles: undefined, //serveFiles is array of objects { prefix , path }
        hasFileUpload: true,
        cors: false,
    })
    {
        this.expressApp = express();
        this.http = require('http').Server(this.expressApp);
        //sessions:
        if (settings.hasSessionEngine)
        {
            const MongoStore = require('connect-mongo')(session);
            var sess = {
                secret: '0235notjustatroll65895',
                resave: false,
                saveUninitialized: true,
                cookie: { secure: false },
                store: new MongoStore({ url: settings.mongoUrl })
            };
            if (this.expressApp.get('env') === 'production')
            {
                this.expressApp.set('trust proxy', 1) // trust first proxy
                sess.cookie.secure = true // serve secure cookies
            }
            this.expressApp.use(session(sess));
        }
        //body-parser:
        const bodyParser = require('body-parser');
        // to support JSON-encoded bodies
        this.expressApp.use(bodyParser.json({
            limit: '50mb'
        }));
        // to support URL-encoded bodies
        this.expressApp.use(bodyParser.urlencoded({
            extended: true,
            limit: '50mb'
        }));
        //serve static files:
        if (settings.serveFiles != undefined)
        {
            if (typeof settings.serveFiles == 'string')
                this.expressApp.use(express.static(settings.serveFiles));
            else
            {
                for (var i = 0; i < settings.serveFiles.length; i++)
                {
                    if (typeof settings.serveFiles[i] == 'string')
                        this.expressApp.use(express.static(settings.serveFiles[i]));
                    else
                        this.expressApp.use(settings.serveFiles[i].prefix, express.static(settings.serveFiles[i].path));
                }
            }
        }
        //helper for file uploads:
        if (settings.hasFileUpload)
        {
            const fileUpload = require('express-fileupload');
            this.expressApp.use(fileUpload());
        }
        if (settings.cors)
        {
            this.expressApp.use(cors());
        }
        this.expressApp.use(morgan('tiny'));
    }
}