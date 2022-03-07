import { API_MODULES } from "../api_modules";
import { isEmptyString, moment_now } from "../utils/utils";
import { Controller } from "./controller";
import { create_jwt_token, decode_jwt_token } from "../libs/encode";
import { SchemaChecker } from '../utils/schema_utils';
import e from "express";
export class AuthController extends Controller {
    constructor(socketEvents) {
        super(socketEvents);
        this.expressRouter.post('/signup', async (req, res) => {
            try {
                let username = req.body.username;
                let password = req.body.password;
                let email = req.body.email;
                if (isEmptyString(username) || isEmptyString(password) || isEmptyString(email)) {
                    res.sendError('invalid parameters', 401);
                    return;
                }
                let oldUser = await API_MODULES.User.findOne({ where: { username } });
                if (oldUser != undefined) {
                    res.sendError('user already exists with this username');
                    return;
                }
                oldUser = await API_MODULES.User.findOne({ where: { email } });
                if (oldUser != undefined) {
                    res.sendError('user already exists with this email');
                    return;
                }
                let user = API_MODULES.User.build({
                    username,
                    password,
                    email,
                });
                await user.save();
                res.sendResponse({
                    user
                })
            } catch (err) {
                res.sendError(err);
            }
        });
        this.expressRouter.post('/login', async (req, res) => {
            try {
                let username = req.body.username;
                let email = req.body.email;
                let password = req.body.password;

                let userparam=true;
                let emailparam=true;
                if(isEmptyString(password)){
                    res.sendError('invalid parameters', 400);
                    return;
                }
                if (isEmptyString(username)) {
                    userparam=false
                  
                }
                if (isEmptyString(email)) {
                    emailparam=false
                  
                }
                if(!(emailparam||userparam)){
                    res.sendError('invalid parameters', 400);
                    return;
                }
                let user;
                if(userparam)
                 user = await API_MODULES.User.findOne({ where: { username } });
                 else
                 user = await API_MODULES.User.findOne({ where: { email } });

                if (user == undefined) {
                    res.sendError('user not found', 404);
                    return;
                }
                if (user.password != password) {
                    res.sendError('wrong password', 401);
                    return;
                }
                for (var i = user.accessTokens.length - 1; i > -1; i--) {
                    try {
                        var result = decode_jwt_token(user.accessTokens[i]);
                        if (!result.valid)
                            user.accessTokens.splice(i, 1);
                    }
                    catch (err) {
                        user.accessTokens.splice(i, 1);
                    }
                }
                user.accessTokens.push(create_jwt_token({ id: user.id }, '12h'));
                user.changed('accessTokens', true);
                if (user.accessTokens.length >= 5)
                    user.accessTokens.splice(0, 1);
                user.lastLogin = moment_now();
                await user.save();
                res.sendResponse({
                    user: user
                });
            }
            catch (err) {
                res.sendError(err);
            }
        });
        this.expressRouter.post('/edit-profile', async (req, res) => {
            try {
                if (!req.api.hasUser()) {
                    res.sendUserMissing();
                    return;
                }
                delete (req.body.isAdmin);
                await req.api.user.update(req.body);
                res.sendResponse({
                    user: req.api.user,
                })
            }
            catch (err) {
                res.sendError(err);
            }
        });
        this.expressRouter.post('/check-token', async (req, res) => {
            try {
                let token = req.body.token;
                if (isEmptyString(token)) {
                    res.sendError('bad parameters', 403);
                    return;
                }
                let result = await API_MODULES.User.Helpers.isValidToken(token);
                if (!result.valid) {
                    res.sendError('invalid user-token', 401);
                    return;
                }
                res.sendResponse(result.user);
            }
            catch (err) {
                res.sendError(err);
            }
        });
    }
}