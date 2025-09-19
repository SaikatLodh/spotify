import { axiosInstance } from "@/api/axiosinstance/axiosInstance";
import endpoints from "@/api/endPoints/endpoints";

const getKeys = async (): Promise<string> => {
  const response = await axiosInstance.get(endpoints.subscription.getKeys);
  return response.data.data.key as string;
};

export default getKeys;
