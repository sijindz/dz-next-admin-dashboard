'use client';
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useEffect, useState } from 'react'
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
import { PulseLoader } from 'react-spinners';
import SearchableSelectFormItem from '@/components/ui/custom/searchable-select-form-item';
import { Switch } from '@/components/ui/switch';

const formSchema = z.object({
    id: z.number().optional(),
    bookNumber: z.string().min(1, {
        message: "Invalid Book Number",
    }),
    categoryNumber: z.string().min(1, {
        message: "Invalid Category Number",
    }),
    edition: z.string().optional(),
    book: z.object({
        id: z.number().gt(0, { message: "Invalid book" }),
    }),
    publisher: z.object({
        id: z.number().optional().nullable(),
    }).nullable()

    ,
    activeMember: z.object({
        id: z.number().optional().nullable(),
    }).optional().nullable()
    ,
    sourceOfFund: z.enum(["GOVERNMENT", "SPONSORED", "UNKNOWN"], {
        error: () => "Please choose a valid option",
    }).optional().optional(),
    price: z.coerce.number().optional(),
    remark: z.coerce.string().optional()
        .transform(e => e === "null" ? '' : e),
    status: z.boolean({
error: (issue) => issue.input === undefined ? "Is Enabled is required" : "Not a boolean"
    })
})

const BookEntryForm: React.FC<any> = ({ initData }: { initData: any }) => {

    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const MySwal = withReactContent(Swal)

    const title = initData ? 'Edit book entry' : 'Create book entry';
    const toastMessage = initData ? 'Book entry updated.' : 'Book entry created.';
    const action = initData ? 'Save changes' : 'Create';

    const filterConditions = [{
        "attribute": "status",
        "operator": "=",
        "value": "true",
        "type": "AND"
    }];

    const [sofEntries, setSofEntries] = useState();

    const defaultValues = initData ? { ...initData, remark: initData.remark ?? '' } : {
        id: 0,
        bookNumber: "",
        categoryNumber: "",
        edition: "",
        book: { id: 0 },
        publisher: { id: 0 },
        activeMember: { id: 0 },
        sourceOfFund: "",
        price: 0,
        remark: "",
        status: false
    }

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues
    })

    function loadSourceOfFundEntries() {


        const result = axiosInterceptorInstance.get('/constants/source-of-fund');

        result.then(function (response: any) {
            if (response && response.data && response.data.status === true) {
                setSofEntries(response.data.data);
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
        })
            .catch(function (error: any) {
                console.error(error.message);
                MySwal.fire({
                    title: "Error!",
                    text: error?.message,
                    icon: "error"
                });
            });

    }

    async function saveBookEntry(saveBookEntryReq: z.infer<typeof formSchema>) {
        setLoading(true);
        let result: any;
        if (initData) {
            saveBookEntryReq.id = initData.id;
            console.log(saveBookEntryReq);
            result = axiosInterceptorInstance.put('book-entry/update', saveBookEntryReq);
        }
        else {
            result = axiosInterceptorInstance.post('book-entry/save', saveBookEntryReq);
        }

        result.then(function (response: any) {
            console.log(response.data.data);
            if (response && response.data && response.data.status === true) {
                router.refresh();
                router.push('/bookEntry');
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
            setLoading(false);
        })
            .catch(function (error: any) {
                console.error(error);
                MySwal.fire({
                    title: "Error",
                    text: error.response?.data?.message,
                    icon: "error"
                });
                setLoading(false);
            });

    }

    useEffect(() => {
        loadSourceOfFundEntries();
    }, []);


    return (
        <>
            <Form {...form}>
                <form className='w-full' onSubmit={form.handleSubmit(saveBookEntry)}>
                    <Card className="lg:w-1/2 w-full ">
                        <CardContent>
                            <div className="flex justify-between pt-5 pb-10">
                                <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
                                <Link href={'/bookEntry'} className='text-3xl'><BsTable /></Link>
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
                                <div className="flex flex-wrap gap-y-4">
                                    <div className="w-full">
                                        <CommonSearchableSelectFormItem fieldName='book.id' fieldLabel='Book' url="/book/filtered-dropdown" filters={filterConditions} control={form.control} onSelect={(val: any) => {
                                            form.setValue("book.id", parseInt(val));
                                            console.log(form.getValues())
                                        }} ></CommonSearchableSelectFormItem>
                                    </div>
                                    <div className='w-full flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4'>
                                        <div className="flex flex-col space-y-1.5 w-full">
                                            <FormField
                                                control={form.control}
                                                name="bookNumber"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Book Number</FormLabel>
                                                        <FormControl>
                                                            <Input disabled={loading} placeholder="Book Number" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                        <div className="flex flex-col space-y-1.5 w-full">
                                            <FormField
                                                control={form.control}
                                                name="categoryNumber"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Category Number</FormLabel>
                                                        <FormControl>
                                                            <Input disabled={loading} placeholder="Category Number" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                        <div className="flex flex-col space-y-1.5 w-full">
                                            <FormField
                                                control={form.control}
                                                name="edition"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Edition</FormLabel>
                                                        <FormControl>
                                                            <Input disabled={loading} placeholder="Edition" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </div>
                                    <div className="w-full">
                                        <CommonSearchableSelectFormItem fieldName='publisher.id' fieldLabel='Publisher' url="/publisher/filtered-dropdown" filters={filterConditions} control={form.control} onSelect={(val: any) => {
                                            form.setValue("publisher.id", parseInt(val));
                                            console.log(form.getValues())
                                        }} ></CommonSearchableSelectFormItem>
                                    </div>
                                    <div className='w-full flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4'>
                                        <div className="w-full space-y-1.5">
                                            {sofEntries ? <SearchableSelectFormItem fieldName='sourceOfFund' fieldLabel='Source Of Fund' entries={sofEntries} control={form.control} onSelect={(val: any) => {
                                                form.setValue("sourceOfFund", val);
                                                console.log(form.getValues())
                                            }} /> : <div className="w-full items-center justify-center flex"><PulseLoader /></div>
                                            }
                                        </div>
                                        <div className="w-full space-y-1.5">
                                            <FormField
                                                control={form.control}
                                                name="price"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Price</FormLabel>
                                                        <FormControl>
                                                            <Input type='number' disabled={loading} placeholder='Price' {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </div>
                                    <div className="w-full">
                                        <CommonSearchableSelectFormItem disabled={initData ? true : false} fieldName='activeMember.id' fieldLabel='Active Member' url="/member/filtered-dropdown" filters={filterConditions} control={form.control} onSelect={(val: any) => {
                                            form.setValue("activeMember.id", parseInt(val));
                                            console.log(form.getValues())
                                        }} ></CommonSearchableSelectFormItem>
                                    </div>
                                    <div className="w-full">
                                        <FormField
                                            control={form.control}
                                            name="remark"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Remarks</FormLabel>
                                                    <FormControl>
                                                        <Input disabled={loading} placeholder="remark" {...field} />
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


export default BookEntryForm;