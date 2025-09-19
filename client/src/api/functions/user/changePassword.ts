import { axiosInstance } from "@/api/axiosinstance/axiosInstance";
import endpoints from "@/api/endPoints/endpoints";

const changePassword = async (data: {
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}) => {
  const response = await axiosInstance.post(
    `${endpoints.user.changePassword}`,
    data,
    { headers: { "Content-Type": "application/json" } }
  );
  return response.data;
};

export default changePassword;
