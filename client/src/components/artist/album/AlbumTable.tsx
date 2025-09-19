import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Calendar,
  Disc3,
  ListMusic,
  Music,
  Pencil,
  Trash2,
} from "lucide-react";
import { useMemo, useState } from "react";
import DeleteAlbumDialog from "./DeleteAlbumDialog";
import { useGetArtistAlbum } from "@/hooks/react-query/react-hooks/album/album";
import AlbumTableSkeleton from "./AlbumTableSkeleton";
import AddAlbumDialog from "./AddAlbumDialog";
import Link from "next/link";

const AlbumTable = ({ value }: { value: string }) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedAlbum, setSelectedAlbum] = useState<{
    _id: string;
    title: string;
    slug: string;
  } | null>(null);
  const { data, isLoading } = useGetArtistAlbum();

  const filterSearch = useMemo(() => {
    return (
      data &&
      data.filter((album) =>
        album.title.toLowerCase().includes(value.toLowerCase())
      )
    );
  }, [data, value]);

  return (
    <>
      {filterSearch && filterSearch.length <= 0 ? (
        <div className="col-span-full flex flex-col items-center justify-center py-8 rounded-md bg-zinc-800/50 w-full text-white">
          <Disc3 />
          <p className=" mt-2 font-bold">No albums found.</p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-zinc-800/50">
              <TableHead className="w-[50px]"></TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Artist</TableHead>
              <TableHead>Release Year</TableHead>
              <TableHead>Songs</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <AlbumTableSkeleton />
            ) : (
              filterSearch &&
              filterSearch.length > 0 &&
              filterSearch.map((album) => (
                <TableRow className="hover:bg-zinc-800/50" key={album._id}>
                  <TableCell>
                    <img
                      src={album.imageUrl.url}
                      alt={album.title}
                      className="w-10 h-10 rounded object-cover"
                    />
                  </TableCell>
                  <TableCell className="font-medium text-zinc-400">
                    {album.title}
                  </TableCell>
                  <TableCell className="text-zinc-400">
                    {album.artistName}
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center gap-1 text-zinc-400">
                      <Calendar className="h-4 w-4" />
                      {album.createdAt.split("T")[0]}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center gap-1 text-zinc-400">
                      <Music className="h-4 w-4" />
                      {album.songs.length} songs
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
                      <Link href={`/artist/song/${album._id}`}>
                        <Button className="bg-[#3A2B23] hover:bg-[#3A2B23] text-white cursor-pointer">
                          <ListMusic className="mr-2 h-4 w-4" />
                          Songs
                        </Button>
                      </Link>

                      <AddAlbumDialog
                        album={album}
                        trigger={
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-[#8E51FF] hover:text-[#8e51ff] hover:bg-[#8e51ff70] cursor-pointer"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        }
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-400 hover:text-red-300 hover:bg-red-400/10 cursor-pointer"
                        onClick={() => {
                          setSelectedAlbum({
                            _id: album._id,
                            title: album.title,
                            slug: album.slug,
                          });
                          setDeleteDialogOpen(true);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      )}

      <DeleteAlbumDialog
        isOpen={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false);
          setSelectedAlbum(null);
        }}
        album={selectedAlbum}
      />
    </>
  );
};

export default AlbumTable;
