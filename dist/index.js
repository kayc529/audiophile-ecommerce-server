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
require('dotenv').config();
require('express-async-errors');
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
// //custom middleware
const not_found_1 = __importDefault(require("./middleware/not-found"));
const error_handler_1 = __importDefault(require("./middleware/error-handler"));
//router
const authRoutes_1 = __importDefault(require("./routers/authRoutes"));
const productRoutes_1 = __importDefault(require("./routers/productRoutes"));
// //db
const connect_1 = __importDefault(require("./db/connect"));
// //packages
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const helmet_1 = __importDefault(require("helmet"));
const xss_clean_1 = __importDefault(require("xss-clean"));
// //cors
const cors = require('cors');
const corsOptions = {
    origin: true,
    credentials: true,
};
const mongoSanitize = require('express-mongo-sanitize');
// //middleware
app.use((0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 60,
}));
app.use((0, helmet_1.default)());
app.use(cors(corsOptions));
app.use((0, xss_clean_1.default)());
app.use(mongoSanitize());
app.use(express_1.default.json());
app.use(express_1.default.static('./public'));
app.use(express_1.default.static(path_1.default.join(__dirname, '/client/build')));
//routes
app.use('/api/v1/auth', authRoutes_1.default);
app.use('/api/v1/product', productRoutes_1.default);
//not found
app.use(not_found_1.default);
//error handler
app.use(error_handler_1.default);
const port = process.env.PORT || 5000;
const start = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, connect_1.default)(process.env.DB_URL);
        app.listen(port, () => {
            console.log(`Server is listening on port ${port}...`);
        });
    }
    catch (error) {
        console.log(error);
    }
});
start();
