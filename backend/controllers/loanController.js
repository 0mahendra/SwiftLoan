const asyncHandler = require("express-async-handler");
const Loan  = require("../model/loanModel");
const User = require("../model/UserModel");

const createLoan = asyncHandler(async (req, res) => {
  const { loan_amt, time } = req.body;


  if (loan_amt <= 0) {
    res.status(400);
    throw new Error("Please add a valid loan amount");
  }
  if (time <= 0) {
    res.status(400);
    throw new Error("Time delay cannot be zero");
  }

  const userId = req.params.id;
  const userDetails = await User.findById(userId);

  if (!userDetails) {
    res.status(404);
    throw new Error("User not found");
  }

 
  if (userDetails.loanTaken === true) {
    res.status(400).json({userDetails});
    throw new Error("You already have an existing loan");
  }

  const Amt_pay_weekly = loan_amt / time;

  const Amt_chart = [];
  for (let week = 1; week <= time; week++) {
    
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + (7 * week));

    
    Amt_chart.push({
      Amt_recived: Amt_pay_weekly,
      Status: "not approved", 
      Due_date: dueDate
    });
  }

  
  const LoanAssign = await Loan.create({
    UserId: userDetails._id,
    loan_amt,
    PayedAmt: 0, 
    Amt_chart, 
  });

  
  // userDetails.loanTaken = true;
  // userDetails.loanId = LoanAssign._id;
  // await userDetails.save();


  if (LoanAssign) {
    res.status(201).json({
      _id: LoanAssign._id,
      userDeatils: LoanAssign.UserId,
      loan_amt: LoanAssign.loan_amt,
      Amt_chart: LoanAssign.Amt_chart,
    });
  } else {
    res.status(400);
    throw new Error("Error in loan assignment");
  }
});


// updatin the amt chart  when payment is recived 
const UpdateLoan = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  const { payment } = req.body;

  const userDetails = await User.findById(userId);

  if (!userDetails || !userDetails.loanTaken) {
    res.status(400);
    throw new Error("No loan exists for this user");
  }

  const LoanAssign = await Loan.findById(userDetails.loanId);

  if (!LoanAssign) {
    res.status(404);
    throw new Error("Loan not found");
  }

  let paymentApplied = false;
  for (let i = 0; i < LoanAssign.Amt_chart.length; i++) {
    if (LoanAssign.Amt_chart[i].Status === "not approved") {
      
        LoanAssign.Amt_chart[i].Status = "approved";
        LoanAssign.PayedAmt += LoanAssign.Amt_chart[i].Amt_recived;
        paymentApplied = true;
        break; 
     
    }
  }

  if (!paymentApplied) {
    res.status(400);
    
    throw new Error("All payments have already been received or the payment was too low.");
  }

  await LoanAssign.save();

  res.status(200).json({
    _id: LoanAssign._id,
    loan_amt: LoanAssign.loan_amt,
    PayedAmt: LoanAssign.PayedAmt,
    Amt_chart: LoanAssign.Amt_chart,
  });
});


// delete the loan if the if all payemrnt have been  recived 
const DeleteLoan = asyncHandler(async (req, res) => {
  const userId = req.params.id;

  const userDetails = await User.findById(userId);

  if (!userDetails || !userDetails.loanTaken) {
    res.status(400);
    throw new Error("No active loan found for this user");
  }

  const LoanAssign = await Loan.findById(userDetails.loanId);

  if (!LoanAssign) {
    res.status(404);
    throw new Error("Loan not found");
  }

  const allPaymentsReceived = LoanAssign.Amt_chart.every(
    (payment) => payment.Status === "approved"
  );

  if (!allPaymentsReceived) {
    res.status(400);
    throw new Error("Loan cannot be deleted until all payments are received");
  }

  userDetails.loanTaken = false;
  userDetails.loanId = null;
  await userDetails.save();

  await LoanAssign.remove();

  res.status(200).json({ message: "Loan deleted and user status updated successfully" });
});

const getDetails = asyncHandler(async (req, res) => {
  console.log("request comes to this get Details page00");
  try {
    // Find all loans where loanGiven is false and populate UserId with user details
    const loans = await Loan.find({ loanGiven: false }).populate("UserId", "name email");

    // If loans are found, return them
    console.log(loans);
    if (loans) {
      res.status(200).json(loans);
    } else {
      res.status(404);
      throw new Error("No loans found where loanGiven is false.");
    }
  } catch (error) {
    res.status(500);
    throw new Error("Failed to fetch loan details.");
  }
});
const getDetailsUser = asyncHandler(async (req, res) => {
  console.log("Request received to get loan details");
  try {
    const loan_id = req.params.id;

    // Find the loan by its ID
    const loan = await Loan.findById(loan_id);

    if (loan) {
      // Update the loan's loanGiven field to true
      loan.loanGiven = true;
      await loan.save();

      // Find the user by the UserId referenced in the loan and update loanTaken to true
      const user = await User.findById(loan.UserId);

      if (user) {
        user.loanTaken = true;
        user.loanId  = loan_id;
        await user.save();

        res.status(200).json({ loan, user });
      } else {
        res.status(404).json({ message: "User associated with the loan not found." });
      }
    } else {
      res.status(404).json({ message: "Loan not found." });
    }
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch loan details." });
  }
});



module.exports = {createLoan , UpdateLoan , getDetails, getDetailsUser,DeleteLoan};