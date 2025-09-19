import { axiosInstance } from "@/api/axiosinstance/axiosInstance";
import endpoints from "@/api/endPoints/endpoints";

const deleteplaylist = async (slug: string) => {
  const response = await axiosInstance.delete(
    `${endpoints.playlist.getSinglePlaylist}/${slug}`
  );
  return response.data;
};

export default deleteplaylist;
