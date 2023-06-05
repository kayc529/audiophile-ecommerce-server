"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function notFoundMiddleware(req, res) {
    res.status(404).json({ msg: 'Route does not exist' });
}
exports.default = notFoundMiddleware;
