//Import TransactionModel

const transactionKoraModel = require("../model/transactionKora");
const transactionPaystackModel = require("../model/transactionPaystack");
const studentModel = require("../model/student");
const axios = require("axios");
const otpGenerator = require("otp-generator");
// const otp = otpGenerator.generate(12, { specialChars: false });
// const ref = `TCA-AF-${otp}`;
// const otp = otpGenerator.generate(12, { specialChars: false });
// const ref = `TCA-AF-${otp}`;
const SECRET_KEY_KORA = process.env.KORAPAY_SECRET_KEY;
const SECRET_KEY_PAYSTACK = process.env.PAYSTACK_SECRET_KEY
const formattedDate = new Date().toLocaleString();
const formattedDatePaystack = new Date().toISOString().slice(0, 10);

exports.initializePaymentKora = async (req, res) => {
    try{
        const {amount, email, name} = req.body;
        if(!amount || !email || !name){
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        const ref = `TCA-AF-${otpGenerator.generate(12, { specialChars: false })}`;
        console.log(ref);

        const paymentData = {
            amount,
            customer: {
                name,
                email
            },
            currency: "NGN",
            reference: ref,
            redirect_url: `https://legacy-builder.vercel.app/payment-status?reference=${ref}`
        }

        const response = await axios.post("https://api.korapay.com/merchant/api/v1/charges/initialize", paymentData, {

            headers: {
                Authorization: `Bearer ${SECRET_KEY_KORA}`
            }
        });

        const {data} = response?.data;
        const payment = new transactionKoraModel({
            name,
            email,
            amount,
            reference: paymentData.reference,
            paymentDate: formattedDate,
        });

        console.log("Payment Reference:", paymentData.reference);

        await payment.save();

        res.status(200).json({
            message: "Payment Successfully",
            data: {
                reference: data?.reference,
                checkout_url: data?.checkout_url,
                redirect_url: data?.redirect_url
            }
        })
        
    }catch(error){
        console.log(error.message);
        res.status(500).json({
            message: error.message
        });
    }

  };

exports.verifyPaymentKora = async (req, res) => {
    try{
        const {reference} = req.query;

        const response = await axios.get(`https://api.korapay.com/merchant/api/v1/charges/${reference}`, {
            headers: {
                Authorization: `Bearer ${SECRET_KEY_KORA}`
            }
        });

        const {data} = response?.data;

        //This Optional Chaining
        if(data?.status && data?.status === "success"){
            const payment = await transactionKoraModel.findOneAndUpdate({reference}, {status: "Success"}, {new: true});
            res.status(200).json({
                message: "Payment Verification Successfully",
                data: payment
            });
        }else{
            const payment = await transactionKoraModel.findOneAndUpdate({reference}, {status: "Failed"}, {new: true});
            res.status(400).json({
                message: "Payment Verification Failed",
                data: payment
            });
        }

    }catch(error){
        console.log(error.message)
        res.status(500).json({
            message: `Internal Server Error` + error.message
        });
    }
}

exports.initialPaymentPaystack = async (req, res) => {
    try {
        const { email, amount } = req.body;

        // console.log(email, amount)
        if (!email || !amount  ) {
            return res.status(400).json({ 
                message: "Invalid input" 
            });
        }


        const paymentData = { 
            email,
            amount: amount * 100,
        }

        const response = await axios.post("https://api.paystack.co/transaction/initialize", paymentData, {
            headers: {
                Authorization: `Bearer ${SECRET_KEY_PAYSTACK}`
            }
        });
        const { data } = response;
       
        const payment = new transactionPaystackModel({
            email,
            amount,
            reference: data?.data?.reference,
            // paymentDate: data.data.payment_date,
            paymentDate: formattedDatePaystack,
            // status: data.data.status
        })

        await payment.save();

        return res.status(200).json({
            message: "Payment initialized successfully",
            data: {
                authorization_url: data?.data?.authorization_url,
                reference: data?.data?.reference
            }
        });
        // const response = await axios.post("https://api.paystack.co/transaction/initialize", {
        //     email,
        //     amount,
        //     callback_url: "http://localhost:4060/api/v1/verify",
        // }, {
        //     headers: {
        //         "Authorization": `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
        //     }
        // });
        // return res.status(200).json(response.data);
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ 
            message: "Initializing payment failed: " + error.message 
        });
    }
}


exports.verifyPaymentPaystack = async (req, res) => {
    try {

        //The req.query object contains the query parameters in the URL
        const { reference } = req.query;

        console.log("Payment Reference:", reference);
        const response = await axios.get(`https://api.paystack.co/transaction/verify/${reference}`,{
            headers: {
                Authorization: `Bearer ${SECRET_KEY_PAYSTACK}`
            }
        });
        const { data } = response;

        let payment;

        if(data.data.status && data.data.status === "success") {
            console.log("Payment was successful");
            payment = await transactionPaystackModel.findOneAndUpdate({ reference }, {status: "Success"}, {new: true});
            return res.status(200).json({
                message: "Payment verified successfully",
                data: payment
            });
        }else{
            console.log("Payment was not successful");
            payment = await transactionPaystackModel.findOneAndUpdate({ reference }, {status: "Failed"}, {new: true});
            return res.status(200).json({
                message: "Payment Verification Failed",
                data: payment
            });
        }
        }catch (error) {
        console.log(error.message);
        return res.status(500).json({ 
            message: "Verifying payment failed: " + error.message 
        });
    }
}