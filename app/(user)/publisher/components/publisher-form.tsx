'use client';
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
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
import { Input } from '@/components/ui/input';
import axiosInterceptorInstance from '@/axiosInterceptorInstance';


const formSchema = z.object({
    id: z.number().optional(),
    name: z.string().min(1, {
        message: "Invalid publisher name",
    }),
    status: z.boolean({
        error: (issue) => issue.input === undefined ? "Is Enabled is required" : "Not a boolean"
    })
})


const PublisherForm: React.FC<any> = ({
    initData,
}: {
    initData: any
}) => {

    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const MySwal = withReactContent(Swal)

    const title = initData ? 'Edit publisher' : 'Create publisher';
    const toastMessage = initData ? 'Publisher updated.' : 'Publisher created.';
    const action = initData ? 'Save changes' : 'Create';

    const defaultValues = initData ? initData : {
        id: 0,
        name: "",
        status: false
    }

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues
    })

    async function savePublisher(publisherSaveReq: z.infer<typeof formSchema>) {
        setLoading(true);
        try {
            console.debug(publisherSaveReq);
            let response = initData
                ? await axiosInterceptorInstance.put('publisher/update', publisherSaveReq)
                : await axiosInterceptorInstance.post('publisher/save', publisherSaveReq);
            console.debug(response);
            if (response && response.data && response.data.status === true) {
                router.refresh();
                router.push('/publisher');
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
        }
        catch (error: any) {
            console.error(error);
            Swal.fire({
                title: "Error!",
                text: error.response?.data?.message,
                icon: "error"
            });
        }
        finally {
            setLoading(false);
        }
    }

    return (
        <>
            <Form {...form}>
                <form className='w-full lg:w-1/2' onSubmit={form.handleSubmit(savePublisher)}>
                    <Card className="w-full">
                        <CardContent>
                            <div className="flex justify-between pt-5 pb-10">
                                <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
                                <Link href={'/publisher'} className='text-3xl'><BsTable /></Link>
                            </div>
                            {form.formState.errors?.root && <Alert variant="destructive" className='mb-5'>
                                <AlertCircle className="h-4 w-4" />
                                <AlertTitle>Error</AlertTitle>
                                <AlertDescription>
                                    {form.formState.errors?.root?.message}
                                </AlertDescription>
                            </Alert>}
                            <div className="grid w-full items-center gap-4">
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

                                <div className="flex flex-col space-y-1.5">
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Publisher Name</FormLabel>
                                                <FormControl>
                                                    <Input disabled={loading} placeholder="Publisher Name" {...field} />
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
                                <Button disabled={loading} variant="outline">Clear</Button>
                                <Button disabled={loading} type="submit">{action}</Button>
                            </div>
                        </CardFooter>
                    </Card>
                </form>
            </Form>
        </>

    )
}

export default PublisherForm