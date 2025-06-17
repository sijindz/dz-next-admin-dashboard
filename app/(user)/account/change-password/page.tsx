'use client'
import axiosInterceptorInstance from '@/axiosInterceptorInstance'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { handleFormError } from '@/lib/form-helper'
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

const resetPasswordFormSchema = z.object({
    currentPassword: z.string().min(1, {
        message: "Enter current password",
    }),
    newPassword: z.string().min(1, {
        message: "Enter new password",
    }),
    confirmationPassword: z.string().min(1, {
        message: "Enter password again",
    })
})

const ChangePasswordPage = () => {

    const title = "Change Password";
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const MySwal = withReactContent(Swal)

    const defaultValues = {
        currentPassword: "",
        newPassword: "",
        confirmationPassword: ""
    }

    const form = useForm<z.infer<typeof resetPasswordFormSchema>>({
        resolver: zodResolver(resetPasswordFormSchema),
        defaultValues
    })

    async function resetPassword(resetPasswordRequest: z.infer<typeof resetPasswordFormSchema>) {
        setLoading(true);
        try {
            const response = await axiosInterceptorInstance.post('/user/change-password', resetPasswordRequest);
            if (response && response.data == "Success") {
                router.push('/dashboard');
                MySwal.fire({
                    position: "center",
                    icon: "success",
                    title: "Password change successful.",
                    showConfirmButton: false,
                    timer: 1000
                });
            }
            else {
                MySwal.fire({
                    position: "center",
                    icon: "error",
                    title: "Password change failed.",
                    showConfirmButton: false,
                    timer: 1000
                });
            }
        } catch (error) {
            handleFormError(error, form);
        }
        finally {
            setLoading(false);
        }
    }

    async function resetForm() {
        form.reset();
    }

    return (
        <Form {...form}>
            <form className='w-full' onSubmit={form.handleSubmit(resetPassword)}>
                <Card className="w-full lg:w-1/2">
                    <CardContent>
                        <div className="flex justify-between pt-5 pb-10">
                            <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
                            <Link href={'/users'} className='text-3xl'><BsTable /></Link>
                        </div>
                        {form.formState.errors?.root && <Alert variant="destructive" className='mb-5'>
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>
                                {form.formState.errors?.root?.message}
                            </AlertDescription>
                        </Alert>}
                        <div className="grid w-full items-center gap-4">
                            <div className="flex flex-col space-y-1.5">
                                <FormField
                                    control={form.control}
                                    name="currentPassword"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Current password</FormLabel>
                                            <FormControl>
                                                <Input disabled={loading} placeholder="Current password" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>                            
                            <div className="flex flex-col space-y-1.5">
                                <FormField
                                    control={form.control}
                                    name="newPassword"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>New password</FormLabel>
                                            <FormControl>
                                                <Input disabled={loading} placeholder="New password" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <FormField
                                    control={form.control}
                                    name="confirmationPassword"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Confirm password</FormLabel>
                                            <FormControl>
                                                <Input disabled={loading} placeholder="Confirm password" {...field} />
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
                            <Button disabled={loading} type="submit">Change</Button>
                        </div>
                    </CardFooter>
                </Card>
            </form>

        </Form>

    )
}

export default ChangePasswordPage