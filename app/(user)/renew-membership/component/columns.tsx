import { ColumnDef } from "@tanstack/react-table";
import { DataTableRowActions } from "./table-row-actions";
import { Member } from "../../member/components/columns";
import { Membership } from "../../membership/components/columns";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type RenewMembership = {
    id: number
    member: Member,
    membership:Membership,
    amount:number,
    renewDate:string,
    expiryDate:string
  }

export const renewMembershipColumns: ColumnDef<RenewMembership>[] = [
    {     
      id: 'member.name', 
      accessorFn: row => row.member?.firstName ?? '',
      header: "Member Name",    
    },
    {
      id: 'membership.membershipName',
      accessorFn: row => row.membership?.membershipName ?? '',
      header: "Membership Name",
    },
    {
      accessorKey: "renewDate",
      header: "Renewal Date",
      enableColumnFilter:false
    },
    {
      accessorKey: "expiryDate",
      header: "Expiry Date",
      enableColumnFilter:false
    },
    {
      accessorKey: "amount",
      header: "Amount",
      enableColumnFilter:false
    },
    {
      id: "actions",
      cell: ({ row }) => <DataTableRowActions row={row.original}/>
    }
  ]