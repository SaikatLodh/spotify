import { axiosInstance } from "@/api/axiosinstance/axiosInstance";
import endpoints from "@/api/endPoints/endpoints";
import { Playlist } from "@/types";

const getPlaylist = async (): Promise<Playlist[]> => {
  const response = await axiosInstance.get(endpoints.playlist.getplaylist);
  return response.data.data as Playlist[];
};

export default getPlaylist;
