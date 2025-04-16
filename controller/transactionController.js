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

// exports.initializePaymentKora = async (req, res) => {
//     try{
//         const {amount, email, name} = req.body;
//         if(!amount || !email || !name){
//             return res.status(400).json({
//                 message: "All fields are required"
//             });
//         }

//         const ref = `TCA-AF-${otpGenerator.generate(12, { specialChars: false })}`;
//         console.log(ref);

//         const paymentData = {
//             amount,
//             customer: {
//                 name,
//                 email
//             },
//             currency: "NGN",
//             reference: ref
//         }

//         const response = await axios.post("https://api.korapay.com/merchant/api/v1/charges/initialize", paymentData, {

//             headers: {
//                 Authorization: `Bearer ${SECRET_KEY_KORA}`
//             }
//         });

//         const {data} = response?.data;
//         const payment = new transactionKoraModel({
//             name,
//             email,
//             amount,
//             reference: paymentData.reference,
//             paymentDate: formattedDate,
//         });

//         console.log("Payment Reference:", paymentData.reference);

//         await payment.save();

//         res.status(200).json({
//             message: "Payment Successfully",
//             data: {
//                 reference: data?.reference,
//                 checkout_url: data?.checkout_url
//             }
//         })
        

//     }catch(error){
//         console.log(error.message);
//         res.status(500).json({
//             message: error.message
//         });
//     }
// }

// exports.verifyPaymentKora = async (req, res) => {
//     try{
//         const {reference} = req.query;

//         const response = await axios.get(`https://api.korapay.com/merchant/api/v1/charges/${reference}`, {
//             headers: {
//                 Authorization: `Bearer ${SECRET_KEY_KORA}`
//             }
//         });

//         const {data} = response?.data;

//         //This Optional Chaining
//         if(data?.status && data?.status === "success"){
//             const payment = await transactionKoraModel.findOneAndUpdate({reference}, {status: "Success"}, {new: true});
//             res.status(200).json({
//                 message: "Payment Verification Successfully",
//                 data: payment
//             });
//         }else{
//             const payment = await transactionKoraModel.findOneAndUpdate({reference}, {status: "Failed"}, {new: true});
//             res.status(400).json({
//                 message: "Payment Verification Failed",
//                 data: payment
//             });
//         }

//     }catch(error){
//         console.log(error.message)
//         res.status(500).json({
//             message: `Internal Server Error` + error.message
//         });
//     }
// }


exports.initializePaymentKora = async (req, res) => {
    try {
      const { amount, email, name, plan} = req.body;
  
      const { studentId } = req.params; // Extract studentId from request parameters
  
      if (!studentId) {
        return res.status(400).json({
          message: "Student ID is required"
        });
      }
  
      if (!amount || !email || !name || !plan ) {
        return res.status(400).json({
          message: "All fields are required"
        });
      }
  
      const ref = `TCA-AF-${otpGenerator.generate(12, { specialChars: false })}`;
    //   console.log("Generated Ref:", ref);
  
      const paymentData = {
        amount,
        customer: {
          name,
          email
        },
        currency: "NGN",
        reference: ref
      };
  
      const response = await axios.post(
        "https://api.korapay.com/merchant/api/v1/charges/initialize",
        paymentData,
        {
          headers: {
            Authorization: `Bearer ${SECRET_KEY_KORA}`
          }
        }
      );
  
      const { data } = response?.data;
  
      // Save the transaction
      const payment = new transactionKoraModel({
        name,
        email,
        amount,
        reference: ref,
        paymentDate: formattedDate,
        status: "Pending" // mark as pending until verification
      });
  
      await payment.save();
  
      // Update the student with selected plan (optional)
      // await studentModel.findByIdAndUpdate(studentId, {
      //   plan: plan // e.g. "Premium"
      // });
  
      // Redirect with reference, checkout URL, and studentId
      const fullRedirect = `https://legacy-builder.vercel.app/payment-status?reference=${ref}&checkout_url=${encodeURIComponent(data?.checkout_url)}&studentId=${studentId}`;

      return res.redirect(fullRedirect);
    } catch (error) {
      console.log("Initialize Payment Error:", error.message);
      return res.status(500).json({
        message: error.message
      });
    }

  };

exports.verifyPaymentKora = async (req, res) => {
    try {
      const { reference } = req.query;
  
      if ( !reference ) {
        return res.status(400).json({
          message: "Reference is required"
        });
      }
  
      // Verify transaction with Korapay
      const response = await axios.get(
        `https://api.korapay.com/merchant/api/v1/charges/${reference}`,
        {
          headers: {
            Authorization: `Bearer ${SECRET_KEY_KORA}`
          }
        }
      );
  
      const { data } = response?.data;
  
      // Fetch the local payment record
      const payment = await transactionKoraModel.findOne({ reference });
  
      if (!payment) {
        return res.status(404).json({
          message: "Transaction not found"
        });
      }
  
      const student = await studentModel.findOne({ email: payment.email });
  
      if (!student) {
        return res.status(404).json({
          message: "Student not found"
        });
      }
  
      if (data?.status === "success") {
        // Update payment and student status
        payment.status = "Success";
        await payment.save();
  
        student.plan = "Premium"; // or "Lifetime Access" if logic applies
        await student.save();
  
        
        const redirectSuccess = `https://legacy-builder.vercel.app/payment-status?status=success&reference=${reference}&studentId=${student._id}`;
        return res.redirect(redirectSuccess);
      } else {
        // Update payment as failed
        payment.status = "Failed";
        await payment.save();

        const redirectFail = `https://legacy-builder.vercel.app/payment-status?status=failed&reference=${reference}&studentId=${student._id}`;
        return res.redirect(redirectFail);
      }
    } catch (error) {
      console.error("Verification Error:", error.message);
      return res.status(500).json({
        message: `Internal Server Error: ${error.message}`
      });
    }
  };
  
 
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