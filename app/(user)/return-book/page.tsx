'use client';

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ColumnDef, ColumnFilter } from "@tanstack/react-table";
import Link from "next/link";
import { BsArrowReturnLeft } from "react-icons/bs";
import { Card, CardContent } from "@/components/ui/card";
import { DzDataTable } from "@/components/custom/table/data-table";
import { FilterCondition } from "@/types/type";
import { commonDataTableFetch } from "@/lib/axios-utils";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import axiosInterceptorInstance from "@/axiosInterceptorInstance";
import { ENDPOINT_ISSUE_BOOK } from "@/constants/api-constants";
import { IssueBook } from "../issue-book/components/IssueBookType";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
        },
    },
});

export const dynamic = 'force-dynamic';

export default function ReturnBookPage() {
    const router = useRouter();
    const MySwal = withReactContent(Swal);

    function retrurnBookHandler(bookNumber: string) {
        MySwal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, return book!"
        }).then((result) => {
            if (result.isConfirmed) {
                retrurnBook(bookNumber);
            }
        });
    }

    const retrurnBook = async (bookNumber: string) => {
        try {
            const returnBookRq = { "bookNumber": bookNumber };
            const res = await axiosInterceptorInstance.post(`${ENDPOINT_ISSUE_BOOK}/return`, returnBookRq);
            console.log(res)
            if (res.data.status) {
                queryClient.refetchQueries();
                MySwal.fire({
                    position: 'top-right',
                    icon: 'success',
                    title: 'Book Returned!',
                    showConfirmButton: false,
                    timer: 1000
                });
            }
        }
        catch (ex: any) {
            MySwal.fire({
                title: "Error!",
                html: <div>{ex.response.data.errors?.map((err: any) => {
                    return <p>{err.message}</p>;
                })}</div>,
                icon: "error"
            });
            console.log(ex?.response?.data?.errors);
        }
    }

    const returnBookColumns: ColumnDef<IssueBook>[] = [
        {
            accessorFn: row => row?.bookEntry?.bookNumber ?? '',
            header: "Book Number",
        },
        {
            accessorFn: row => row.bookEntry?.book?.name ?? '',
            header: "Book Name",
        },
        {
            accessorFn: row => row?.bookEntry?.book?.author?.firstName ?? '',
            header: "Author",
            enableColumnFilter: false
        },
        {
            accessorFn: row => row?.member?.firstName ?? '',
            header: "Active Member",
            enableColumnFilter: false
        },
        {
            id: "actions",
            cell: ({ row }) => <Link href='#' title="Add Book" onClick={(e) => { e.preventDefault(); retrurnBookHandler(row.original?.bookEntry?.bookNumber)}}><BsArrowReturnLeft className="text-2xl font-extrabold hover:text-red-800" /></Link>
        }
    ];

    const loadData = async (options: {
        pageIndex: number
        pageSize: number
        columnFilters: ColumnFilter[]
    }) => {

        const filterConditionArray: FilterCondition[] = [];
        filterConditionArray.push({
            "attribute": "returnStatus",
            "operator": "=",
            "value": "false",
            "type": "AND"
        });
        
        options.columnFilters.map((filterVal) => {

            let attribute = filterVal.id?.toString();
            if (filterVal.id == 'Book Number') {
                attribute = "bookEntry.bookNumber"
            }
            else if (filterVal.id == 'Book Name') {
                attribute = "bookEntry.book.name"
            }
            else if (filterVal.id == "Current Member") {
                attribute = "activeMember.firstName"
            }

            filterConditionArray.push({
                "attribute": attribute ?? "",
                "operator": "=?",
                "value": filterVal.value?.toString() ?? "",
                "type": "AND"
            })
        })

        console.log("Book table fetch.......");
        return commonDataTableFetch("issue-book/filtered-list-by-page?index=" + options.pageIndex + '&size=' + options.pageSize, filterConditionArray, () => {
            router.push("/login");
        })
    }

    return (
        <QueryClientProvider client={queryClient}>
            <Card className="w-full">
                <CardContent>
                    <div className="flex justify-between pt-5 pb-10">
                        <h2 className="text-3xl font-bold tracking-tight">Return Book</h2>
                    </div>
                    <div className="">
                        <DzDataTable columns={returnBookColumns} fetchData={loadData}/>
                    </div>
                </CardContent>
            </Card>
        </QueryClientProvider>
    );
}