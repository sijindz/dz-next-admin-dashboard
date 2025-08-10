import { Input } from "@/components/ui/input"
import { Column } from "@tanstack/react-table"
import { Table as ReactTable } from "@tanstack/react-table"
export function DataTableFilter({
    column,
    table,
}: {
    column: Column<any, any>
    table: ReactTable<any>
}) {
    const firstValue = table
        .getPreFilteredRowModel()
        .flatRows[0]?.getValue(column.id)

    const columnFilterValue = column.getFilterValue()
    //console.debug("filter render......")
    return (typeof firstValue === 'number') || column.columnDef?.meta=== 'number' ?(
        <div className="flex space-x-2">
            <Input
                type="number"
                value={((columnFilterValue ?? '') as number)}
                onChange={e =>
                    column.setFilterValue(() => [
                        e.target.value                        
                    ])
                }
                placeholder={`Search...`}
                className="w-24 border shadow rounded"
            />
        </div>
    ) : (
        <Input type="text"
            value={(columnFilterValue ?? '') as string}
            onChange={e => column.setFilterValue(e.target.value)}
            placeholder={`Search...`} />
    )
}