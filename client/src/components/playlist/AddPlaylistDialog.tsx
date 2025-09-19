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
import { Upload } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  useCreatePlaylist,
  useUpdatePlaylist,
} from "@/hooks/react-query/react-hooks/playlist/playListHook";

type PlaylistFormData = {
  title: string;
  imageFile?: FileList;
};

interface AddPlaylistDialogProps {
  trigger?: React.ReactNode;
  onSuccess?: () => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  isEditMode?: boolean;
  playlistData?: {
    _id?: string;
    title?: string;
    slug: string;
    imageUrl?: { url: string };
  } | null;
}

const AddPlaylistDialog = ({
  trigger,
  onSuccess,
  open,
  onOpenChange,
  isEditMode = false,
  playlistData = null,
}: AddPlaylistDialogProps) => {
  const [playlistDialogOpen, setPlaylistDialogOpen] = useState(false);
  const isControlled = open !== undefined;
  const dialogOpen = isControlled ? open : playlistDialogOpen;
  const setDialogOpen = isControlled
    ? (val: boolean) => onOpenChange?.(val)
    : setPlaylistDialogOpen;
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const imageFileInputRef = useRef<HTMLInputElement>(null);

  const { mutate: createMutate, isPending: isCreating } = useCreatePlaylist();
  const { mutate: updateMutate, isPending: isUpdating } = useUpdatePlaylist();

  const playlistSchema = z.object({
    title: z
      .string()
      .min(3, "Title must be at least 3 characters")
      .max(50, "Title must be at most 50 characters"),
    imageFile: z
      .instanceof(FileList)
      .refine(
        (list) =>
          !list || list.length === 0 || list[0].type.startsWith("image/"),
        "Must be an image file"
      )
      .optional(),
  });

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm<PlaylistFormData>({
    resolver: zodResolver(playlistSchema),
  });

  useEffect(() => {
    if (dialogOpen && isEditMode && playlistData) {
      setValue("title", playlistData.title || "");
      if (playlistData.imageUrl?.url) {
        setImagePreview(playlistData.imageUrl.url);
      } else {
        setImagePreview(null);
      }
    } else if (!dialogOpen) {
      reset();
      setImagePreview(null);
    }
  }, [dialogOpen, isEditMode, playlistData, reset, setValue]);

  const onSubmit = (data: PlaylistFormData) => {
    const formData = new FormData();
    formData.append("title", data.title);
    if (data.imageFile && data.imageFile.length > 0) {
      formData.append("image", data.imageFile[0]);
    }

    if (isEditMode && playlistData && playlistData._id) {
      updateMutate(
        { data: formData, slug: playlistData.slug },
        {
          onSuccess: () => {
            setDialogOpen(false);
            reset();
            setImagePreview(null);
            onSuccess?.();
          },
        }
      );
    } else {
      createMutate(formData, {
        onSuccess: () => {
          setDialogOpen(false);
          reset();
          setImagePreview(null);
          onSuccess?.();
        },
      });
    }
  };

  const watchedImageFile = watch("imageFile");

  useEffect(() => {
    if (watchedImageFile && watchedImageFile.length > 0) {
      const file = watchedImageFile[0];
      const url = URL.createObjectURL(file);
      setImagePreview(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setImagePreview(null);
    }
  }, [watchedImageFile]);

  const handleImageFileButtonClick = () => {
    imageFileInputRef.current?.click();
  };

  const { ref: imageRegRef, ...imageRegProps } = register("imageFile");

  useEffect(() => {
    if (!dialogOpen) {
      reset();
      setImagePreview(null);
    }
  }, [dialogOpen, reset]);

  return (
    <>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}

        <DialogContent className="bg-zinc-900 border-zinc-700">
          <DialogHeader>
            <DialogTitle>
              {isEditMode ? "Edit Playlist" : "Add New Playlist"}
            </DialogTitle>
            <DialogDescription>
              {isEditMode
                ? "Edit your playlist details"
                : "Add a new playlist to your collection"}
            </DialogDescription>
          </DialogHeader>
          <form
            id="playlist-form"
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4 py-4"
          >
            <div className="space-y-2">
              <label className="text-sm font-medium">Playlist Title</label>
              <Input
                {...register("title")}
                className="bg-zinc-800 border-zinc-700 mt-2"
                placeholder="Enter playlist title"
              />
              {errors.title && (
                <p className="text-red-500 text-xs">{errors.title.message}</p>
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={(el) => {
                imageRegRef(el);
                imageFileInputRef.current = el;
              }}
              {...imageRegProps}
            />
            <div
              className="flex items-center justify-center p-6 border-2 border-dashed border-zinc-700 rounded-lg cursor-pointer"
              onClick={handleImageFileButtonClick}
            >
              <div className="text-center">
                <div className="p-3 bg-zinc-800 rounded-full inline-block mb-2">
                  <Upload className="h-6 w-6 text-zinc-400" />
                </div>
                <div className="text-sm text-zinc-400 mb-2">
                  Upload playlist image (optional)
                </div>
                <Button
                  type="button"
                  size="sm"
                  className="text-xs text-black cursor-pointer bg-white hover:bg-white"
                >
                  Choose File
                </Button>
                {errors.imageFile && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.imageFile.message}
                  </p>
                )}
              </div>
            </div>
            {imagePreview && (
              <div className="flex flex-col items-center space-y-2">
                <div className="text-sm text-zinc-400">
                  {watchedImageFile && watchedImageFile.length > 0
                    ? `Selected file: ${watchedImageFile[0].name}`
                    : "Current image"}
                </div>
                <img
                  src={imagePreview}
                  alt="Playlist image"
                  className="w-20 h-20 object-cover rounded border border-zinc-600 rounded-2xl"
                />
              </div>
            )}
          </form>
          <DialogFooter>
            <Button
              type="button"
              onClick={() => setDialogOpen(false)}
              className="text-black cursor-pointer bg-white hover:bg-white"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              form="playlist-form"
              className="bg-[#4CAF50] text-white cursor-pointer"
              disabled={isCreating || isUpdating}
            >
              {isCreating || isUpdating
                ? isEditMode
                  ? "Updating..."
                  : "Adding..."
                : isEditMode
                ? "Update Playlist"
                : "Add Playlist"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AddPlaylistDialog;
