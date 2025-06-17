'use client'
import axiosInterceptorInstance from '@/axiosInterceptorInstance'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { BsTable } from 'react-icons/bs'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

import * as z from "zod"

const signUpFormSchema = z.object({
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
})

const SignUpForm = () => {

    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const MySwal = withReactContent(Swal)

    const defaultValues = {
        firstName: "",
        lastName: "",
        password: "",
        email: "",
    }

    const form = useForm<z.infer<typeof signUpFormSchema>>({
        resolver: zodResolver(signUpFormSchema),
        defaultValues
    })

    async function saveMember(saveMember: z.infer<typeof signUpFormSchema>) {

        let result: any;
        result = axiosInterceptorInstance.post('/auth/sign-up-admin', saveMember);

        result.then(function (response: any) {
            console.log(response.data.data);
            if (response && response.data && response.data.status === true) {
                setLoading(false);
                router.refresh();
                router.push('/dashboard');
                MySwal.fire({
                    position: "center",
                    icon: "success",
                    title: "Admin Signup successful.",
                    showConfirmButton: false,
                    timer: 1000
                });
            }
            else {
                console.log(response.data.errors);
            }
        })
            .catch(function (error: any) {
                error?.response?.data?.problemDetails?.map((err: any) => {
                    form.setError((err.fieldName && form.control._names.mount.has(err.fieldName)) ? err.fieldName : "root", { type: "custom", message: err.detail });
                })
                setLoading(false);
            });

    }

    return (
        <div className="relative flex flex-col justify-center items-center min-h-screen overflow-hidden">
            <div className="w-full m-auto sm:max-w-lg px-4">
                <Form {...form}>
                    <form className='w-full' onSubmit={form.handleSubmit(saveMember)}>
                        <Card className="">
                            <CardContent>
                                <div className="flex justify-between pt-5 pb-10">
                                    <h2 className="text-3xl font-bold tracking-tight">Signup Admin</h2>
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
                                    <div className="flex flex-wrap gap-y-4">
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
                                    </div>
                                    <div className="flex flex-wrap gap-y-4">
                                        <div className="w-full">
                                            <FormField
                                                control={form.control}
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
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-between">
                                <Button disabled={loading} variant="outline" type='button' onClick={() => { form.reset() }}>Clear</Button>
                                <Button disabled={loading} type="submit">Signup</Button>
                            </CardFooter>
                        </Card>
                    </form>
                </Form>
            </div>
        </div>

    )
}

export default SignUpForm