"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.attachCookieToResponse = exports.isTokenValid = exports.createJWT = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const createJWT = ({ payload }) => {
    const token = jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET);
};
exports.createJWT = createJWT;
const isTokenValid = (token) => {
    return jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
};
exports.isTokenValid = isTokenValid;
const attachCookieToResponse = ({ res, user, refreshToken }) => {
    const accessTokenJWT = (0, exports.createJWT)({ payload: { user } });
    const refreshTokenJWT = (0, exports.createJWT)({ payload: { user, refreshToken } });
    const oneDay = 1000 * 60 * 60 * 24;
    const oneMonth = oneDay * 30;
    res.cookie('accessToken', accessTokenJWT, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        signed: true,
        maxAge: oneDay,
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    });
    res.cookie('refreshToken', refreshTokenJWT, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        signed: true,
        maxAge: oneMonth,
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    });
};
exports.attachCookieToResponse = attachCookieToResponse;
