import { axiosInstance } from "@/api/axiosinstance/axiosInstance";
import endpoints from "@/api/endPoints/endpoints";
import { SingleAlbum } from "@/types";

const getSingleAlbum = async (slug: string): Promise<SingleAlbum[]> => {
  const response = await axiosInstance.get(
    `${endpoints.album.getSingleAlbum}/${slug}`
  );
  return response.data.data as SingleAlbum[];
};

export default getSingleAlbum;
