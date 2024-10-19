import React, { useEffect, useState } from "react";
import NavbarUser from "../UserPages/NavbarUser";
import Footer from "../../Footer";
import NavbarAdmin from "./NavbarAdmin";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import axios from "axios";

const  LoanApprove = ()=>{
    const  history = useHistory();
    const token = localStorage.getItem("token");
    const[LoanData , setLoanData] = useState();


    useEffect(() => {
      // Function to fetch details
      
      // Call the function when the component loads
      getDetails();
    }, []);
    

    const getDetails = async () => {
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            // Include token if necessary
            Authorization: `Bearer ${token}`
          }
        };

        // Fetch data from the API
        const { data } = await axios.get("http://127.0.0.1:5000/api/loan/getDetails", config);
        // const LoanData = JSON.parse(data);
        setLoanData(data);
        console.log(data); // Handle the response data

        // You can also store the fetched data in the state if needed
      } catch (error) {
        console.error("Error fetching details:", error);
      }
    };
   

      
    const ApproveLoan = async(loan_id)=>{
      console.log("this Approve function is called");

        if(!loan_id){
           alert("unable to approve try again later !");
           return ;
        }
        try {
          const config = {
            headers: {
              "Content-Type": "application/json",
              // Include token if necessary
              Authorization: `Bearer ${token}`
            }
          };
  
          // Fetch data from the API
          const { data } = await axios.post(`http://127.0.0.1:5000/api/loan/getDetails/${loan_id}`,{}, config);
          // const LoanData = JSON.parse(data);
        
          // console.log(data); // Handle the response data
          if(data){
              alert("Loan has Been Approved");
              getDetails();
          }
  
          // You can also store the fetched data in the state if needed
        } catch (error) {
          console.error("Error fetching details:", error);
        }
        
    }
    
    return (
        <>
        <div
  className=" fixed h-screen w-screen"
  style={{
    backgroundImage: "url('https://c4.wallpaperflare.com/wallpaper/543/485/169/abstract-blue-wallpaper-preview.jpg')",
    backgroundSize: "cover", // Ensures the background covers the entire div
  }}
>
         <NavbarAdmin/>
            <section class="text-gray-400  body-font">
  <div class="container px-5 py-24 mx-auto">
    <div class="flex flex-col text-center w-full mb-20">
      <h1 class="sm:text-4xl text-3xl font-medium title-font mb-2 text-white">Loan Approval Chart</h1>
    
    </div>
    <div class="lg:w-2/3 w-full mx-auto max-h-96 overflow-y-auto">
      <table class="table-auto w-full text-left whitespace-no-wrap">
        <thead>
          <tr>
            <th class="px-4 py-3 title-font tracking-wider font-medium text-white text-sm bg-gray-800 rounded-tl rounded-bl">Amount</th>
            <th class="px-4 py-3 title-font tracking-wider font-medium text-white text-sm bg-gray-800">Time Period</th>
            <th class="px-4 py-3 title-font tracking-wider font-medium text-white text-sm bg-gray-800">Approve</th>
            <th class="px-4 py-3 title-font tracking-wider font-medium text-white text-sm bg-gray-800">Reject</th>
          
          </tr>
        </thead>
        <tbody>
        {!LoanData ? (
  <>
    {/* No data available */}
  </>
) : (
  <>
    {LoanData.map((loan, index) => (
      <tr key={loan._id}>
        {/* Loan Amount */}
        <td className="px-4 py-3">{loan.loan_amt}</td>
        
        {/* Loan Creation Time */}
        <td className="px-4 py-3">{new Date(loan.createdAt).toLocaleString()}</td>

        {/* Approve Loan Button */}
        <td className="px-4 py-3">
          <button
            className="inline-flex text-white bg-green-500 border-0 py-2 px-6 focus:outline-none hover:bg-green-600 rounded text-lg"
            onClick={()=>{ApproveLoan(loan._id)}}
          >
            Approve Loan
          </button>
        </td>

        {/* Reject Loan Button */}
        <td className="px-4 py-3">
          <button
            className="inline-flex text-white bg-red-500 border-0 py-2 px-6 focus:outline-none hover:bg-red-600 rounded text-lg"
             
          >
            Reject Loan
          </button>
        </td>
      </tr>
    ))}
  </>
)}

          {/* <tr>
            <td class="px-4 py-3">Start</td>
            <td class="px-4 py-3">5 Mb/s</td>
            <td class="px-4 py-3"><button class="inline-flex text-white  border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-lg" >Approve Loan</button></td>
            <td class="px-4 py-3"><button class="inline-flex text-white  border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-lg" >Reject Loan</button></td>
          </tr> */}
 
        </tbody>
      </table>
    </div>
   
  </div>
</section>
  <Footer/>
  </div>
        </>
    )
}
export default LoanApprove;