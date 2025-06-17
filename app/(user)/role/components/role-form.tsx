'use client';
import axiosInterceptorInstance from '@/axiosInterceptorInstance';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { handleFormError } from '@/lib/form-helper';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { BsTable } from 'react-icons/bs';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import * as z from "zod"

const roleSchema = z.object({
    id: z.number().optional(),
    role: z.string().min(1, {
        message: "Invalid role",
    })
})

const RoleForm = ({
    initData,
}: {
    initData: any
}) => {

    const title = initData?'Edit Role':'Add Role';
    const action = initData?'Update':'Save'
    const toastMessage = initData?'Role updated.':'Role created.';
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const MySwal = withReactContent(Swal)


    const defaultValues = initData ? initData : {
        id: 0,
        role: ""
    }
    const roleForm = useForm<z.infer<typeof roleSchema>>({
        resolver: zodResolver(roleSchema),
        defaultValues
    })

    async function saveRole(roleSaveReq: z.infer<typeof roleSchema>) {
        setLoading(true);
        console.log(roleSaveReq);
        try {
            if (initData) {

            }
            const response = initData ? await axiosInterceptorInstance.put('/role/update', roleSaveReq) : await axiosInterceptorInstance.post('/role/save', roleSaveReq);
            console.log(response);
            router.push('/role');
            MySwal.fire({
                position: "center",
                icon: "success",
                title: toastMessage,
                showConfirmButton: false,
                timer: 1000
            });
        } catch (error: any) {
            await handleFormError(error, roleForm);
        }
        finally {
            setLoading(false);
        }

    }

    function resetForm() {
        roleForm.reset();
    }

    return (
        <Form {...roleForm}>
            <form className='w-full' onSubmit={roleForm.handleSubmit(saveRole)}>
                <Card className="w-full lg:w-1/2">
                    <CardContent>
                        <div className="flex justify-between pt-5 pb-10">
                            <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
                            <Link href={'/role'} className='text-3xl'><BsTable /></Link>
                        </div>
                        {roleForm.formState.errors?.root && <Alert variant="destructive" className='mb-5'>
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>
                                {roleForm.formState.errors?.root?.message}
                            </AlertDescription>
                        </Alert>}
                        <div className="grid w-full items-center gap-4">
                            <div className="flex flex-col space-y-1.5">
                                <FormField
                                    control={roleForm.control}
                                    name="role"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Role Name</FormLabel>
                                            <FormControl>
                                                <Input disabled={loading} placeholder="Role Name" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <div className="flex justify-between w-full">
                        <Button disabled={loading} variant="outline" type='button' onClick={() => { resetForm() }} >Reset</Button>
                            <Button disabled={loading} type="submit">{action}</Button>
                        </div>
                    </CardFooter>
                </Card>
            </form>

        </Form>
    )
}

export default RoleForm