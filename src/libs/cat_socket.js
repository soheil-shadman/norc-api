import { EasySocket } from "./easy_socket.js";
import { isEmptyString } from "../utils/utils.js";
import { apiMiddleWare } from "../middlewares/api_middleware.js";
/*
    CatSocket is a wrapper around EasySocket designed to support 
    API format.It works well with handler classes or any other style of coding.
    Whoever's interested in api requests can listen to catSocketEvents.
*/
export class CatSocket
{
    constructor(httpServer, catSocketEvents = new CatSocketEvents(), )
    {
        this.easySocket = new EasySocket({
            httpServer: httpServer,
            originIsAllowed: (origin) => true,
            onSocketConnected: catSocketEvents._onSocketConnected,
            onSocketDisconnected: catSocketEvents._onSocketDisconnected,
            onMessage: (socket, str) =>
            {
                var msg = typeof (str) == 'object' ? str : JSON.parse(str);
                console.log(msg);
                if (msg.headers == undefined || isEmptyString(msg.method) || isEmptyString(msg.model))
                {
                    socket.send({ code: 400, error: 'access denied' });
                    return;
                }
                var req = msg;
                req.socket = socket;
                var res = {};
                res.req = req;
                res.status = (code) => { return res; };
                res.send = req.socket.send;
                req.socket.sendDataToRoom = (roomName, model, method, data, error = null, code = 200) =>
                {
                    req.socket.sendToRoom(roomName, {
                        requestId: -1,
                        model: model,
                        method: method,
                        code: code,
                        error: error,
                        _data: data,
                    });
                };
                req.socket.sendResponseToRoom = (roomName, model, method, data, code = 200) =>
                {
                    req.socket.sendDataToRoom(roomName, model, method, data, null, code);
                };
                req.socket.sendErrorToRoom = (roomName, model, method, error, code = 500) =>
                {
                    req.socket.sendDataToRoom(roomName, model, method, null, error, code);
                };
                // function applyMiddleware(i)
                // {
                //     if (i >= middleWares.length)
                //         return;
                //     middleWares[i](req, res, () =>
                //     {
                //         applyMiddleware(i + 1);
                //     });
                // }
                // applyMiddleware(0);
                console.log(req);
                apiMiddleWare(req, res, () =>
                {
                    req.api.isHTTP = () => false;
                    req.api.isWS = () => true;
                    for (var i = 0; i < catSocketEvents._onMessages.length; i++)
                    {
                        var e = catSocketEvents._onMessages[i];
                        if (e.model == req.model && e.method == req.method)
                        {
                            if (res.dirty)
                            {
                                console.log('TWO OR MORE LISTENERS FOR ' + req.model + ':' + req.method);
                                return;
                            }
                            res.dirty = true;
                            e.callback(req, res);
                        }
                    }
                    if (!res.dirty)
                        res.sendError('invalid method or model', 404);
                });
            },
        })
    }

}
export class CatSocketEvents
{
    constructor()
    {
        this._onMessages = [];
        this._onConnects = [];
        this._onDisconnects = [];

        this._onSocketConnected = this._onSocketConnected.bind(this);
        this._onSocketDisconnected = this._onSocketDisconnected.bind(this);

        this.listenOnConnect = this.listenOnConnect.bind(this);
        this.listenOnDisconnect = this.listenOnDisconnect.bind(this);
        this.listenOnMessage = this.listenOnMessage.bind(this);
    }
    listenOnConnect(callback = (socket) => { })
    {
        this._onConnects.push(callback);
    }
    listenOnDisconnect(callback = (socket, code, reason) => { })
    {
        this._onDisconnects.push(callback);
    }
    listenOnMessage(model, method, callback = (req, res) => { })
    {
        this._onMessages.push({ method, model, callback: callback });
    }
    _onSocketConnected(socket)
    {
        for (var i = 0; i < this._onConnects.length; i++)
            this._onConnects[i](socket);
    }
    _onSocketDisconnected(socket, code, description)
    {
        for (var i = 0; i < this._onDisconnects.length; i++)
            this._onDisconnects[i](socket, code, description);
    }
}