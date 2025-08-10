'use client'
import { DzDataTable } from "@/components/custom/table/data-table";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import React from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { categoryColumns } from "./components/columns";
import { BsFillPlusCircleFill } from "react-icons/bs";
import { ColumnFilter } from "@tanstack/react-table";
import { FilterCondition } from "@/types/type";
import { commonDataTableFetch } from "@/lib/axios-utils";
import { useRouter } from "next/navigation";

const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
      },
    },
  });
  
const PAGE_TITLE="Category";
export default function CategoryPage() {
    const router = useRouter();
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
        console.log("Category table fetch.......");
        return commonDataTableFetch("category/filtered-list-by-page?index=" + options.pageIndex + '&size=' + options.pageSize, filterConditionArray, () => {
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
                                <Link href={'/category/new'}><BsFillPlusCircleFill className="text-3xl" /></Link>
                            </div>
                            <div className="overflow-x">
                            <DzDataTable columns={categoryColumns} fetchData={loadData} />
                            </div>
                        </CardContent>
                    </Card>
            </QueryClientProvider>
        </React.StrictMode>
    )
}