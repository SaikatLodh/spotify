import createSong from "@/api/functions/song/createSong";
import { useGlobalHooks } from "@/hooks/globalHook";
import { useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { ARTIST_ALBUM, SONGS } from "../../react-keys/querykeys";
import axios from "axios";
import getSongBySearch from "@/api/functions/song/getSongBySearch";
import getSongByAlbum from "@/api/functions/song/getSongByAlbum";
import getSingleSong from "@/api/functions/song/getSingleSong";
import updateSong from "@/api/functions/song/updateSong";
import deleteSong from "@/api/functions/song/deleteSong";
import listenSong from "@/api/functions/song/listenSong";
import downloadSong from "@/api/functions/song/downloadSong";

const useCreateSong = () => {
  const { queryClient } = useGlobalHooks();
  return useMutation({
    mutationFn: createSong,
    onSuccess: (data) => {
      if (data.message) {
        toast.success(data.message);
        queryClient.invalidateQueries({ queryKey: [SONGS] });
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

const useGetSongBySearch = (search: string) => {
  return useQuery({
    queryKey: [SONGS, search],
    queryFn: () => getSongBySearch(search),
  });
};

const useGetSongByAlbum = (albumId: string) => {
  return useQuery({
    queryKey: [SONGS, albumId],
    queryFn: () => getSongByAlbum(albumId),
  });
};

const useGetSingleSong = (songId: string, albumId: string) => {
  return useQuery({
    queryKey: [SONGS, songId, albumId],
    queryFn: () => getSingleSong(songId, albumId),
  });
};

const useUpdateSong = (songId: string, albumId: string) => {
  const { queryClient } = useGlobalHooks();
  return useMutation({
    mutationFn: ({ data }: { data: FormData }) =>
      updateSong(songId, albumId, data),
    onSuccess: (data) => {
      if (data.message) {
        toast.success(data.message);
        queryClient.invalidateQueries({ queryKey: [SONGS] });
        queryClient.invalidateQueries({ queryKey: [SONGS, albumId] });
        queryClient.invalidateQueries({ queryKey: [SONGS, songId, albumId] });
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

const useDeleteSong = (songId: string, albumId: string) => {
  const { queryClient } = useGlobalHooks();
  return useMutation({
    mutationFn: () => deleteSong(songId, albumId),
    onSuccess: (data) => {
      if (data.message) {
        toast.success(data.message);
        queryClient.invalidateQueries({ queryKey: [SONGS] });
        queryClient.invalidateQueries({ queryKey: [SONGS, albumId] });
        queryClient.invalidateQueries({ queryKey: [SONGS, songId, albumId] });
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

const useListenSong = (songId: string) => {
  return useMutation({
    mutationFn: () => listenSong(songId),
  });
};

const useDownloadSong = () => {
  return useMutation({
    mutationFn: downloadSong,
    onSuccess: (data, publicId) => {
      if (data) {
        const url = window.URL.createObjectURL(new Blob([data]));
        const a = document.createElement("a");
        a.href = url;
        a.download = `${publicId}.mp3`; // filename
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
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
  useCreateSong,
  useGetSongBySearch,
  useGetSongByAlbum,
  useGetSingleSong,
  useUpdateSong,
  useDeleteSong,
  useListenSong,
  useDownloadSong,
};
