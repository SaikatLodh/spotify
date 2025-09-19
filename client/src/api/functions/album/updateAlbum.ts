import { axiosInstance } from "@/api/axiosinstance/axiosInstance";
import endpoints from "@/api/endPoints/endpoints";

const updateAlbum = async (Slug: string, data: FormData) => {
  const response = await axiosInstance.patch(
    `${endpoints.album.updateAlbum}/${Slug}`,
    data,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};

export default updateAlbum;
