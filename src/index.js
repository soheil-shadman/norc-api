import { MyExpress } from "./libs/my_express.js";
import { API_MODULES } from "./api_modules.js";
import { CatSocket, CatSocketEvents } from "./libs/cat_socket.js";
import { logMiddleWare } from "./middlewares/log_middleware.js";
import { apiMiddleWare } from "./middlewares/api_middleware.js";
import { userTokenMiddleware } from "./middlewares/user_token_middleware.js";
import { CONFIG } from "./config.js";
import { AuthController } from "./controllers/auth_controller.js";
import { ModelController } from "./controllers/model_controller";
import FilesController from "./controllers/files_controller.js";
const mongoose = require('mongoose');
const main = async () => {
    try {
        await API_MODULES.dbConnection.authenticate();
        //config express:
        const myExpress = new MyExpress({
            hasSessionEngine: false,
            mongoUrl: undefined,
            serveFiles: [
                { prefix: '/storage/', path: 'storage/' }
            ],
            hasFileUpload: true,
            cors: true,
        });
        const CAT_SOCKET_EVENTS = new CatSocketEvents();
        //express middlewares come here:
        myExpress.expressApp.use('/api/', logMiddleWare);
        myExpress.expressApp.use('/api/', apiMiddleWare);
        myExpress.expressApp.use('/api/', userTokenMiddleware);
        myExpress.expressApp.get('/', (req, res) => {
            res.send('NORC API.');
        });
        //controllers:
        myExpress.expressApp.use('/api/users/', new AuthController(CAT_SOCKET_EVENTS).expressRouter);
        myExpress.expressApp.use('/api/files/', new FilesController(CAT_SOCKET_EVENTS).expressRouter);
        // myExpress.expressApp.use('/api/shop/',new Shop)
        // model controllers
        const addModelController = (model, slug) => {
            myExpress.expressApp.use(`/api/${slug}/`, new ModelController(CAT_SOCKET_EVENTS, model, slug).expressRouter);
        };
        addModelController(API_MODULES.User, 'users');
        addModelController(API_MODULES.UserLog, 'logs');
        addModelController(API_MODULES.UserMusic, 'music');
        addModelController(API_MODULES.UserFile, 'files');

        //run http server,ws server:
        myExpress.http.listen(CONFIG.port, function () {
            console.log('http server running on port ' + CONFIG.port);
            const catSocket = new CatSocket(myExpress.http, CAT_SOCKET_EVENTS);
        });
    }
    catch (err) {
        console.log(`server crashed!`);
        console.log(err);
    }
};
main();