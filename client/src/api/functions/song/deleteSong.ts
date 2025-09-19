import { axiosInstance } from "@/api/axiosinstance/axiosInstance";
import endpoints from "@/api/endPoints/endpoints";

const deleteSong = async (songId: string, albumId: string) => {
  const response = await axiosInstance.delete(
    `${endpoints.song.deleteSong}/${songId}/${albumId}`
  );
  return response.data;
};

export default deleteSong;
