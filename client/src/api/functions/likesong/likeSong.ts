import { axiosInstance } from "@/api/axiosinstance/axiosInstance";
import endpoints from "@/api/endPoints/endpoints";

const likeSong = async (songId: string) => {
  const response = await axiosInstance.get(
    `${endpoints.likeSong.likeSong}/${songId}`
  );
  return response.data;
};

export default likeSong;
