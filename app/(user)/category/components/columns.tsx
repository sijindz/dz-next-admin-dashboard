import { ColumnDef } from "@tanstack/react-table";
import { DataTableRowActions } from "./table-row-actions";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Category = {
    id: number
    name: string
  }

export const categoryColumns: ColumnDef<Category>[] = [
    {
      accessorKey: "name",
      header: "Category Name",
    },
    {
      id: "actions",
      cell: ({ row }) => <DataTableRowActions row={row.original}/>
    }
  ]