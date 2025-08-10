import { ColumnDef } from "@tanstack/react-table";
import { DataTableRowActions } from "./table-row-actions";
import { Category } from "../../category/components/columns";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Membership = {
    id: number
    membershipName: string
    bookLimit: number
    dayLimit: number
    membershipFee: number
    categoryList: Category[]
  }

export const membershipColumns: ColumnDef<Membership>[] = [
    {
      accessorKey: "membershipName",
      header: "Membership Name",      
    },
    {
      accessorKey: "bookLimit",
      header: "Book Limit",
      meta:'number'
    },
    {
      accessorKey: "dayLimit",
      header: "Day Limit",
    },
    {
      accessorKey: "membershipFee",
      header: "Membership Fee",
    },
    {
      id: 'category.name',
      accessorFn: row => row.categoryList?.map((category=>{return category.name})).join(', ') ?? '',
      header: "Categories",
    },
    {
      id: "actions",
      cell: ({ row }) => <DataTableRowActions row={row.original}/>
    }
  ]