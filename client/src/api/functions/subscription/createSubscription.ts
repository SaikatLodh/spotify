import { axiosInstance } from "@/api/axiosinstance/axiosInstance";
import endpoints from "@/api/endPoints/endpoints";

const createSubscription = async (data: {
  plan: string;
  price: number;
  duration: string;
}): Promise<{
  id: string;
  currency: string;
  amount: number;
  subscriptionId: string;
}> => {
  const response = await axiosInstance.post(
    endpoints.subscription.createSubscription,
    data,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response.data.data.razorpayOrderDetails;
};

export default createSubscription;
