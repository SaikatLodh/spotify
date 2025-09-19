import { axiosInstance } from "@/api/axiosinstance/axiosInstance";
import endpoints from "@/api/endPoints/endpoints";

const addAndRemovePlaylist = async (slug: string, songId: string) => {
  const response = await axiosInstance.get(
    `${endpoints.playlist.addAndRemoveSong}/${slug}/${songId}`
  );
  return response.data;
};

export default addAndRemovePlaylist;
