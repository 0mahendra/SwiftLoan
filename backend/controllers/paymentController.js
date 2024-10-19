const asyncHandler = require("express-async-handler");
const Loan  = require("../model/loanModel");
const User = require("../model/UserModel");
const Payment = require("../model/PaymentModel");

const createPayment = asyncHandler(async (req, res) => {
    const {refranceNumber, pic } = req.body;
    console.log(refranceNumber)
    const userId = req.params.id;
  
    // Check if user exists
    const userDetails = await User.findById(userId);
    if (!userDetails) {
      res.status(404); // Use 404 for not found
      throw new Error("No user found");
    }
  
    // Check if payment reference number already exists
    const paymentCheck = await Payment.findOne({ refranceNumber });
    if (paymentCheck) {
      res.status(400);
      throw new Error("Payment already exists with this reference number");
    }
  
    // Create new payment
    const newPayment = await Payment.create({
      userId: userDetails._id,
      refranceNumber: refranceNumber,
      pic: pic,
    });
  
    // Check if payment was created successfully
    if (newPayment) {
      res.status(201).json({ newPayment });
    } else {
      res.status(500); // Use 500 for server error
      throw new Error("Error creating payment");
    }
  });

  const getPaymentDetails = asyncHandler(async (req, res) => {
    const refranceNumber = req.params.id;
  
    // Check if payment exists
    const paymentCheck = await Payment.findOne({ refranceNumber });
  
    if (paymentCheck) {
      res.status(200).json({
        payment: paymentCheck, // Use a more descriptive key for the response
      });
    } else {
      res.status(404); // Use 404 for not found
      throw new Error("Payment not found"); // Use `new Error` instead of `error`
    }
  });
   
  const getDetails = asyncHandler(async (req, res) => {
    // Fetch all payments sorted by the date added (assuming there's a 'createdAt' field)
    const payments = await Payment.find().sort({ createdAt: -1 }); // Change 'createdAt' if your date field has a different name
  
    if (payments.length > 0) {
      res.status(200).json({
        payments, // Use a more descriptive key for the response
      });
    } else {
      res.status(404); // Use 404 for not found
      throw new Error("No payments found"); // Use `new Error` instead of `error`
    }
  });
  
  const deletePayment = asyncHandler(async (req, res) => {
    const refranceNumber = req.params.id;
  
    // Check if payment exists
    const paymentCheck = await Payment.findOne({ refranceNumber });
  
    if (paymentCheck) {
      await Payment.deleteOne({ refranceNumber }); // Use `deleteOne` to remove the payment document
      res.status(200).json({ message: "Payment successfully deleted" });
    } else {
      res.status(404); // Use 404 for not found
      throw new Error("No payment found");
    }
  });
  
 




module.exports = {createPayment ,getPaymentDetails, getDetails , deletePayment};