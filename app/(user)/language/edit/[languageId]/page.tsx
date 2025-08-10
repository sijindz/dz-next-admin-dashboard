'use client'
import React, { use, useEffect, useState } from 'react'
import LanguageForm from '../../components/language-form';
import axiosInterceptorInstance from '@/axiosInterceptorInstance';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import Link from 'next/link';
import ResponseUtils from '@/lib/respone-utils';

export default function EditCategory({ params }: {
    params: Promise<{ languageId: string }>
}) {

    const { languageId } = use(params);
    const [language, setLanguage] = useState();
    const MySwal = withReactContent(Swal)

    async function loadData() {
        if (languageId) {
            try {
                const response = await axiosInterceptorInstance.get(`language/find-one?id=${languageId}&&mode=VIEW`);
                if (response?.data?.data) {
                    setLanguage(response.data.data);
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
            {language && <LanguageForm initData={language} />}
        </>
    )
}

