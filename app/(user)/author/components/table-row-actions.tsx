"use client"

import { RxDotsHorizontal } from "react-icons/rx";
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Author } from "./columns";
import { useRouter } from "next/navigation";
import { BsPencilSquare, BsTrash } from "react-icons/bs";
import { AppSettings } from "@/lib/app-settings";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import axiosInterceptorInstance from "@/axiosInterceptorInstance";



export function DataTableRowActions({ row, reloadTable }: { row: Author, reloadTable: any }) {
    const MySwal = withReactContent(Swal)
    const router = useRouter();
    async function deleteRow() {
        await axiosInterceptorInstance.delete(`${AppSettings.SERVICE_URL}/author/delete?id=${row?.id}`)
            .then(function () {
                MySwal.fire({
                    title: "Deleted",
                    text: "Author deleted successfully",
                    icon: "success"
                });
                reloadTable();
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
                <DropdownMenuItem onClick={() => { router.push('/author/edit/' + row?.id) }}>
                    <BsPencilSquare className="mr-2 h-4 w-4" /> Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={deleteRow}>
                    <BsTrash className='mr-2 h-4 w-4' />Delete
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}