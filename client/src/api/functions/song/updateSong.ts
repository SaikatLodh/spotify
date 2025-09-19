import { axiosInstance } from "@/api/axiosinstance/axiosInstance";
import endpoints from "@/api/endPoints/endpoints";

const updateSong = async (songId: string, albumId: string, data: FormData) => {
  const response = await axiosInstance.put(
    `${endpoints.song.updateSong}/${songId}/${albumId}`,
    data,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};

export default updateSong;
