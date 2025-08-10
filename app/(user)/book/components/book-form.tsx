'use client';
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input'
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
import { CommonSearchableSelectFormItem } from '@/components/custom/common-searchable-select-form-item';
import axiosInterceptorInstance from '@/axiosInterceptorInstance';

const formSchema = z.object({
    id: z.number().optional(),
    name: z.string().min(1, {
        message: "Invalid title",
    }),
    isbn: z.string().min(1, {
        message: "Invalid ISBN",
    }),
    author: z.object({
        id: z.number().nullable().optional(),
    }),
    category: z.object({
        id: z.number().gt(0, { message: "Invalid category" }),
    }),
    language: z.object({
        id: z.number().gt(0, { message: "Invalid language" }),
    })
})


const BookForm: React.FC<any> = ({
    initData,
}: {
    initData: any
}) => {


    // await new Promise(res=>setTimeout(res,2000))

    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const MySwal = withReactContent(Swal)

    const title = initData ? 'Edit book' : 'Create book';
    const toastMessage = initData ? 'Book updated.' : 'Book created.';
    const action = initData ? 'Save changes' : 'Create';

    const defaultValues = initData ? initData : {
        id: 0,
        name: "",
        isbn: "",
        category: { id: 0 },
        language: { id: 0 },
    }

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues
    });

    const filterConditions=[{
        "attribute": "status",
        "operator": "=",
        "value": "true",
        "type": "AND"
    }];

    async function saveBook(saveBookReq: z.infer<typeof formSchema>) {

        //console.log(saveAuthor);

        let result: any;
        if (initData) {
            saveBookReq.id = initData.id;
            console.log(saveBookReq);
            result = axiosInterceptorInstance.put('book/update', saveBookReq);
        }
        else {
            result = axiosInterceptorInstance.post('book/save', saveBookReq);
        }

        result.then(function (response: any) {
            console.log(response.data.data);
            if (response && response.data && response.data.status === true) {
                setLoading(false);
                router.refresh();
                router.push('/book');
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
                <form className='w-full' onSubmit={form.handleSubmit(saveBook)}>
                    <Card className="w-full lg:w-1/2">
                        <CardContent>
                            <div className="flex justify-between pt-5 pb-10">
                                <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
                                <Link href={'/book'} className='text-3xl'><BsTable /></Link>
                            </div>
                            {form.formState.errors?.root && <Alert variant="destructive" className='mb-5'>
                                <AlertCircle className="h-4 w-4" />
                                <AlertTitle>Error</AlertTitle>
                                <AlertDescription>
                                    {form.formState.errors?.root?.message}
                                </AlertDescription>
                            </Alert>}
                            <div className="grid w-full items-center gap-4">

                                <div className="flex flex-wrap gap-y-4 w-full ">
                                    <div className="w-full">
                                        <FormField
                                            control={form.control}
                                            name="name"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Book title</FormLabel>
                                                    <FormControl>
                                                        <Input disabled={loading} placeholder="Book title" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <div className="w-full">
                                        <FormField
                                            control={form.control}
                                            name="isbn"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>ISBN</FormLabel>
                                                    <FormControl>
                                                        <Input disabled={loading} placeholder="ISBN" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <div className="w-full">
                                        <CommonSearchableSelectFormItem fieldName='author.id' fieldLabel='Author' url="/author/filtered-dropdown" filters={filterConditions} control={form.control} onSelect={(val: any) => {
                                            form.setValue("author.id", parseInt(val));
                                            console.log(form.getValues())
                                        }} ></CommonSearchableSelectFormItem>
                                    </div>
                                    <div className="w-full">
                                        <CommonSearchableSelectFormItem fieldName='category.id' fieldLabel='Category' url="/category/filtered-dropdown" filters={filterConditions} control={form.control} onSelect={(val: any) => {
                                            form.setValue("category.id", parseInt(val));
                                            console.log(form.getValues())
                                        }} ></CommonSearchableSelectFormItem>
                                    </div>
                                    <div className="w-full">
                                        <CommonSearchableSelectFormItem fieldName='language.id' fieldLabel='Language' url="/language/filtered-dropdown" filters={filterConditions} control={form.control} onSelect={(val: any) => {
                                            form.setValue("language.id", parseInt(val));
                                            console.log(form.getValues())
                                        }} ></CommonSearchableSelectFormItem>
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

export default BookForm