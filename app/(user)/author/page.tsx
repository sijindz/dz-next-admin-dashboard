'use client'
import { DzDataTable } from "@/components/custom/table/data-table";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import React, { useEffect, useState } from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Author } from "./components/columns";
import { BsFillPlusCircleFill } from "react-icons/bs";
import { ColumnDef, ColumnFilter } from "@tanstack/react-table";
import { FilterCondition } from "@/types/type";
import { useRouter } from "next/navigation";
import { commonDataTableFetch } from "@/lib/axios-utils";
import { DataTableRowActions } from "./components/table-row-actions";



const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
        },
    },
});


const PAGE_TITLE = "Authors";
export default function AuthorPage() {
    const [toggleTableReload, setToggleTableReload] = useState(false);

    const router = useRouter();

    function refreshTable() {
        setToggleTableReload(old => !old);
    }

    const authorColumns: ColumnDef<Author>[] = [
        {
            accessorKey: "firstName",
            header: "First Name",
        },
        {
            accessorKey: "lastName",
            header: "Last Name",
        },
        {
            accessorKey: "personalData",
            header: "Personal Data",
        },
        {
            id: "actions",
            cell: ({ row }) => <DataTableRowActions row={row.original} reloadTable={refreshTable} />
        }
    ]

    const loadData = async (options: {
        pageIndex: number
        pageSize: number
        columnFilters: ColumnFilter[]
    }) => {
        const filterConditionArray: FilterCondition[] = [];
        options.columnFilters.map((filterVal) => {
            filterConditionArray.push({
                "attribute": filterVal.id?.toString() ?? "",
                "operator": "=?",
                "value": filterVal.value?.toString() ?? "",
                "type": "AND"
            })
        })
        console.log("Author table fetch.......");
        return commonDataTableFetch("author/filtered-list-by-page?index=" + options.pageIndex + '&size=' + options.pageSize, filterConditionArray, () => {
            router.push("/login");
        })
    }


    return (
        <React.StrictMode>
            <QueryClientProvider client={queryClient}>
                <Card className="w-full">
                    <CardContent>
                        <div className="flex justify-between pt-5 pb-10">
                            <h2 className="text-3xl font-bold tracking-tight">{PAGE_TITLE}</h2>
                            <Link href={'/author/new'}><BsFillPlusCircleFill className="text-3xl" /></Link>
                        </div>
                        <div className="">
                            <DzDataTable columns={authorColumns} fetchData={loadData} toggleReload={toggleTableReload} />
                        </div>
                    </CardContent>
                </Card>
            </QueryClientProvider>
        </React.StrictMode>
    )
}