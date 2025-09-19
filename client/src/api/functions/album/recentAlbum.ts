import { axiosInstance } from "@/api/axiosinstance/axiosInstance";
import endpoints from "@/api/endPoints/endpoints";
import { Album } from "@/types";

const getRecentAlbum = async (): Promise<Album[]> => {
  const response = await axiosInstance.get(`${endpoints.album.recent}`);
  return response.data.data as Album[];
};

export default getRecentAlbum;
