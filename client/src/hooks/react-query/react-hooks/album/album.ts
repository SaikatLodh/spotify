import { useGlobalHooks } from "@/hooks/globalHook";
import { useQuery, useMutation } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import { ALBUMS, ARTIST_ALBUM } from "../../react-keys/querykeys";
import getRecentAlbum from "@/api/functions/album/recentAlbum";
import getTrendingAlbum from "@/api/functions/album/trendingAlbum";
import getmadeForYougAlbum from "@/api/functions/album/madeForYouAlbum";
import getSingleAlbum from "@/api/functions/album/singleAlbum";
import getAllAlbums from "@/api/functions/album/getAllAlbums";
import createAlbum from "@/api/functions/album/createAlbum";
import getArtistAlbum from "@/api/functions/album/getArtistAlbum";
import deleteAlbum from "@/api/functions/album/deleteAlbum";
import getSingleArtistAlbum from "@/api/functions/album/getSingleArtistAlbum";
import updateAlbum from "@/api/functions/album/updateAlbum";
import publishUnpublishAlbum from "@/api/functions/album/publishUnpublishAlbum";

const useCreateAlbum = () => {
  const { queryClient } = useGlobalHooks();
  return useMutation({
    mutationFn: createAlbum,
    onSuccess: (data) => {
      if (data.message) {
        toast.success(data.message);
        queryClient.invalidateQueries({ queryKey: [ALBUMS] });
        queryClient.invalidateQueries({ queryKey: [ARTIST_ALBUM] });
      }
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        const msg = error?.response?.data?.message;
        toast.error(msg);
      }
    },
  });
};

const useGetAllAlbums = () => {
  return useQuery({
    queryKey: [ALBUMS],
    queryFn: getAllAlbums,
  });
};

const useGetRecentAlbum = () => {
  return useQuery({
    queryKey: [ALBUMS],
    queryFn: getRecentAlbum,
  });
};

const useGettrendingAlbum = () => {
  return useQuery({
    queryKey: [ALBUMS],
    queryFn: getTrendingAlbum,
  });
};

const useGetMadeForYouAlbum = () => {
  return useQuery({
    queryKey: [ALBUMS],
    queryFn: getmadeForYougAlbum,
  });
};

const useGetSingleAlbum = (slug: string) => {
  return useQuery({
    queryKey: [ALBUMS, slug],
    queryFn: () => getSingleAlbum(slug),
  });
};

const useGetArtistAlbum = () => {
  return useQuery({
    queryKey: [ARTIST_ALBUM],
    queryFn: getArtistAlbum,
  });
};

const useGetArtistSingleAlbum = (slug: string) => {
  return useQuery({
    queryKey: [ARTIST_ALBUM, slug],
    queryFn: () => getSingleArtistAlbum(slug),
  });
};

const useUpdateAlbum = () => {
  const { queryClient } = useGlobalHooks();
  return useMutation({
    mutationFn: ({ slug, formData }: { slug: string; formData: FormData }) =>
      updateAlbum(slug, formData),
    onSuccess: (data) => {
      if (data.message) {
        toast.success(data.message);
        queryClient.invalidateQueries({ queryKey: [ALBUMS] });
        queryClient.invalidateQueries({ queryKey: [ARTIST_ALBUM] });
      }
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        const msg = error?.response?.data?.message;
        toast.error(msg);
      }
    },
  });
};

const useDeleteAlbum = (albumId: string, slug: string) => {
  const { queryClient } = useGlobalHooks();
  return useMutation({
    mutationFn: () => deleteAlbum(albumId, slug),
    onSuccess: (data) => {
      if (data.message) {
        toast.success(data.message);
        queryClient.invalidateQueries({ queryKey: [ALBUMS] });
        queryClient.invalidateQueries({ queryKey: [ARTIST_ALBUM] });
      }
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        const msg = error?.response?.data?.message;
        toast.error(msg);
      }
    },
  });
};

const usePublishUnPublishAlbum = (albumId: string, slug: string) => {
  const { queryClient } = useGlobalHooks();
  return useMutation({
    mutationFn: () => publishUnpublishAlbum(albumId, slug),
    onSuccess: (data) => {
      if (data.message) {
        toast.success(data.message);
        queryClient.invalidateQueries({ queryKey: [ALBUMS] });
        queryClient.invalidateQueries({ queryKey: [ARTIST_ALBUM] });
      }
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        const msg = error?.response?.data?.message;
        toast.error(msg);
      }
    },
  });
};

export {
  useCreateAlbum,
  useGetAllAlbums,
  useGetRecentAlbum,
  useGettrendingAlbum,
  useGetMadeForYouAlbum,
  useGetSingleAlbum,
  useGetArtistAlbum,
  useGetArtistSingleAlbum,
  useUpdateAlbum,
  useDeleteAlbum,
  usePublishUnPublishAlbum,
};
