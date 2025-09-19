import { axiosInstance } from "@/api/axiosinstance/axiosInstance";
import endpoints from "@/api/endPoints/endpoints";
import { Playlist } from "@/types";

const getSinglePlaylist = async (id: string): Promise<Playlist[]> => {
  const response = await axiosInstance.get(
    `${endpoints.playlist.getSinglePlaylist}/${id}`
  );
  return response.data.data as Playlist[];
};

export default getSinglePlaylist;
