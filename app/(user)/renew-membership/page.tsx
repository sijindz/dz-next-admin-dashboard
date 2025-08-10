'use client';
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
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
import ResponseUtils from '@/lib/respone-utils';
import { addDays, format } from 'date-fns';
import { Membership } from '../membership/components/columns';
import { Member } from '../member/components/columns';
import moment from 'moment';

const formSchema = z.object({
    id: z.number().optional(),
    member: z.object({
        id: z.number().gt(0, { message: "Invalid member" }),
    }),
    membership: z.object({
        id: z.number().gt(0, { message: "Invalid membership" }),
    }),
    remarks: z.coerce.string().optional()
        .transform(e => e === "null" ? '' : e),
    amount: z.number({error: (issue) => issue.input === undefined ? "Membership fee required" : "Inavlid data"}).gt(0, { message: "Invalid membership fee" }),
    expiryDate: z.string({error: (issue) => issue.input === undefined ? "Expiry date required" : "Inavlid data"}).min(1, {
        message: "Invalid expiry date",
    })
})

export default function RenewMembership() {

    const [membershipId, setMembershipId] = useState<number>();
    const [membership, setMembership] = useState<Membership>();

    const [member, setMember] = useState<Member>();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const MySwal = withReactContent(Swal)

    const title = 'Renew Membership';
    const toastMessage = 'Membership renewed';
    const action = 'Renew Membership';

    const filterConditions=[{
        "attribute": "status",
        "operator": "=",
        "value": "true",
        "type": "AND"
    }];

    const defaultValues = {
        amount: 0,
        expiryDate: "",
        member: {},
        membership: {},
        remarks: ""
    }

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues
    })

    async function loadMembership() {
        if (!membershipId)
            return;
        try {
            const response = await axiosInterceptorInstance.get(`membership/find-one?id=${membershipId}&&mode=VIEW`);
            if (response?.data?.data) {
                setMembership(response.data.data);
                form.setValue('amount', response.data.data.membershipFee);
            }
        }
        catch (exception: any) {
            const isAuthError = ResponseUtils.isAuthError(exception);
            MySwal.fire({
                title: "Error!",
                text: exception.response?.data?.message,
                html: isAuthError ? <Link className='underline hover:text-blue-800' href="/logout" >Log out</Link> : '',
                icon: "error",
                showConfirmButton: !isAuthError
            })
        }
    }

    async function loadMember(memberId: any) {
        if (!memberId)
            return;
        try {
            const response = await axiosInterceptorInstance.get(`member/find-one?id=${memberId}&&mode=VIEW`);
            if (response?.data?.data) {
                setMember(response.data.data);
                const memberShipRenewalDate = (response.data.data?.membershipStatus === true) ? moment(response.data.data?.membershipEndDate, 'DD-MM-yyyy') : moment();
                form.setValue('expiryDate', memberShipRenewalDate.add(365, 'd').format('DD-MM-yyyy'));
            }
        }
        catch (exception: any) {
            const isAuthError = ResponseUtils.isAuthError(exception);
            MySwal.fire({
                title: "Error!",
                text: exception.response?.data?.message,
                html: isAuthError ? <Link className='underline hover:text-blue-800' href="/logout" >Log out</Link> : '',
                icon: "error",
                showConfirmButton: !isAuthError
            })
        }
    }

    useEffect(
        () => {
            console.log(membershipId);
            loadMembership();
        }, [membershipId]);

    function resetForm() {
        form.reset();
        setMembership(undefined);
        setMember(undefined);
    }

    function addCommonErrorsToForm(errors: any[]) {
        if (!errors || errors.length <= 0)
            return;

        const errorMessage = errors.map(error => `${error.field} : ${error.message}`).join(" ,");
        form.setError('root', { type: "custom", message: errorMessage })
    }


    async function renewMemberShip(renewMembershipReq: z.infer<typeof formSchema>) {

        const result = axiosInterceptorInstance.post('/renew-membership/renew', renewMembershipReq);
        result.then(function (response: any) {
            console.log(response.data.data);
            if (response && response.data && response.data.status === true) {
                router.refresh();
                router.push('/renew-membership/history');
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
                const commonErrors: any[] = [];
                response.data.errors?.map((err: any) => {

                    if ((err.field && form.control._names.mount.has(err.field))) {
                        form.setError(err.field, { type: "custom", message: err.message });
                    }
                    else {
                        commonErrors.push(err);
                    }
                    addCommonErrorsToForm(commonErrors);
                })
                console.log(form.formState.errors);
            }
        })
            .catch(function (error: any) {
                console.error(error);
                MySwal.fire({
                    title: "Error",
                    text: error.response?.data?.message,
                    icon: "error"
                });                
            });
    }

    async function saveRenewMembership(saveRenewMembershipReq: z.infer<typeof formSchema>) {
        setLoading(true);
        console.log(saveRenewMembershipReq);

        MySwal.fire({
            title: "Membership Renewal?",
            text: "Next renewal date is:" + saveRenewMembershipReq.expiryDate,
            icon: "info",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, renew!"
        }).then((result) => {
            if (result.isConfirmed) {
                renewMemberShip(saveRenewMembershipReq);
            }
            setLoading(false);
        });
    }

    return (
        <>
            <Form {...form}>
                <form className='w-full' onSubmit={form.handleSubmit(saveRenewMembership)}>
                    <Card className="w-full">
                        <CardContent>
                            <div className="flex justify-between pt-5 pb-10">
                                <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
                                <Link href={'/renew-membership/history'} className='text-3xl'><BsTable /></Link>
                            </div>
                            {(form.formState.errors?.root || form.formState.errors?.amount || form.formState.errors?.expiryDate) && <Alert variant="destructive" className='mb-5'>
                                <AlertCircle className="h-4 w-4" />
                                <AlertTitle>Error</AlertTitle>
                                <AlertDescription>
                                    {form.formState.errors?.root?.message}
                                </AlertDescription>
                                <AlertDescription>
                                    {form.formState.errors?.expiryDate?.message}
                                </AlertDescription>
                                <AlertDescription>
                                    {form.formState.errors?.amount?.message}
                                </AlertDescription>
                            </Alert>}

                            <div className="grid gap-4 grid-cols-1 md:grid-cols-3">

                                <div className="md:col-span-2 items-center gap-4">
                                    <div className="w-full">
                                        <CommonSearchableSelectFormItem fieldName='member.id' fieldLabel='Member' url="/member/filtered-dropdown" filters={filterConditions} control={form.control} onSelect={(val: any) => {
                                            form.setValue("member.id", parseInt(val));
                                            loadMember(parseInt(val));
                                        }} ></CommonSearchableSelectFormItem>
                                    </div>
                                    <div className="w-full mt-2">
                                        <CommonSearchableSelectFormItem fieldName='membership.id' fieldLabel='Membership' url="/membership/filtered-dropdown" filters={[]} control={form.control} onSelect={(val: any) => {
                                            form.setValue("membership.id", parseInt(val));
                                            setMembershipId(parseInt(val));
                                            console.log(form.getValues())
                                        }} ></CommonSearchableSelectFormItem>
                                    </div>
                                    <div className="w-full">
                                        <FormField
                                            control={form.control}
                                            name="remarks"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Remarks</FormLabel>
                                                    <FormControl>
                                                        <Input disabled={loading} placeholder="Remarks" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>
                                <div className='md:col-span-1 flex'>
                                    <div className='w-full grid grid-cols-2'>
                                        {member && (
                                            <>
                                                <div className='w-full'>
                                                    <span className='{text-sm font-medium}'>Active Membership</span>
                                                    <div className={`${member?.membershipStatus === true ? 'text-green-600' : 'text-red-500'} text-2xl font-bold`}>{member?.activeMemberShip?.membershipName}</div>
                                                </div>
                                                <div className='w-full'>
                                                    <span className='text-sm font-medium'>Current Expiry Date</span>
                                                    <div className={`${member?.membershipStatus === true ? 'text-green-600' : 'text-red-500'} text-2xl font-bold`}>{member?.membershipEndDate}</div>
                                                </div>
                                            </>
                                        )}

                                        {membership && (
                                            <>
                                                <div className='w-full'>
                                                    <span className='text-sm font-medium'>Membership Fee</span>
                                                    <div className="text-2xl font-bold">${membership?.membershipFee}</div>
                                                </div>
                                                <div className='w-full'>
                                                    <span className='text-sm font-medium'>Expiry Date</span>
                                                    <div className="text-2xl font-bold">{form.getValues('expiryDate')}</div>
                                                </div>

                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <div className="flex justify-between w-full md:w-2/3">
                                <Button disabled={loading} variant="outline" type='button' onClick={resetForm} >Clear</Button>
                                <Button disabled={loading} type="submit">{action}</Button>
                            </div>
                        </CardFooter>
                    </Card>
                </form>
            </Form>

        </>
    )
}