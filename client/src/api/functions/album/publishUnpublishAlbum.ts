import { axiosInstance } from "@/api/axiosinstance/axiosInstance";
import endpoints from "@/api/endPoints/endpoints";

const publishUnpublishAlbum = async (albumId: string, slug: string) => {
  const response = await axiosInstance.get(
    `${endpoints.album.publishUnPublishAlbum}/${albumId}/${slug}`
  );
  return response.data;
};

export default publishUnpublishAlbum;
