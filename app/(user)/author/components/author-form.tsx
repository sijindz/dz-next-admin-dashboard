'use client';
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
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
    personalData: z.string().optional(),
    status: z.boolean({
        error: (issue) => issue.input === undefined ? "Is Enabled is required" : "Not a boolean"
    })
})


const AuthorForm: React.FC<any> = ({
    initData,
}: {
    initData: any
}) => {


    // await new Promise(res=>setTimeout(res,2000))

    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const MySwal = withReactContent(Swal)

    const title = initData ? 'Edit author' : 'Create author';
    const toastMessage = initData ? 'Author updated.' : 'Author created.';
    const action = initData ? 'Save changes' : 'Create';

    const defaultValues = initData ? initData : {
        id: 0,
        firstName: "",
        lastName: "",
        personalData: "",
        status: false
    }

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues
    })

    async function saveAuthor(saveAuthor: z.infer<typeof formSchema>) {

        //console.log(saveAuthor);

        let result: any;
        if (initData) {
            saveAuthor.id = initData.id;
            console.log(saveAuthor);
            result = axiosInterceptorInstance.put('author/update', saveAuthor);
        }
        else {
            result = axiosInterceptorInstance.post('/author/save', saveAuthor);
        }

        result.then(function (response: any) {
            console.log(response.data.data);
            if (response && response.data && response.data.status === true) {
                setLoading(false);
                router.refresh();
                router.push('/author');
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
                <form className='w-full' onSubmit={form.handleSubmit(saveAuthor)}>
                    <Card className="w-full lg:w-1/2">
                        <CardContent>
                            <div className="flex justify-between pt-5 pb-10">
                                <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
                                <Link href={'/author'} className='text-3xl'><BsTable /></Link>
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

                                <div className="flex flex-wrap gap-y-4 w-full ">
                                    <div className="w-full">
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
                                    <div className="w-full">
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
                                    <div className="w-full">
                                        <FormField
                                            control={form.control}
                                            name="personalData"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Personal Data</FormLabel>
                                                    <FormControl>
                                                        <Textarea disabled={loading} placeholder="Personal Data." {...field} />
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
                                <Button disabled={loading} variant="outline" type='button' onClick={() => { form.reset() }} >Clear</Button>
                                <Button disabled={loading} type="submit">{action}</Button>
                            </div>
                        </CardFooter>
                    </Card>
                </form>
            </Form>
        </>

    )
}

export default AuthorForm