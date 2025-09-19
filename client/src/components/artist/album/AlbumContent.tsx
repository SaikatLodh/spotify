import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Library } from "lucide-react";
import AddAlbumDialog from "./AddAlbumDialog";
import AlbumTable from "./AlbumTable";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useDebounce } from "use-debounce";

const AlbumContent = () => {
  const [search, setSearch] = useState("");
  const [value] = useDebounce(search, 1000);
  return (
    <>
      <Card className="bg-zinc-800/50 border-zinc-700/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-white text-2xl">
                <Library className="h-7 w-7 text-violet-500" />
                <h6> Albums Library</h6>
              </CardTitle>
              <CardDescription className="mt-1">
                Manage your album collection
              </CardDescription>
            </div>
            <div className="flex items-center gap-6">
              <div>
                <Input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full text-white font-bold"
                  placeholder="Search in your playlist"
                />
              </div>
              <AddAlbumDialog />
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <AlbumTable value={value} />
        </CardContent>
      </Card>
    </>
  );
};

export default AlbumContent;
