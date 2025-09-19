import { axiosInstance } from "@/api/axiosinstance/axiosInstance";
import endpoints from "@/api/endPoints/endpoints";

const createSong = async (data: FormData) => {
  const response = await axiosInstance.post(
    `${endpoints.song.createSong}`,
    data,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};

export default createSong;
