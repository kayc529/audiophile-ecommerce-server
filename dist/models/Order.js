"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const User_1 = require("./User");
const orderSchema = new mongoose_1.Schema({
    customerId: {
        type: mongoose_1.Schema.Types.ObjectId,
        require: true,
    },
    status: {
        type: String,
        enum: ['IN-PROGRESS', 'CANCELED', 'SHIPPED', 'DELIVERED'],
        default: 'IN-PROGRESS',
    },
    items: {
        type: [
            {
                productId: {
                    type: String,
                    require: true,
                },
                productCode: {
                    type: String,
                    require: true,
                },
                thumbnail: String,
                price: {
                    type: Number,
                    require: true,
                },
                quantity: {
                    type: Number,
                    require: true,
                },
            },
        ],
    },
    grandTotal: {
        type: Number,
        require: true,
    },
    subtotal: {
        type: Number,
        require: true,
    },
    tax: {
        type: Number,
        require: true,
    },
    shipping: {
        type: Number,
        require: true,
    },
    shippingAddress: {
        type: User_1.addressSchema,
        require: true,
    },
    paymentMethod: {
        type: String,
        enum: ['CASH', 'EMONEY'],
        require: true,
    },
    cardNumber: String,
    shippedAt: Date,
});
module.exports = (0, mongoose_1.model)('Order', orderSchema);
