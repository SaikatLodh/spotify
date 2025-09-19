import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useDeletePlaylist } from "@/hooks/react-query/react-hooks/playlist/playListHook";

interface DeletePlaylistDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  playlistSlug?: string;
  playlistTitle?: string;
}

const DeletePlaylistDialog = ({
  open,
  onOpenChange,
  playlistSlug,
  playlistTitle,
}: DeletePlaylistDialogProps) => {
  const { mutate: deletePlaylist, isPending } = useDeletePlaylist(
    playlistSlug || ""
  );

  const handleDelete = () => {
    if (playlistSlug) {
      deletePlaylist();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-zinc-900 border-zinc-700">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-500">
            <Trash2 className="h-5 w-5" />
            Delete Playlist
          </DialogTitle>
          <DialogDescription className="text-zinc-300">
            Are you sure you want to delete the playlist &ldquo;{playlistTitle}
            &rdquo;? This action cannot be undone and all songs in this playlist
            will be removed.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange?.(false)}
            className="bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-700"
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700 text-white"
            disabled={isPending}
          >
            {isPending ? "Deleting..." : "Delete Playlist"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeletePlaylistDialog;
