const mongoose = require("mongoose");

const transactionSchemaKora = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    amount: {
        type: Number,
        required: true
    },
    plan: {
        type: String,
        enum: ["Freemium", "Premium", "Lifetime Access"],
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

const transactionKoraModel = mongoose.model("TransactionKora", transactionSchemaKora);

module.exports = transactionKoraModel;