import { axiosInstance } from "@/api/axiosinstance/axiosInstance";
import endpoints from "@/api/endPoints/endpoints";
import { SingleAlbum } from "@/types";

const getSingleArtistAlbum = async (slug: string): Promise<SingleAlbum[]> => {
  const response = await axiosInstance.get(
    `${endpoints.album.getSingleArtistAlbum}/${slug}`
  );
  return response.data.data as SingleAlbum[];
};

export default getSingleArtistAlbum;
