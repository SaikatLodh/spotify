import { axiosInstance } from "@/api/axiosinstance/axiosInstance";
import endpoints from "@/api/endPoints/endpoints";

const listenSong = async (songId: string) => {
  const response = await axiosInstance.get(
    `${endpoints.song.listenSong}/${songId}`
  );
  return response.data;
};

export default listenSong;
