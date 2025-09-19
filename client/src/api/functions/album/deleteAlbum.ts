import { axiosInstance } from "@/api/axiosinstance/axiosInstance";
import endpoints from "@/api/endPoints/endpoints";

const deleteAlbum = async (albumId: string, slug: string) => {
  const response = await axiosInstance.delete(
    `${endpoints.album.deleteAlbum}/${albumId}/${slug}`
  );
  return response.data;
};

export default deleteAlbum;
