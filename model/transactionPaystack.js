const mongoose = require("mongoose");

const transactionSchemaPaystack = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    reference: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ["Pending", "Success", "Failed"],
        default: "Pending"
    },
    paymentDate: {
        type: String,
        required: true
    }
}, {
    timestamps: true});

const transactionPaystackModel = mongoose.model("TransactionPaystack", transactionSchemaPaystack);

module.exports = transactionPaystackModel;