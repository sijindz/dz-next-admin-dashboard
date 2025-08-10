import { ColumnDef } from "@tanstack/react-table";
import { DataTableRowActions } from "./table-row-actions";
import { Book } from "../../book/components/columns";
import { Member } from "../../member/components/columns";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type BookEntry = {
    id: number
    bookNumber: string
    book:Book
    activeMember:Member
  }

export const bookEntryColumns: ColumnDef<BookEntry>[] = [
    {
      accessorKey: "bookNumber",
      header: "Book Number",
    },
    {
      accessorFn: row => row.book?.name ?? '',
      header: "Book Name",
    },
    {
      accessorFn: row => row.activeMember?.firstName ?? '',
      header: "Current Member",
    },
    {
      id: "actions",
      cell: ({ row }) => <DataTableRowActions row={row.original}/>
    }
  ]