import { axiosInstance } from "@/api/axiosinstance/axiosInstance";
import endpoints from "@/api/endPoints/endpoints";
import { Song } from "@/types";

const getSongBySearch = async (name: string): Promise<Song[]> => {
  const response = await axiosInstance.get(
    `${endpoints.song.getSongsBySearch}?name=${name}`
  );
  return response.data.data as Song[];
};

export default getSongBySearch;
