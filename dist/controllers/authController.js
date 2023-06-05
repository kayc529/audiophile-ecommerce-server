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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUser = exports.getUserInfo = exports.logout = exports.login = exports.register = void 0;
const User_1 = require("../models/User");
const http_status_codes_1 = require("http-status-codes");
const createTokenUser_1 = require("../utils/createTokenUser");
const crypto_1 = __importDefault(require("crypto"));
const jwt_1 = require("../utils/jwt");
const error_1 = require("../error");
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { firstName, lastName, email, password, phoneNumber } = req.body;
    const existingUser = yield User_1.User.findOne({ email });
    if (existingUser) {
        throw new error_1.BadRequestError('User already registered');
    }
    const user = yield User_1.User.create({
        firstName,
        lastName,
        email,
        password,
        phoneNumber,
    });
    //create token user
    const tokenUser = (0, createTokenUser_1.createTokenUser)(user);
    //generate refresh token
    const refreshToken = crypto_1.default.randomBytes(40).toString('hex');
    //attach cookie to response
    (0, jwt_1.attachCookieToResponse)({ res, user: tokenUser, refreshToken });
    res.status(http_status_codes_1.StatusCodes.CREATED).json({ success: true, user: tokenUser });
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const user = yield User_1.User.findOne({ email });
    if (!user) {
        throw new error_1.BadRequestError('Invalid crudentials');
    }
    const isPasswordCorrect = yield user.comparePasswords(password);
    if (!isPasswordCorrect) {
        throw new error_1.BadRequestError('Invalid crudentials');
    }
    const tokenUser = (0, createTokenUser_1.createTokenUser)(user);
    const refreshToken = crypto_1.default.randomBytes(40).toString('hex');
    (0, jwt_1.attachCookieToResponse)({ res, user: tokenUser, refreshToken });
    res.status(http_status_codes_1.StatusCodes.CREATED).json({ success: true, user: tokenUser });
});
exports.login = login;
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.cookie('accessToken', '', {
        httpOnly: true,
        signed: true,
        maxAge: -1,
    });
    res.cookie('refreshToken', '', {
        httpOnly: true,
        signed: true,
        maxAge: -1,
    });
    res.status(http_status_codes_1.StatusCodes.OK).json({ success: true });
});
exports.logout = logout;
const getUserInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () { });
exports.getUserInfo = getUserInfo;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userInfo = req.body;
    //get this user object from authenication middleware
    const user = req.user;
    const updatedUser = yield User_1.User.findOneAndUpdate({ _id: user._id }, userInfo, {
        new: true,
        runValidators: true,
    });
    res.status(http_status_codes_1.StatusCodes.OK).json({ success: true });
});
exports.updateUser = updateUser;
