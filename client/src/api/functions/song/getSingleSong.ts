import { axiosInstance } from "@/api/axiosinstance/axiosInstance";
import endpoints from "@/api/endPoints/endpoints";
import { Song } from "@/types";

const getSingleSong = async (
  songId: string,
  albumId: string
): Promise<Song> => {
  const response = await axiosInstance.get(
    `${endpoints.song.getSongById}/${songId}/${albumId}`
  );
  return response.data.data as Song;
};

export default getSingleSong;
