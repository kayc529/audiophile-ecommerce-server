"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const error_1 = require("../error");
const jwt_1 = require("../utils/jwt");
const authenticateUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { accessToken, refreshToken } = req.signedCookies;
    try {
        //if access token is present in the cookie
        //meaning both access and refresh tokens haven't expired
        if (accessToken) {
            const payload = (0, jwt_1.isTokenValid)(accessToken);
            req.user = payload.user;
            return next();
        }
        //if access token is absent, get user from refreshToken
        const payload = (0, jwt_1.isTokenValid)(refreshToken);
        //attach an updated cookie to client
        //reset the expiry time for both access and refresh tokens whenever the client
        //makes an API call that requires authentication
        (0, jwt_1.attachCookieToResponse)({ res, user: payload.user, refreshToken });
        //add user to the req for controller
        req.user = payload.user;
        next();
    }
    catch (error) {
        console.log('authenticateUser:', error);
        throw new error_1.UnauthenticatedError('Invalid token');
    }
});
exports.default = authenticateUser;
