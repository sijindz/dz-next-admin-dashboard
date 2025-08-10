'use client'
import React, { use, useEffect, useState } from 'react'
import axiosInterceptorInstance from '@/axiosInterceptorInstance';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import Link from 'next/link';
import ResponseUtils from '@/lib/respone-utils';
import PublisherForm from '../../components/publisher-form';

export default function EditPublisher({ params }: {
    params: Promise<{ publisherId: string }>
}) {

    const { publisherId } = use(params);
    const [publisher, setPublisher] = useState();
    const MySwal = withReactContent(Swal)

    async function loadData() {
        if (publisherId) {
            try {
                const response = await axiosInterceptorInstance.post(`publisher/find-one?id=${publisherId}&&mode=VIEW`,{});
                if (response?.data?.data) {
                    setPublisher(response.data.data);
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

    useEffect(() => {
        loadData();
    }, []);

    return (
        <>
            {publisher && <PublisherForm initData={publisher} />}
        </>
    )
}

