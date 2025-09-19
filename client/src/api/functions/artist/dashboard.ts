import { axiosInstance } from "@/api/axiosinstance/axiosInstance";
import endpoints from "@/api/endPoints/endpoints";
import { Dashboard } from "@/types";

const getDashboard = async (): Promise<Dashboard> => {
  const response = await axiosInstance.get(`${endpoints.artist.dashboard}`);
  return response.data.data as Dashboard;
};

export default getDashboard;
