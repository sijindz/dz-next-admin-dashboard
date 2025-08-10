'use client'
import React, { use, useEffect, useState } from 'react'
import axiosInterceptorInstance from '@/axiosInterceptorInstance';
import ResponseUtils from '@/lib/respone-utils';
import  Loader  from '@/components/ui/custom/loader';
import dynamic from 'next/dynamic';

const AuthorForm = dynamic(() => import('../../components/author-form'))

export default function EditAuthor({ params }: {
   params: Promise<{ authorId: string }>
}) {
    console.log("Author form page.....");
    const { authorId } = use(params);
    const [author, setAuthor] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const loadData = async () => {
            if (authorId) {

                try {
                   const response= await axiosInterceptorInstance.get(`author/find-one?id=${authorId}&&mode=VIEW`);
                   console.log(response.data.data)
                    setAuthor(response.data.data);
                } catch (error) {
                    console.log(ResponseUtils.isAuthError(error));
                }
                finally{
                    setLoading(false);
                }
            }
        }
        if (author === null) {
            loadData();
        }
    }, []);

    return (
        <>    
        {(!loading && author) ? <AuthorForm initData={author} /> : <Loader loading={loading} />}
        </>
    )
}

