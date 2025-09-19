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
import { useDeleteSong } from "@/hooks/react-query/react-hooks/song/songHook";

interface DeleteSongDialogProps {
  isOpen: boolean;
  onClose: () => void;
  song: {
    _id: string;
    title: string;
    albumid: string;
  } | null;
}

const DeleteSongDialog = ({ isOpen, onClose, song }: DeleteSongDialogProps) => {
  const { mutate: deletesong, isPending } = useDeleteSong(
    song?._id || "",
    song?.albumid || ""
  );

  const handleDelete = () => {
    if (song) {
      deletesong(undefined, {
        onSuccess: () => {
          onClose();
        },
      });
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="bg-zinc-900 border-zinc-700">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Trash2 className="h-5 w-5 text-red-400" />
              Delete Album
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the song &apos;{song?.title}
              &apos;? This action cannot be undone.
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
    </>
  );
};

export default DeleteSongDialog;
