import { axiosInstance } from "@/api/axiosinstance/axiosInstance";
import endpoints from "@/api/endPoints/endpoints";

const createAlbum = async (data: FormData) => {
  const response = await axiosInstance.post(
    `${endpoints.album.createAlbum}`,
    data,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};

export default createAlbum;
