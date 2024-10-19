import React, { useEffect, useState } from "react";
import NavbarUser from "../UserPages/NavbarUser";
import Footer from "../../Footer";
import NavbarAdmin from "./NavbarAdmin";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import axios from "axios";

const PayementReceive = ()=>{
       const history = useHistory();
       const AdminId = localStorage.getItem("AdminId");
         const token = localStorage.getItem("token");

         const [paymentData , setPaymentData] = useState();
       useEffect(() => {
        
        getDetails();
      }, []);
   
  
      const getDetails = async () => {
        try {
          const config = {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`
            }
          };
  
          // Fetch data from the API
          const { data } = await axios.get("http://127.0.0.1:5000/api/payment/getDetails", config);
          // const LoanData = JSON.parse(data);
          console.log(data.payments);
          setPaymentData(data.payments);

          
          // console.log(data); // Handle the response data
  
          // You can also store the fetched data in the state if needed
        } catch (error) {
          console.error("Error fetching details:", error);
        }
      };

      const handleApprove = async (userId) => {
        if (!userId) {
          alert("Please try again.");
          return;
        }
      
        try {
          const config = {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`
            }
          };
      
          // Fetch data from the API
          const { data } = await axios.put(`http://127.0.0.1:5000/api/loan/updateLoan/${userId}`, {}, config); // Pass an empty object as the second argument for the PUT body
      
          // Check if the response contains the expected data
          if (data) {
            alert("Update successful.");
          }
        } catch (error) {
          console.error("Error updating loan:", error);
          alert("An error occurred while updating the loan."); // Provide user feedback on error
        }
      };
      
      const HandleReject = async (refranceNumber) => {
        if (!refranceNumber) {
          alert("Please try again.");
          return;
        }
      
        try {
          const config = {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          };
      
          // Fetch data from the API
          const { data } = await axios.delete(
            `http://127.0.0.1:5000/api/payment/deletePayment/${refranceNumber}`,
            config
          );
      
          if (data) {
            alert("Deletion successful.");
          }
        } catch (error) {
          console.error("Error deleting payment:", error);
          alert("An error occurred while deleting the payment.");
        }
      };
      
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
      <h1 class="sm:text-4xl text-3xl font-medium title-font mb-2 text-white">Payment Recieve Chart</h1>
    
    </div>
    <div class="lg:w-2/3 w-full mx-auto overflow-auto">
    <table className="table-auto w-full text-left whitespace-no-wrap">
  <thead>
    <tr>
      <th className="px-4 py-3 title-font tracking-wider font-semibold text-gray-300 text-sm bg-gray-800">
        Reference Number
      </th>
      <th className="px-4 py-3 title-font tracking-wider font-semibold text-gray-300 text-sm bg-gray-800">
        User Details
      </th>
      <th className="px-4 py-3 title-font tracking-wider font-semibold text-gray-300 text-sm bg-gray-800">
        Screenshot
      </th>
      <th className="px-4 py-3 title-font tracking-wider font-semibold text-gray-300 text-sm bg-gray-800">
        Accepted
      </th>
      <th className="px-4 py-3 title-font tracking-wider font-semibold text-gray-300 text-sm bg-gray-800">
        Reject
      </th>
    </tr>
  </thead>
  <tbody>
    {!paymentData ? (
      <tr>
        <td colSpan="5" className="px-4 py-3 text-center text-gray-500">
          No payment data available.
        </td>
      </tr>
    ) : (
      <>
        {paymentData.map((payment, index) => (
          <tr key={index} className="border-b border-gray-200  hover:text-black">
            <td className="px-4 py-3 font-medium text-white  ">{payment.refranceNumber}</td>
            <td className="px-4 py-3">
              <button className="inline-flex text-white border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-lg text-white ">
                User Details {/* Assuming `userName` is a field in your payment data */}
              </button>
            </td>
            <td className="px-4 py-3">
              <button className="inline-flex border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded">
                <img src={payment.pic} alt="Screenshot" className="w-10 h-10 rounded" />
              </button>
            </td>
            <td className="px-4 py-3">
              <button className="inline-flex text-white border-0 py-2 px-6 focus:outline-none hover:bg-green-600 rounded text-lg text-white hover:text-black" onClick={()=>(handleApprove(payment.userId))}>
                Approve
              </button>
            </td>
            <td className="px-4 py-3">
              <button className="inline-flex text-white border-0 py-2 px-6 focus:outline-none hover:bg-red-600 rounded text-lg text-white hover:text-black"onClick={()=>(HandleReject(payment.refranceNumber))}>
                Reject
              </button>
            </td>
          </tr>
        ))}
      </>
    )}
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
export default PayementReceive;