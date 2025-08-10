import { ColumnDef } from "@tanstack/react-table";
import { DataTableRowActions } from "./table-row-actions";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Member = {
    id: number
    firstName: string
    lastName: string
    mobile: string
    email: string
    address1: string
    address2: string
    address3: string
    membershipStatus: boolean
    membershipEndDate: string
    activeMemberShip: any
}

export const memberColumns: ColumnDef<Member>[] = [
    {
        accessorKey: "firstName",
        header: "First Name",
    },
    {
        accessorKey: "lastName",
        header: "Last Name",
    },
    {
        accessorKey: "mobile",
        header: "Mobile",
    },
    {
        accessorKey: "activeMemberShip",
        header: "Membership",
        accessorFn: row => row.activeMemberShip?.membershipName ?? '',
    },
    {
        id: "actions",
        cell: ({ row }) => <DataTableRowActions row={row.original} />
    }
]