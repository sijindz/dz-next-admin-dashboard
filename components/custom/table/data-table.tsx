"use client"
import {
    ColumnDef,
    ColumnFilter,
    ColumnFiltersState,
    PaginationState,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table"



import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { DataTablePagination } from "./data-table-pagination"
import React, { useRef } from "react"
import { useQuery } from "@tanstack/react-query"

import { DataTableFilter } from "./data-table-filter"

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    fetchData: (options: {
        pageIndex: number
        pageSize: number
        columnFilters: ColumnFilter[]
    }) => any,
    toggleReload?: any
}

export function DzDataTable<TData, TValue>({
    columns,
    fetchData,
    toggleReload
}: DataTableProps<TData, TValue>) {

    const isFirstRender = useRef(true);
    const [{ pageIndex, pageSize }, setPagination] =
        React.useState<PaginationState>({
            pageIndex: 0,
            pageSize: 10,
        })


    const pagination = React.useMemo(
        () => ({
            pageIndex,
            pageSize,
        }),
        [pageIndex, pageSize]
    )

    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
        []
    )

    const fetchDataOptions = {
        pageIndex,
        pageSize,
        columnFilters
    }

    const dataQuery = useQuery({
        queryKey: ['data', fetchDataOptions],
        queryFn: async () => {
            console.log("table data query executed...")
            return fetchData(fetchDataOptions);
        },
        placeholderData: true  // renamed from keepPreviousData in v5
    });
    const defaultData = React.useMemo(() => [], [])

    const table = useReactTable({
        data: dataQuery.data?.content ?? defaultData,
        pageCount: dataQuery.data?.totalPages ?? -1,
        columns,
        manualPagination: true,
        manualFiltering: true,
        state: {
            pagination,
            columnFilters
        },
        onPaginationChange: setPagination,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        debugTable: false,
    })

    React.useEffect(() => {
        table.setPageIndex(0);
    }, [columnFilters]);

    React.useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
        } else {
            dataQuery.refetch();
            console.log("Reload toggled");
        }
    }, [toggleReload]);

    return (
        <div className="w-full">
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableCell key={header.id}>
                                            {header.column.getCanFilter() ? (
                                                <div>
                                                    <DataTableFilter column={header.column} table={table} />
                                                </div>
                                            ) : null}
                                        </TableCell>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <DataTablePagination table={table} />
            {dataQuery.isFetching ? 'Loading...' : null}
        </div>
    )
}
