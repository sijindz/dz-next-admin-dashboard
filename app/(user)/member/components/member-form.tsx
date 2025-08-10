'use client';
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'

import * as z from "zod"
import Link from 'next/link';
import { BsTable } from 'react-icons/bs';
import { useRouter } from 'next/navigation';

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import axiosInterceptorInstance from '@/axiosInterceptorInstance';


const formSchema = z.object({
    id: z.number().optional(),
    firstName: z.string().min(1, {
        message: "Invalid firstname",
    }),
    lastName: z.string().min(1, {
        message: "Invalid lastname",
    }),
    mobile: z.string().min(1, {
        message: "Invalid mobile",
    }),
    email: z.string().email().min(1, {
        message: "Invalid email",
    }),
    address1: z.string().min(1, {
        message: "Invalid address",
    }),
    address2: z.string().optional(),
    address3: z.string().optional(),
    status: z.boolean({
        error: (issue) => issue.input === undefined ? "Is Enabled is required" : "Not a boolean"
    })
})


const MemberForm: React.FC<any> = ({
    initData,
}: {
    initData: any
}) => {

    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const MySwal = withReactContent(Swal)

    const title = initData ? 'Edit member' : 'Create member';
    const toastMessage = initData ? 'Member updated.' : 'Member created.';
    const action = initData ? 'Save changes' : 'Create';

    const defaultValues = initData ? initData : {
        id: 0,
        firstName: "",
        lastName: "",
        mobile: "",
        email: "",
        address1: "",
        address2: "",
        address3: "",
        status: false
    }

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues
    })

    async function saveMember(saveMember: z.infer<typeof formSchema>) {

        let result: any;
        if (initData) {
            saveMember.id = initData.id;
            console.log(saveMember);
            result = axiosInterceptorInstance.put('/member/update', saveMember);
        }
        else {
            result = axiosInterceptorInstance.post('/member/save', saveMember);
        }

        result.then(function (response: any) {
            console.log(response.data.data);
            if (response && response.data && response.data.status === true) {
                setLoading(false);
                router.refresh();
                router.push('/member');
                MySwal.fire({
                    position: "center",
                    icon: "success",
                    title: toastMessage,
                    showConfirmButton: false,
                    timer: 1000
                });
            }
            else {
                console.log(response.data.errors);
                response.data.errors?.map((err: any) => {
                    form.setError((err.field && form.control._names.mount.has(err.field)) ? err.field : "root", { type: "custom", message: err.message });
                })
            }
        })
            .catch(function (error: any) {
                console.error(error);
                Swal.fire({
                    title: "Error",
                    text: error.response?.data?.message,
                    icon: "error"
                });
                setLoading(false);
            });

    }

    return (
        <>
            <Form {...form}>
                <form className='w-full' onSubmit={form.handleSubmit(saveMember)}>
                    <Card className="w-full lg:w-1/2">
                        <CardContent>
                            <div className="flex justify-between pt-5 pb-10">
                                <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
                                <Link href={'/member'} className='text-3xl'><BsTable /></Link>
                            </div>
                            {form.formState.errors?.root && <Alert variant="destructive" className='mb-5'>
                                <AlertCircle className="h-4 w-4" />
                                <AlertTitle>Error</AlertTitle>
                                <AlertDescription>
                                    {form.formState.errors?.root?.message}
                                </AlertDescription>
                            </Alert>}
                            <div className="grid w-full items-center gap-4">
                                <div className='w-full grid grid-cols-1 md:grid-cols-4 gap-4'>
                                    <div className="w-full md:col-span-2">
                                        <FormField
                                            control={form.control}
                                            name="status"
                                            render={({ field }) => (
                                                <FormItem className='flex items-center space-x-2'>
                                                    <FormLabel>Status</FormLabel>
                                                    <FormControl>
                                                        <Switch disabled={loading} checked={field.value}
                                                            onCheckedChange={field.onChange} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    {initData && (
                                        <>
                                            <div className='w-full'>
                                                <span className='{text-sm font-medium}'>Active Membership</span>
                                                <div className={`${initData?.membershipStatus === true ? 'text-green-600' : 'text-red-500'} text-2xl font-bold`}>{initData?.activeMemberShip?.membershipName}</div>
                                            </div>
                                            <div className='w-full'>
                                                <span className='text-sm font-medium'>Current Expiry Date</span>
                                                <div className={`${initData?.membershipStatus === true ? 'text-green-600' : 'text-red-500'} text-2xl font-bold`}>{initData?.membershipEndDate}</div>
                                            </div>
                                        </>
                                    )}
                                </div>

                                <div className="flex flex-wrap gap-y-4">
                                    <div className="w-full sm:w-1/2">
                                        <FormField
                                            control={form.control}
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
                                    <div className="w-full sm:w-1/2 sm:pl-4">
                                        <FormField
                                            control={form.control}
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
                                </div>
                                <div className="flex flex-wrap gap-y-4">
                                    <div className="w-full sm:w-1/2">
                                        <FormField
                                            control={form.control}
                                            name="mobile"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Mobile</FormLabel>
                                                    <FormControl>
                                                        <Input disabled={loading} placeholder="Mobile" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <div className="w-full sm:w-1/2 sm:pl-4">
                                        <FormField
                                            control={form.control}
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

                                <div className="flex flex-col space-y-1.5">
                                    <FormField
                                        control={form.control}
                                        name="address1"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Address Line 1</FormLabel>
                                                <FormControl>
                                                    <Input disabled={loading} placeholder="Address Line 1" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="flex flex-col space-y-1.5">
                                    <FormField
                                        control={form.control}
                                        name="address2"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Address Line 2</FormLabel>
                                                <FormControl>
                                                    <Input disabled={loading} placeholder="Address Line 2" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="flex flex-col space-y-1.5">
                                    <FormField
                                        control={form.control}
                                        name="address3"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Address Line 3</FormLabel>
                                                <FormControl>
                                                    <Input disabled={loading} placeholder="Address Line 3" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-between">
                            <Button disabled={loading} variant="outline" type='button' onClick={() => { form.reset() }}>Clear</Button>
                            <Button disabled={loading} type="submit">{action}</Button>
                        </CardFooter>
                    </Card>
                </form>
            </Form>
        </>

    )
}

export default MemberForm