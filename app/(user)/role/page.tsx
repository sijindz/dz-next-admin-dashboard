
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



export type Role = {
    id: string
    role: string
}

const RolePage = () => {
    const PAGE_TITLE = "Roles";
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [roles, setRoles] = useState();
    console.log("RolePage called");
    const loadData = async () => {
        const data = await commonDataTableFetch('role/get-all', () => {
            router.push('/login');
            router.refresh();
        });
        setRoles(data);
        setLoading(false);
    }
    useEffect(() => {
        console.log("RolePage useEffect called");
        if (roles == null) {
            loadData();
        }
    }, []);

    const columns: ColumnDef<Role>[] = [
        {
            accessorKey: "role",
            header: "Role"
        },
        {
            id: "actions",
            cell: ({ row }) => <DataTableRowActions row={row.original} toggleReload={() => loadData()} />
        }
    ]

    return (
        <Card className="w-full">
            <CardContent>
                <div className="flex justify-between pt-5 pb-10">
                    <h2 className="text-3xl font-bold tracking-tight">{PAGE_TITLE}</h2>
                    <Link href={'/role/new'}><BsFillPlusCircleFill className="text-3xl" /></Link>
                </div>
                <div className="overflow-x">
                    {(!loading && roles) ? <DataTable data={roles} columns={columns} ></DataTable> : <Loader loading={loading} />}
                </div>
            </CardContent>
        </Card>
    )
}

export default RolePage