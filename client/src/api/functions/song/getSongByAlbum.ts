import { axiosInstance } from "@/api/axiosinstance/axiosInstance";
import endpoints from "@/api/endPoints/endpoints";
import { Song } from "@/types";

const getSongByAlbum = async (albumId: string): Promise<Song[]> => {
  const response = await axiosInstance.get(
    `${endpoints.song.getAllSongsByAlbum}/${albumId}`
  );
  return response.data.data as Song[];
};

export default getSongByAlbum;
