import { axiosInstance } from "@/api/axiosinstance/axiosInstance";
import endpoints from "@/api/endPoints/endpoints";

const expireSubscription = async () => {
  const response = await axiosInstance.get(
    endpoints.subscription.expireSubscription
  );
  return response.data;
};

export default expireSubscription;
