import { ColumnDef } from "@tanstack/react-table";
import { DataTableRowActions } from "./table-row-actions";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Publisher = {
    id: number
    name: string
  }

export const publisherColumns: ColumnDef<Publisher>[] = [
    {
      accessorKey: "name",
      header: "Publisher Name",
    },
    {
      id: "actions",
      cell: ({ row }) => <DataTableRowActions row={row.original}/>
    }
  ]