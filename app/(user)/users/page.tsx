
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



export type User = {
    id: string
    firstName: string
    lastName: string
    email: string
    password: string
    role: Role
}

export const columns: ColumnDef<User>[] = [
    {
        accessorKey: "firstName",
        header: "First Name"
    },
    {
        accessorKey: "lastName",
        header: "Last Name"
    },     
    {
        accessorKey: "email",
        header: "Email"
    },
    {
        accessorKey: "password",
        header: "Password",
    }  ,  
    {
        id: 'role.name',
        accessorFn: row => row.role?.role,
        header: "Roles",
      },
    {
        id: "actions",
        cell: ({ row }) => <DataTableRowActions row={row.original}/>
    }
]

const UserPage = () => {
    const PAGE_TITLE = "Users";
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState();

    useEffect(() => {
        const loadData = async () => {            
          const data= await commonDataTableFetch('user/get-all', () => {
            router.push('/login');                
            });
            setUsers(data);
            setLoading(false);
        }
        loadData();
    }, []);

    return (
        <Card className="w-full">
            <CardContent>
                <div className="flex justify-between pt-5 pb-10">
                    <h2 className="text-3xl font-bold tracking-tight">{PAGE_TITLE}</h2>
                    <Link href={'/users/register'}><BsFillPlusCircleFill className="text-3xl" /></Link>
                </div>
                <div className="overflow-x">
                    {(!loading && users) ? <DataTable data={users} columns={columns} ></DataTable> : <Loader loading={loading} />}
                </div>
            </CardContent>
        </Card>
    )
}

export default UserPage