import { TableCell, TableRow } from "@/components/ui/table";

const AlbumTableSkeleton = () => {
  // Render 5 rows of skeleton placeholders
  const rows = Array.from({ length: 5 });

  return (
    <>
      {rows.map((_, index) => (
        <TableRow key={index} className="hover:bg-zinc-800/50">
          <TableCell>
            <div className="w-10 h-10 rounded bg-zinc-700 animate-pulse" />
          </TableCell>
          <TableCell>
            <div className="h-4 w-24 rounded bg-zinc-700 animate-pulse" />
          </TableCell>
          <TableCell>
            <div className="h-4 w-20 rounded bg-zinc-700 animate-pulse" />
          </TableCell>
          <TableCell>
            <div className="h-4 w-16 rounded bg-zinc-700 animate-pulse" />
          </TableCell>
          <TableCell>
            <div className="h-4 w-16 rounded bg-zinc-700 animate-pulse" />
          </TableCell>
          <TableCell className="text-right">
            <div className="h-6 w-20 rounded bg-zinc-700 animate-pulse inline-block" />
          </TableCell>
        </TableRow>
      ))}
    </>
  );
};

export default AlbumTableSkeleton;
