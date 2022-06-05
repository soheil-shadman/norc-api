import { isEmptyString } from "../utils/utils";
import { API_MODULES } from "../api_modules";
export const userTokenMiddleware = async (req, res, next) => {
    res.sendUserMissing = () => { res.sendError('user-token is missing', 401); };
    res.sendWrongUserToken = () => { res.sendError('invalid user-token', 403); };
    req.api.user = undefined;
    req.api.hasUser = () => false;
    //check if user-token even exists:
    let userToken = req.headers["user-token"];
    if (isEmptyString(userToken)) {
        next();
        return;
    }
    try {
        let result = await API_MODULES.User.Helpers.isValidToken(userToken);
        req.api.user = result.user;
        req.api.hasUser = () => true;
        let wasSystem = req.api.isSystem();
        req.api.isSystem = () => wasSystem || req.api.user.isAdmin;
        console.log("========================================")
        console.log(userToken)
        next();
    }
    catch (err) {
        console.log(err);
        res.sendWrongUserToken();
        // next();
    }
};