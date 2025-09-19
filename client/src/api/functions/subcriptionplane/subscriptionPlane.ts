import { axiosInstance } from "@/api/axiosinstance/axiosInstance";
import endpoints from "@/api/endPoints/endpoints";
import { SubscriptionPlan } from "@/types";

const getSubscriptionPlane = async (): Promise<SubscriptionPlan[]> => {
  const response = await axiosInstance.get(
    endpoints.subcriptionPlane.getSubcriptionPlane
  );
  return response.data.data as SubscriptionPlan[];
};

export default getSubscriptionPlane;
