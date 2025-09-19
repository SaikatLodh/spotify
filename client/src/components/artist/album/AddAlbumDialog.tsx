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
import Switch from "@/components/ui/switch";
import { Plus, Upload } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  useCreateAlbum,
  useUpdateAlbum,
  usePublishUnPublishAlbum,
} from "@/hooks/react-query/react-hooks/album/album";

type AlbumFormData = {
  title: string;
  artistName: string;
  imageFile?: FileList;
};

interface AddAlbumDialogProps {
  album?: {
    _id: string;
    title: string;
    artistName: string;
    imageUrl: { url: string };
    slug: string;
    isPublished?: boolean;
  };
  trigger?: React.ReactNode;
  onSuccess?: () => void;
}

const PublishSwitch = ({
  album,
}: {
  album: { _id: string; slug: string; isPublished?: boolean };
}) => {
  const { mutate, isPending } = usePublishUnPublishAlbum(album._id, album.slug);

  return (
    <Switch
      checked={album.isPublished || false}
      onChange={() => mutate()}
      disabled={isPending}
    />
  );
};

const AddAlbumDialog = ({ album, trigger, onSuccess }: AddAlbumDialogProps) => {
  const isEditing = !!album;
  const [albumDialogOpen, setAlbumDialogOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { mutate: createMutate, isPending: createPending } = useCreateAlbum();
  const { mutate: updateMutate, isPending: updatePending } = useUpdateAlbum();

  const isPending = createPending || updatePending;

  const albumSchema = z.object({
    title: z
      .string()
      .min(3, "Title must be at least 3 characters")
      .max(50, "Title must be at most 50 characters"),
    artistName: z
      .string()
      .min(3, "Artist name must be at least 3 characters")
      .max(50, "Artist name must be at most 50 characters"),
    imageFile: z
      .instanceof(FileList)
      .optional()
      .refine((list) => {
        if (isEditing) return true;
        return list && list.length > 0 && list[0].type.startsWith("image/");
      }, "Image is required and must be an image file"),
  });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<AlbumFormData>({
    resolver: zodResolver(albumSchema),
    defaultValues: {
      title: album?.title || "",
      artistName: album?.artistName || "",
    },
  });

  useEffect(() => {
    if (album) {
      setValue("title", album.title);
      setValue("artistName", album.artistName);
      setImagePreview(album.imageUrl.url);
    }
  }, [album, setValue]);

  const onSubmit = (data: AlbumFormData) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("artistName", data.artistName);
    if (data.imageFile && data.imageFile.length > 0) {
      formData.append("imageFile", data.imageFile[0]);
    }

    if (isEditing && album) {
      updateMutate(
        { slug: album.slug, formData },
        {
          onSuccess: () => {
            setAlbumDialogOpen(false);
            reset();
            setImagePreview(null);
            onSuccess?.();
          },
        }
      );
    } else {
      createMutate(formData, {
        onSuccess: () => {
          setAlbumDialogOpen(false);
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
    } else if (!isEditing) {
      setImagePreview(null);
    }
  }, [watchedImageFile, isEditing]);

  const handleFileButtonClick = () => {
    fileInputRef.current?.click();
  };

  const { ref: regRef, ...regProps } = register("imageFile");

  useEffect(() => {
    if (!albumDialogOpen) {
      reset();
      setImagePreview(null);
    }
  }, [albumDialogOpen,reset]);

  return (
    <>
      <Dialog open={albumDialogOpen} onOpenChange={setAlbumDialogOpen}>
        <DialogTrigger asChild>
          {trigger || (
            <Button className="bg-[#4CAF50] text-white cursor-pointer">
              <Plus className="mr-2 h-4 w-4" />
              Add Album
            </Button>
          )}
        </DialogTrigger>
        <DialogContent className="bg-zinc-900 border-zinc-700">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Edit Album" : "Add New Album"}
            </DialogTitle>
            <DialogDescription>
              {isEditing
                ? "Update album information"
                : "Add a new album to your collection"}
            </DialogDescription>
          </DialogHeader>
          <form
            id="album-form"
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4 py-4"
          >
            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={(el) => {
                regRef(el);
                fileInputRef.current = el;
              }}
              {...regProps}
            />
            <div
              className="flex items-center justify-center p-6 border-2 border-dashed border-zinc-700 rounded-lg cursor-pointer"
              onClick={handleFileButtonClick}
            >
              <div className="text-center">
                <div className="p-3 bg-zinc-800 rounded-full inline-block mb-2">
                  <Upload className="h-6 w-6 text-zinc-400" />
                </div>
                <div className="text-sm text-zinc-400 mb-2">
                  {isEditing ? "Change album artwork" : "Upload album artwork"}
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
                    : "Current artwork"}
                </div>
                <img
                  src={imagePreview}
                  alt="Album artwork"
                  className="w-20 h-20 object-cover rounded border border-zinc-600 rounded-2xl"
                />
              </div>
            )}
            <div className="space-y-2">
              <label className="text-sm font-medium">Album Title</label>
              <Input
                {...register("title")}
                className="bg-zinc-800 border-zinc-700 mt-2"
                placeholder="Enter album title"
              />
              {errors.title && (
                <p className="text-red-500 text-xs">{errors.title.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Artist Name</label>
              <Input
                {...register("artistName")}
                className="bg-zinc-800 border-zinc-700 mt-2"
                placeholder="Enter artist name"
              />
              {errors.artistName && (
                <p className="text-red-500 text-xs">
                  {errors.artistName.message}
                </p>
              )}
            </div>
            {isEditing && (
              <div className="flex items-center gap-2 mt-2">
                <label className="text-sm font-medium">Publish Status</label>
                <PublishSwitch album={album} />
              </div>
            )}
          </form>
          <DialogFooter>
            <Button
              type="button"
              onClick={() => setAlbumDialogOpen(false)}
              className="text-black cursor-pointer bg-white hover:bg-white"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              form="album-form"
              className="bg-[#4CAF50] text-white cursor-pointer"
              disabled={isPending}
            >
              {isPending
                ? isEditing
                  ? "Updating..."
                  : "Adding..."
                : isEditing
                ? "Update Album"
                : "Add Album"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AddAlbumDialog;
