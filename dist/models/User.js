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
exports.User = exports.addressSchema = void 0;
const mongoose_1 = require("mongoose");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
exports.addressSchema = new mongoose_1.Schema({
    attn: {
        type: String,
        require: true,
    },
    unit: String,
    street: {
        type: String,
        require: true,
    },
    city: {
        type: String,
        require: true,
    },
    state: {
        type: String,
        require: true,
    },
    postalCode: {
        type: String,
        require: true,
    },
    country: {
        type: String,
        require: true,
    },
    phoneNumber: {
        type: String,
        require: true,
    },
    isDefault: {
        type: Boolean,
        default: false,
    },
});
// And a schema that knows about IUserMethods
const userSchema = new mongoose_1.Schema({
    firstName: {
        type: String,
        require: true,
    },
    lastName: {
        type: String,
        require: true,
    },
    email: {
        type: String,
        require: true,
    },
    password: {
        type: String,
        require: true,
    },
    phoneNumber: {
        type: String,
        require: true,
    },
    role: {
        type: String,
        require: true,
    },
    defaultAddress: {
        type: exports.addressSchema,
    },
});
userSchema.pre('save', function () {
    return __awaiter(this, void 0, void 0, function* () {
        if (!this.isModified('password')) {
            return;
        }
        const salt = yield bcryptjs_1.default.genSalt(10);
        this.password = yield bcryptjs_1.default.hash(this.password, salt);
    });
});
//COMPARE PASSWORD METHOD
userSchema.method('comparePasswords', function comparePasswords(enteredPassword) {
    return __awaiter(this, void 0, void 0, function* () {
        const isMatch = yield bcryptjs_1.default.compare(enteredPassword, this.password);
        return isMatch;
    });
});
exports.User = (0, mongoose_1.model)('User', userSchema);
