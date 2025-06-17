"use client"

import { RxDotsHorizontal } from "react-icons/rx";
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation";
import { BsPencilSquare, BsTrash } from "react-icons/bs";
import axiosInterceptorInstance from "@/axiosInterceptorInstance";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import { User } from "../page";
import { handleAuthError } from "@/lib/form-helper";



export function DataTableRowActions({ row }: { row: User }) {
    const MySwal = withReactContent(Swal)
    const router = useRouter();
    async function deleteRow() {
        try {
            const response = await axiosInterceptorInstance.delete(`user/delete/${row?.id}`);
            console.log(response);
            router.push('/users');
            router.refresh();
            MySwal.fire({
                position: "center",
                icon: "success",
                title: "User deleted!",
                showConfirmButton: false,
                timer: 1000
            });
        } catch (error: any) {
            const callBack = (err: any) => {
                MySwal.fire({
                    title: "Error!",
                    text: "Delete operation failed",
                    html: err?.response?.data?.problemDetails[0]?.detail,
                    icon: "error",
                })
            }
            handleAuthError(error, callBack);
        }
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
                <DropdownMenuItem onClick={() => { router.push(`/users/edit/${row?.id}`) }}>
                    <BsPencilSquare className="mr-2 h-4 w-4" /> Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={deleteRow}>
                    <BsTrash className='mr-2 h-4 w-4' />Delete
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}