import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

import { Plus, Upload } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  useCreateSong,
  useUpdateSong,
} from "@/hooks/react-query/react-hooks/song/songHook";

type SongFormData = {
  title: string;
  audioFile?: FileList;
  imageFile?: FileList;
};

type SongType = {
  _id: string;
  title: string;
  albumId: string;
  audioUrl: { url: string };
  imageUrl: { url: string };
};

interface AddSongDialogProps {
  albumId: string;
  song?: SongType | null;
  trigger?: React.ReactNode;
  onSuccess?: () => void;
  onClose?: () => void;
}

const AddSongDialog = ({
  albumId,
  song,
  trigger,
  onSuccess,
  onClose,
}: AddSongDialogProps) => {
  const isEditing = !!song;
  const [songDialogOpen, setSongDialogOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [audioPreview, setAudioPreview] = useState<string | null>(null);
  const fileInputImageRef = useRef<HTMLInputElement>(null);
  const fileInputAudioRef = useRef<HTMLInputElement>(null);

  const { mutate: createMutate, isPending: createPending } = useCreateSong();
  const { mutate: updateMutate, isPending: updatePending } = useUpdateSong(
    song?._id || "",
    song?.albumId || ""
  );

  const isPending = createPending || updatePending;

  const songSchema = z.object({
    title: z
      .string()
      .min(3, "Title must be at least 3 characters")
      .max(50, "Title must be at most 50 characters"),
    audioFile: z
      .instanceof(FileList)
      .optional()
      .refine((list) => {
        if (isEditing) return true;
        return list && list.length > 0 && list[0].type.startsWith("audio/");
      }, "Audio file is required for new songs and must be an audio file"),
    imageFile: z
      .instanceof(FileList)
      .optional()
      .refine((list) => {
        if (isEditing) return true;
        return list && list.length > 0 && list[0].type.startsWith("image/");
      }, "Image file is required for new songs and must be an image file"),
  });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<SongFormData>({
    resolver: zodResolver(songSchema),
    defaultValues: {
      title: isEditing && song ? song?.title : "",
    },
  });

  useEffect(() => {
    if (song) {
      setValue("title", song.title);
      setImagePreview(song.imageUrl.url);
      setAudioPreview(song.audioUrl.url);
      setSongDialogOpen(true);
    }
  }, [song, setValue]);

  const onSubmit = (data: SongFormData) => {
    const formData = new FormData();
    formData.append("title", data.title);
    if (!isEditing && !song) formData.append("albumId", albumId);
    if (data.audioFile && data.audioFile.length > 0) {
      formData.append("audio", data.audioFile[0]);
    }
    if (data.imageFile && data.imageFile.length > 0) {
      formData.append("image", data.imageFile[0]);
    }

    if (isEditing && song) {
      updateMutate(
        { data: formData },
        {
          onSuccess: () => {
            setSongDialogOpen(false);
            reset();
            setImagePreview(null);
            setAudioPreview(null);
            onSuccess?.();
          },
        }
      );
    } else {
      createMutate(formData, {
        onSuccess: () => {
          setSongDialogOpen(false);
          reset();
          setImagePreview(null);
          setAudioPreview(null);
          onSuccess?.();
        },
      });
    }
  };

  const watchedImageFile = watch("imageFile");
  const watchedAudioFile = watch("audioFile");

  useEffect(() => {
    if (watchedImageFile && watchedImageFile.length > 0) {
      const file = watchedImageFile[0];
      const url = URL.createObjectURL(file);
      setImagePreview(url);
      return () => URL.revokeObjectURL(url);
    } else if (!isEditing) {
      setImagePreview(null);
    }
  }, [watchedImageFile, isEditing]);

  useEffect(() => {
    if (watchedAudioFile && watchedAudioFile.length > 0) {
      const file = watchedAudioFile[0];
      const url = URL.createObjectURL(file);
      setAudioPreview(url);
      return () => URL.revokeObjectURL(url);
    } else if (!isEditing) {
      setAudioPreview(null);
    }
  }, [watchedAudioFile, isEditing]);

  const handleFileImageButtonClick = () => {
    fileInputImageRef.current?.click();
  };

  const handleFileAudioButtonClick = () => {
    fileInputAudioRef.current?.click();
  };

  const { ref: regImageRef, ...regImageProps } = register("imageFile");
  const { ref: regAudioRef, ...regAudioProps } = register("audioFile");

  const handleOpenChange = (open: boolean) => {
    setSongDialogOpen(open);
    if (!open && isEditing) {
      onClose?.();
    }
  };

  useEffect(() => {
    if (!songDialogOpen) {
      reset();
      setImagePreview(null);
      setAudioPreview(null);
    }
  }, [songDialogOpen, reset]);
  return (
    <>
      <Dialog open={songDialogOpen} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>
          {trigger || (
            <Button className="bg-[#4CAF50] text-white cursor-pointer">
              <Plus className="mr-2 h-4 w-4" />
              Add Song
            </Button>
          )}
        </DialogTrigger>
        <DialogContent className="bg-zinc-900 border-zinc-700 overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Edit Song" : "Add New Song"}
            </DialogTitle>
            <DialogDescription>
              {isEditing
                ? "Update song information"
                : "Add a new song to your collection"}
            </DialogDescription>
          </DialogHeader>
          <form
            id="song-form"
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4 py-4"
          >
            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={(el) => {
                regImageRef(el);
                fileInputImageRef.current = el;
              }}
              {...regImageProps}
            />
            <div
              className="flex items-center justify-center p-6 border-2 border-dashed border-zinc-700 rounded-lg cursor-pointer"
              onClick={handleFileImageButtonClick}
            >
              <div className="text-center">
                <div className="p-3 bg-zinc-800 rounded-full inline-block mb-2">
                  <Upload className="h-6 w-6 text-zinc-400" />
                </div>
                <div className="text-sm text-zinc-400 mb-2">
                  {isEditing
                    ? "Change song thumbnail artwork"
                    : "Upload song thumbnail artwork"}
                </div>
                <Button
                  type="button"
                  size="sm"
                  className="text-xs text-black cursor-pointer bg-white hover:bg-white"
                >
                  Choose Image File
                </Button>
                {errors.imageFile && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.imageFile.message}
                  </p>
                )}
              </div>
            </div>

            <input
              type="file"
              accept="audio/*"
              className="hidden"
              ref={(el) => {
                regAudioRef(el);
                fileInputAudioRef.current = el;
              }}
              {...regAudioProps}
            />
            <div
              className="flex items-center justify-center p-6 border-2 border-dashed border-zinc-700 rounded-lg cursor-pointer"
              onClick={handleFileAudioButtonClick}
            >
              <div className="text-center">
                <div className="p-3 bg-zinc-800 rounded-full inline-block mb-2">
                  <Upload className="h-6 w-6 text-zinc-400" />
                </div>
                <div className="text-sm text-zinc-400 mb-2">
                  {isEditing ? "Change audio file" : "Upload audio file"}
                </div>
                <Button
                  type="button"
                  size="sm"
                  className="text-xs text-black cursor-pointer bg-white hover:bg-white"
                >
                  Choose Audio File
                </Button>
                {errors.audioFile && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.audioFile.message}
                  </p>
                )}
              </div>
            </div>

            {imagePreview && (
              <div className="flex flex-col items-center space-y-2">
                <div className="text-sm text-zinc-400">
                  {watchedImageFile && watchedImageFile.length > 0
                    ? `Selected image file: ${watchedImageFile[0].name}`
                    : "Current artwork"}
                </div>
                <img
                  src={imagePreview}
                  alt="Song artwork"
                  className="w-20 h-20 object-cover rounded border border-zinc-600 rounded-2xl"
                />
              </div>
            )}

            {audioPreview && (
              <div className="flex flex-col items-center space-y-2">
                <div className="text-sm text-zinc-400">
                  {watchedAudioFile && watchedAudioFile.length > 0
                    ? `Selected audio file: ${watchedAudioFile[0].name}`
                    : "Current audio"}
                </div>
                <audio controls src={audioPreview} className="w-full" />
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium">Song Title</label>
              <Input
                {...register("title")}
                className="bg-zinc-800 border-zinc-700 mt-2"
                placeholder="Enter song title"
              />
              {errors.title && (
                <p className="text-red-500 text-xs">{errors.title.message}</p>
              )}
            </div>
          </form>
          <DialogFooter>
            <Button
              type="button"
              onClick={() => setSongDialogOpen(false)}
              className="text-black cursor-pointer bg-white hover:bg-white"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              form="song-form"
              className="bg-[#4CAF50] text-white cursor-pointer"
              disabled={isPending}
            >
              {isPending
                ? isEditing
                  ? "Updating..."
                  : "Adding..."
                : isEditing
                ? "Update Song"
                : "Add Song"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AddSongDialog;
