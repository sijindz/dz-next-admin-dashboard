'use client'
import axiosInterceptorInstance from '@/axiosInterceptorInstance'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import SearchableSelectFormItem from '@/components/ui/custom/searchable-select-form-item'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { handleFormError, isAuthError } from '@/lib/form-helper'
import { zodResolver } from '@hookform/resolvers/zod'
import { AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { BsTable } from 'react-icons/bs'
import { PulseLoader } from 'react-spinners'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

import * as z from "zod"

const registerFormSchema = z.object({
    id: z.number().optional(),
    firstName: z.string().min(1, {
        message: "Invalid firstname",
    }),
    lastName: z.string().min(1, {
        message: "Invalid lastname",
    }),
    email: z.string().email().min(1, {
        message: "Invalid email",
    }),
    password: z.string().min(1, {
        message: "Invalid password",
    }),
    role: z.object({
        id: z.number().gt(0, { message: "Invalid category" }),
    }),
    active: z.boolean({
        required_error: "Active is required",
    })
})

const UserForm = ({
    initData,
}: {
    initData: any
}) => {

    let processedInitData = initData ? { ...initData, password: "***" } : undefined;
    const title = initData ? 'Edit User' : 'Add User';
    const action = initData ? 'Update' : 'Save'
    const toastMessage = initData ? 'User updated.' : 'User registrattion completed.';
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const MySwal = withReactContent(Swal)

    const defaultValues = initData ? processedInitData : {
        firstName: "",
        lastName: "",
        password: "",
        email: "",
        active: false
    }

    const userForm = useForm<z.infer<typeof registerFormSchema>>({
        resolver: zodResolver(registerFormSchema),
        defaultValues
    })

    async function saveMember(saveMember: z.infer<typeof registerFormSchema>) {
        let result: any;
        try {
            result = initData ? await axiosInterceptorInstance.put('/user/update', saveMember) : await axiosInterceptorInstance.post('/auth/sign-up', saveMember);
            router.push('/users');
            MySwal.fire({
                position: "center",
                icon: "success",
                title: toastMessage,
                showConfirmButton: false,
                timer: 1000
            });
        }
        catch (error: any) {
            handleFormError(error, userForm);
        }
        finally {
            setLoading(false);
        }
    }

    function resetForm() {
        userForm.reset();
    }

    const [roles, setRoles] = useState();

    useEffect(() => {
        const loadRoles = async () => {

            const MySwal = withReactContent(Swal);
            try {
                const resp = await axiosInterceptorInstance.get("/role/get-all");
                console.log(resp.data.data);
                setRoles(resp.data.data);
            }
            catch (e: any) {
                console.error(e.response);
                if (isAuthError(e)) {
                    let timerInterval: any;
                    MySwal.fire({
                        title: e.response?.data?.detail,
                        html: "No access to this page or you have to login again. You will be logged out in <b></b> milliseconds.",
                        timer: 3000,
                        timerProgressBar: true,
                        didOpen: () => {
                            MySwal.showLoading(null);
                            const timer = MySwal.getPopup()?.querySelector("b");
                            timerInterval = setInterval(() => {
                                if (timer)
                                    timer.textContent = `${MySwal.getTimerLeft()}`;
                            }, 100);
                        },
                        willClose: () => {
                            clearInterval(timerInterval);
                        }
                    }).then((result) => {
                        router.refresh();
                        router.push('/login');
                    });
                }
                else {
                    MySwal.fire({
                        title: e.response.data.title ?? "Error!",
                        text: "Operation failed",
                        html: e.response.data.detail ?? "",
                        icon: "error",
                    })
                }
            }
            setLoading(false);
        }
        if (roles == undefined) {
            loadRoles();
        }
    }, []);

    return (

        <Form {...userForm}>
            <form className='w-full' onSubmit={userForm.handleSubmit(saveMember)}>
                <Card className="w-full lg:w-1/2">
                    <CardContent>
                        <div className="flex justify-between pt-5 pb-10">
                            <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
                            <Link href={'/users'} className='text-3xl'><BsTable /></Link>
                        </div>
                        {userForm.formState.errors?.root && <Alert variant="destructive" className='mb-5'>
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>
                                {userForm.formState.errors?.root?.message}
                            </AlertDescription>
                        </Alert>}
                        <div className="grid w-full items-center gap-4">
                            <FormField
                                control={userForm.control}
                                name="active"
                                render={({ field }) => (
                                    <FormItem className='flex items-center space-x-2'>
                                        <FormLabel>Active</FormLabel>
                                        <FormControl>
                                            <Switch disabled={loading} checked={field.value}
                                                onCheckedChange={field.onChange} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="flex flex-col space-y-1.5">
                                <FormField
                                    control={userForm.control}
                                    name="firstName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>FirstName</FormLabel>
                                            <FormControl>
                                                <Input disabled={loading} placeholder="FirstName" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <FormField
                                    control={userForm.control}
                                    name="lastName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>LastName</FormLabel>
                                            <FormControl>
                                                <Input disabled={loading} placeholder="LastName" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="w-full">
                                {roles ? <SearchableSelectFormItem fieldLabel="Role" fieldName="role.id" dataKey="id" dataValue="role" entries={roles} control={userForm.control} onSelect={(val: any) => {
                                    userForm.setValue("role.id", parseInt(val));
                                    console.log(userForm.getValues())
                                }} disabled={false} /> : <div className="w-full items-center justify-center flex"><PulseLoader /></div>}
                            </div>
                            <div className="flex flex-wrap gap-y-4">
                                <div className="w-full">
                                    <FormField
                                        control={userForm.control}
                                        name="password"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Password</FormLabel>
                                                <FormControl>
                                                    <Input disabled={loading} placeholder="Password" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="w-full">
                                    <FormField
                                        control={userForm.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Email</FormLabel>
                                                <FormControl>
                                                    <Input disabled={loading} placeholder="Email" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
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

export default UserForm