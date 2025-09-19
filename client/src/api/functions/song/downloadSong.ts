import { axiosInstance } from "@/api/axiosinstance/axiosInstance";
import endpoints from "@/api/endPoints/endpoints";

const downloadSong = async (publicId: string) => {
  const response = await axiosInstance.get(
    `${endpoints.song.downloadSong}/${publicId}`,
    {
      responseType: "blob",
    }
  );
  return response.data;
};

export default downloadSong;
