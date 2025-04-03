const transactionKoraRouter = require("express").Router();
const {initializePaymentKora, verifyPaymentKora, initialPaymentPaystack, verifyPaymentPaystack} = require("../controller/transactionController");


transactionKoraRouter.post("/initializeKoraPay", initializePaymentKora);
transactionKoraRouter.get("/verifyKoraPay", verifyPaymentKora);
transactionKoraRouter.post("/initializePaystack", initialPaymentPaystack);
transactionKoraRouter.get("/verifyPaystack", verifyPaymentPaystack);


module.exports = transactionKoraRouter;