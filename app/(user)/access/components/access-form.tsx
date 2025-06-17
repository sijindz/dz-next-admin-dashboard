'use client';
import axiosInterceptorInstance from '@/axiosInterceptorInstance';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { handleFormError } from '@/lib/form-helper';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form';
import { BsTable } from 'react-icons/bs';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import * as z from "zod"

const accessSchema = z.object({
    id: z.number().optional(),
    path: z.string().min(1, {
        message: "Invalid path",
    }),
    roles: z.array(z.object({
        id: z.number().optional(),
        role: z.string().optional()
    }))
})

const AccessForm = ({
    initData,
}: {
    initData: any
}) => {

    const title = initData?'Edit Access':'Add Access';
    const action = initData?'Update':'Save'
    const toastMessage = initData?'Access updated.':'Access created.';
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [roles, setRoles] = React.useState<any[] | null>(null);
    const MySwal = withReactContent(Swal)


    const defaultValues = initData ? initData : {
        id: 0,
        path: ""
    }
    const accessForm = useForm<z.infer<typeof accessSchema>>({
        resolver: zodResolver(accessSchema),
        defaultValues
    })

    const { fields: rolesField, append, remove } = useFieldArray({
        keyName: "_id",
        name: "roles",
        control: accessForm.control
    });


    const handleRoleChange = (checked: any, roleId: any, roleName: any) => {
        console.log(rolesField);
        console.log(checked, roleId)
        if (checked == true) {
            const isExist = isRoleExisting(roleId);
            if (!isExist) {
                append({ id: parseInt(roleId), role: roleName });
                console.log("Role added");
            }
        }
        else {
            const index = rolesField?.findIndex(category => category.id == roleId);
            if (index > -1) {
                remove(index);
                console.log("Role removed");
            }
        }
        console.log(rolesField);
    }

    const isRoleExisting = (roleId: any) => {
        return rolesField?.some(({ id }) => id == roleId);
    }    

    async function saveAccess(accessSaveReq: z.infer<typeof accessSchema>) {
        setLoading(true);
        try {
            const response = initData ? await axiosInterceptorInstance.put('/access/update', accessSaveReq) : await axiosInterceptorInstance.post('/access/save', accessSaveReq);
            console.log(response);
            router.push('/access');
            MySwal.fire({
                position: "center",
                icon: "success",
                title: toastMessage,
                showConfirmButton: false,
                timer: 1000
            });
        } catch (error: any) {
             handleFormError(error, accessForm);
        }
        finally {
            setLoading(false);
        }

    }

    function resetForm() {
        accessForm.reset();
    }

    React.useEffect(() => {
        const loadEntries = async () => {

            try {
                const response = await axiosInterceptorInstance.get("/role/get-all");
                if (response && response.data && response.data.status === true) {
                    setRoles(response.data.data);
                    console.log(response.data.data);
                }
                else {
                    console.log(response.data.errors);
                    response.data.errors?.map((err: any) => {
                        MySwal.fire({
                            title: "Error!",
                            text: err?.message,
                            icon: "error"
                        });
                    })
                }
            } catch (error: any) {
                MySwal.fire({
                    title: "Error!",
                    text: error?.message,
                    icon: "error"
                });
            }
        }
        if (roles === null) {
            loadEntries();
        }
    }, []);


    return (
        <Form {...accessForm}>
            <form className='w-full' onSubmit={accessForm.handleSubmit(saveAccess)}>
                <Card className="w-full lg:w-1/2">
                    <CardContent>
                        <div className="flex justify-between pt-5 pb-10">
                            <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
                            <Link href={'/access'} className='text-3xl'><BsTable /></Link>
                        </div>
                        {accessForm.formState.errors?.root && <Alert variant="destructive" className='mb-5'>
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>
                                {accessForm.formState.errors?.root?.message}
                            </AlertDescription>
                        </Alert>}
                        <div className="grid w-full items-center gap-4">
                            <div className="flex flex-col space-y-1.5">
                                <FormField
                                    control={accessForm.control}
                                    name="path"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Path Name</FormLabel>
                                            <FormControl>
                                                <Input disabled={loading} placeholder="Path" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                    <Label className="text-gray-700 font-bold mb-2">Categories</Label>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        {roles && roles.map((entry, index) => (
                                            <div className="flex items-center space-x-2" key={index}>
                                                <Checkbox
                                                    id={entry?.id}
                                                    name="amenities"
                                                    value={entry?.id}
                                                    className="mr-2"
                                                    defaultChecked={isRoleExisting(entry?.id)}
                                                    onCheckedChange={(checked) => handleRoleChange(checked, entry?.id, entry?.role)}
                                                />
                                                <label
                                                    htmlFor={entry?.id}
                                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                                    {entry?.role}
                                                </label>
                                            </div>
                                        ))}                                        
                                    </div>
                                    {accessForm.formState.errors?.roles && <p className="text-sm font-medium text-destructive">{accessForm.formState.errors?.roles?.message}</p>}
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

export default AccessForm