import { ColumnDef } from "@tanstack/react-table";
import { DataTableRowActions } from "./table-row-actions";
import { Category } from "../../category/components/columns";
import { Language } from "../../language/components/columns";
import { Author } from "../../author/components/columns";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Book = {
  id: number
  name: string
  author: Author
  category: Category
  language: Language
}

export const bookColumns: ColumnDef<Book>[] = [
  {
    accessorKey: "name",
    header: "Book title",
  },
  {
    id: "author.firstName",
    accessorKey: "author",
    header: "Author",
    accessorFn: row => row.author?.firstName ?? '',
  },
  {
    id: "category.name",
    accessorKey: "category",
    header: "Genre",
    accessorFn: row => row.category?.name ?? '',
  },
  {
    id: "language.name",
    accessorKey: "language",
    header: "Language",
    accessorFn: row => row.language?.name ?? '',
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row.original} />
  }
]