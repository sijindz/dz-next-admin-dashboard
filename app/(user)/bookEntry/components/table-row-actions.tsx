"use client"

import { RxDotsHorizontal } from "react-icons/rx";
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { BookEntry } from "./columns";
import { useRouter } from "next/navigation";
import { BsPencilSquare, BsTrash } from "react-icons/bs";



export function DataTableRowActions({ row }: { row: BookEntry }) {

    const router = useRouter();
    async function deleteRow() {
        console.log("Dummy Delete")
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    className="flex h-8 w-8 p-0 data-[state=open]:bg-muted">
                    <RxDotsHorizontal className="h-4 w-4" />
                    <span className="sr-only">Open menu</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[160px]">
                <DropdownMenuItem onClick={() => { router.push('/bookEntry/edit/' + row?.id) }}>   
                <BsPencilSquare  className="mr-2 h-4 w-4" /> Edit           
                </DropdownMenuItem>
                <DropdownMenuItem onClick={deleteRow}>
                <BsTrash className='mr-2 h-4 w-4'/>Delete
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}