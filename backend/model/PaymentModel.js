const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true, // Ensure this is marked as required
    ref: 'User', // If you have a User model
  },
  refranceNumber: {
    type: String,
    required: true, // Ensure this is marked as required
    unique: true, // Optional: Ensure reference numbers are unique
  },
  pic: {
    type: String,
    required: false, // Adjust based on your requirements
  },
});

const Payment = mongoose.model('Payment', paymentSchema);
module.exports = Payment;
