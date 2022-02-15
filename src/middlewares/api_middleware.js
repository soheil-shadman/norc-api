
import express from "express";
import { CONFIG } from "../config.js";
export const apiMiddleWare = (req, res, next) =>
{
  //check api token
  if (req.headers["api-token"] != CONFIG.API_TOKEN)
  {
    res.send({ code: 400, error: "access denied", _data: null });
    return;
  }
  //setup api field and helper functions:
  if (req.api == undefined)
  {
    req.api = {
      isHTTP: () => true,
      isWS: () => false,
    };
  }
  req.api.isSystem = () => req.headers["system-token"] != undefined && req.headers["system-token"] == CONFIG.SYSTEM_TOKEN;
  res.sendResponse = (data, code = 200) =>
  {
    if (req.api.isHTTP())
    {
      res.status(code);
      res.send({
        code: code,
        error: null,
        _data: data
      });
    }
    else
    {
      res.send({
        requestId: req.requestId,
        model: req.model,
        method: req.method,
        code: code,
        error: null,
        _data: data,
      });
    }
  };
  res.sendError = function (error, code = 500)
  {
    console.log(error);
    // if (typeof error == "object" && !isCyclic(error))
    //   error = JSON.stringify(error);
    error = error == undefined || error == null ? "undefined" : error;
    error = error.toString();
    if (req.api.isHTTP())
    {
      res.status(code);
      res.send({
        code: code,
        error: error,
        _data: undefined
      });
    }
    else
    {
      res.send({
        requestId: req.requestId,
        model: req.model,
        method: req.method,
        code: code,
        error: error,
        _data: undefined,
      });
    }
  };
  res.sendAccessDenied = () => { res.sendError('access denied', 401); };
  next();
};
//   tokenMiddleWare(req, res, () =>
//   {
//     userMiddleWare(req, res, () =>
//     {
//       adminMiddleWare(req, res, () =>
//       {
//         req.api.hasAdminAccess = () => req.api.isSystem() || req.api.isAdmin();
//         res.sendResponse = (data, code = 200) =>
//         {
//           if (req.api.isHTTP())
//           {
//             res.status(code);
//             res.send({
//               code: code,
//               error: null,
//               _data: data
//             });
//           }
//           else
//           {
//             res.send({
//               requestId: req.requestId,
//               model: req.model,
//               method: req.method,
//               code: code,
//               error: null,
//               _data: data,
//             });
//           }
//         };
//         res.sendError = function (error, code = 500)
//         {
//           console.log(error);
//           // if (typeof error == "object" && !isCyclic(error))
//           //   error = JSON.stringify(error);
//           error = error == undefined || error == null ? "undefined" : error;
//           error = error.toString();
//           if (req.api.isHTTP())
//           {
//             res.status(code);
//             res.send({
//               code: code,
//               error: error,
//               _data: undefined
//             });
//           }
//           else
//           {
//             res.send({
//               requestId: req.requestId,
//               model: req.model,
//               method: req.method,
//               code: code,
//               error: error,
//               _data: undefined,
//             });
//           }
//         };
//         res.sendAccessDenied = () => { res.sendError('access denied', 400); };
//         res.sendUserMissing = () => { res.sendError('user-token is missing', 401); };

//         next();
//       });
//     });
//   });
// };
// const tokenMiddleWare = (req, res, next) =>
// {
//   if (req.headers["api-token"] != API_TOKEN)
//   {
//     res.send({ code: 400, error: "access denied", _data: null });
//     return;
//   }
//   req.api = {
//     isHTTP: () => true,
//     isWS: () => false,
//     hasAdminAccess: () => false,
//     isSystem: () =>
//       req.headers["system-token"] != undefined &&
//       req.headers["system-token"] == SYSTEM_TOKEN,
//     hasUser: () => false,
//     isAdmin: () => false,
//     hasAdmin: () => false,
//     user: undefined,
//     admin: undefined
//   };
//   next();
// };
// const userMiddleWare = async (req, res, next) =>
// {
//   if (req.headers["user-token"] != null)
//   {
//     try
//     {
//       var result = await User.Helpers.isValidToken(req.headers["user-token"]);
//       if (result.valid)
//       {
//         req.api.hasUser = () => true;
//         req.api.user = result.user;
//       }
//     } catch (err)
//     {
//       res.status(420).send({
//         code: 420,
//         error: 'invalid user-token',
//         _data: null
//       });
//       return;
//     }
//   }
//   next();
// };
// const adminMiddleWare = async (req, res, next) =>
// {
//   req.api.hasAdmin = () => false;
//   req.api.admin = undefined;
//   // if (req.headers["admin-token"] != null)
//   // {
//   //   try
//   //   {
//   //     var result = await User.Helpers.isValidToken(req.headers["admin-token"]);
//   //     if (result.valid && User.Helpers.isAdminAccessLevel(user.accessLevel))
//   //     {
//   //       req.api.hasAdmin = () => true;
//   //       req.api.admin = result.user;
//   //     }
//   //   } catch (err) { }
//   // }
//   next();
// };
// function isCyclic(obj)
// {
//   var seenObjects = [];

//   function detect(obj)
//   {
//     if (obj && typeof obj === "object")
//     {
//       if (seenObjects.indexOf(obj) !== -1)
//       {
//         return true;
//       }
//       seenObjects.push(obj);
//       for (var key in obj)
//       {
//         if (obj.hasOwnProperty(key) && detect(obj[key]))
//         {
//           console.log(obj, "cycle at " + key);
//           return true;
//         }
//       }
//     }
//     return false;
//   }

//   return detect(obj);
// }
