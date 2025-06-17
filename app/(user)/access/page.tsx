
'use client';
import { Card, CardContent } from '@/components/ui/card'
import { DataTable } from '@/components/ui/custom/data-table'
import Loader from '@/components/ui/custom/loader';
import { ColumnDef } from '@tanstack/react-table'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { BsFillPlusCircleFill } from 'react-icons/bs'
import { DataTableRowActions } from './components/table-row-actions';
import { commonDataTableFetch } from '@/lib/form-helper';
import { useRouter } from 'next/navigation';
import { Role } from '../role/page';



export type Access = {
    id: string
    path: string
    roles: Role[]
}

export const columns: ColumnDef<Access>[] = [
    {
        accessorKey: "path",
        header: "Path"
    },
    {
        id: 'role.name',
        accessorFn: row => row.roles?.map((role=>{return role.role})).join(', ') ?? '',
        header: "Roles",
      },
    {
        id: "actions",
        cell: ({ row }) => <DataTableRowActions row={row.original}/>
    }
]

const AccessPage = () => {
    const PAGE_TITLE = "Accesses";
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [accesses, setAccesses] = useState();

    useEffect(() => {
        const loadData = async () => {            
          const data= await commonDataTableFetch('access/get-all', () => {
            router.push('/login');                
            });
            setAccesses(data);
            setLoading(false);
        }
        loadData();
    }, []);

    return (
        <Card className="w-full">
            <CardContent>
                <div className="flex justify-between pt-5 pb-10">
                    <h2 className="text-3xl font-bold tracking-tight">{PAGE_TITLE}</h2>
                    <Link href={'/access/new'}><BsFillPlusCircleFill className="text-3xl" /></Link>
                </div>
                <div className="overflow-x">
                    {(!loading && accesses) ? <DataTable data={accesses} columns={columns} ></DataTable> : <Loader loading={loading} />}
                </div>
            </CardContent>
        </Card>
    )
}

export default AccessPage