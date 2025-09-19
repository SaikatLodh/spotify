import { axiosInstance } from "@/api/axiosinstance/axiosInstance";
import endpoints from "@/api/endPoints/endpoints";

const deleteAccount = async () => {
  const response = await axiosInstance.delete(
    `${endpoints.user.deleteAccount}`
  );
  return response.data;
};

export default deleteAccount;
