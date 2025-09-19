import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Trash2 } from "lucide-react";
import { useDeleteAlbum } from "@/hooks/react-query/react-hooks/album/album";

interface DeleteAlbumDialogProps {
  isOpen: boolean;
  onClose: () => void;
  album: {
    _id: string;
    title: string;
    slug: string;
  } | null;
}

const DeleteAlbumDialog = ({
  isOpen,
  onClose,
  album,
}: DeleteAlbumDialogProps) => {
  const { mutate: deleteAlbum, isPending } = useDeleteAlbum(
    album?._id || "",
    album?.slug || ""
  );

  const handleDelete = () => {
    if (album) {
      deleteAlbum(undefined, {
        onSuccess: () => {
          onClose();
        },
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-zinc-900 border-zinc-700">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Trash2 className="h-5 w-5 text-red-400" />
            Delete Album
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete the album &apos;{album?.title}&apos;? This action
            cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            type="button"
            onClick={onClose}
            className="text-black cursor-pointer bg-white hover:bg-white"
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleDelete}
            className="bg-red-600 text-white cursor-pointer hover:bg-red-700"
            disabled={isPending}
          >
            {isPending ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteAlbumDialog;
