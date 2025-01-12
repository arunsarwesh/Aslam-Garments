import { baseurl } from "@/app/utils/Url";
import axios from "axios";

const Payment = async (amount) => {
  try {
    console.log("Payload:", { amount });

    // Make API call to create Razorpay order
    const response = await axios.post(
      `${baseurl}/create_razorpay_order/`,
      { amount }, // Request body
      {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
      }
    );

    // Ensure the response structure is correct
    if (!response.data || !response.data.order_id || !response.data.key) {
      throw new Error("Invalid response from the server");
    }

    // Destructure the response data
    const { order_id, key, amount: orderAmount, currency } = response.data;

    // Razorpay options
    const options = {
      key,
      amount: orderAmount,
      currency,
      name: "Your Company Name",
      description: "Test Transaction",
      order_id,
      handler: (paymentResponse) => {
        console.log("Payment successful:", paymentResponse);
      },
      prefill: {
        name: "Test User",
        email: "test@example.com",
        contact: "9999999999",
      },
      theme: {
        color: "#3399cc",
      },
    };

    // Check if Razorpay script is loaded
    if (!window.Razorpay) {
      throw new Error("Razorpay SDK is not loaded");
    }

    // Initialize Razorpay
    const razorpay = new window.Razorpay(options);
    razorpay.open();
  } catch (error) {
    if (error.response) {
      console.error("Server Error:", error.response.data);
    } else if (error.request) {
      console.error("Request Error: No response received from server", error.request);
    } else {
      console.error("Unexpected Error:", error.message);
    }
  }
};

export default Payment;
