'use client'
import React, { use, useEffect, useState } from 'react'
import BookEntryForm from '../../components/book-entry-form';
import axiosInterceptorInstance from '@/axiosInterceptorInstance';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import Link from 'next/link';
import ResponseUtils from '@/lib/respone-utils';

export default function EditBookEntry({ params }: {
   params: Promise<{ bookEntryId: string }>
}) {

    const { bookEntryId } = use(params);
    const [bookEntry, setBookEntry] = useState(null);
    const MySwal = withReactContent(Swal)



    useEffect(() => {
        const loadData = async () => {
            if (bookEntryId) {
                try {
                    const response = await axiosInterceptorInstance.get(`book-entry/find-one?id=${bookEntryId}&&mode=VIEW`);
                    if (response?.data?.data) {
                        setBookEntry(response.data.data);
                        console.log(response.data.data);
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
        }
        if (bookEntry === null) {
            loadData();
        }
    }, []);

    return (
        <>
            {bookEntry && <BookEntryForm initData={bookEntry} />}
        </>
    )
}

