"use client"

import { RxDotsHorizontal } from "react-icons/rx";
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Member } from "./columns";
import { BsPencilSquare, BsTrash } from "react-icons/bs";
import { useRouter } from "next/navigation";
import axiosInterceptorInstance from "@/axiosInterceptorInstance";
import { AppSettings } from "@/lib/app-settings";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";




export function DataTableRowActions({ row }: { row: Member }) {
    const router = useRouter();
    const MySwal = withReactContent(Swal);
    
    async function deleteRow() {
        await axiosInterceptorInstance.delete(`${AppSettings.SERVICE_URL}/member/delete?id=${row?.id}`)
            .then(function () {               
                router.refresh();
                MySwal.fire({
                    title: "Deleted",
                    text: "Member deleted successfully",
                    icon: "success"
                });
            }).catch(function (ex) {
                console.error(ex);
                MySwal.fire({
                    title: "Error",
                    html: <div>{ex.response.data.errors?.map((err: any) => {
                        return <p>{err.message}</p>;
                    })}</div>,
                    icon: "error",
                    heightAuto: false
                });
            });
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
                <DropdownMenuItem onClick={() => { router.push('/member/edit/' + row?.id) }}>   
                <BsPencilSquare  className="mr-2 h-4 w-4" /> Edit           
                </DropdownMenuItem>
                <DropdownMenuItem onClick={deleteRow}>
                <BsTrash className='mr-2 h-4 w-4'/>Delete
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}