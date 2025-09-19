import { axiosInstance } from "@/api/axiosinstance/axiosInstance";
import endpoints from "@/api/endPoints/endpoints";

const updateProfile = async (data: FormData) => {
  const response = await axiosInstance.put(
    `${endpoints.user.updateUser}`,
    data,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  return response.data;
};

export default updateProfile;
