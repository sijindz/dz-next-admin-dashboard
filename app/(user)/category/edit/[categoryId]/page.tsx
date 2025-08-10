'use client'
import React, { use, useEffect, useState } from 'react'
import CategoryForm from '../../components/category-form';
import axiosInterceptorInstance from '@/axiosInterceptorInstance';

export default function EditCategory({ params }: {
    params: Promise<{ categoryId: string }>
}) {

    const { categoryId: authorId } = use(params);
    const [author, setAuthor] = useState();

    async function loadData() {
        if (authorId) {
            await axiosInterceptorInstance.get(`category/find-one?id=${authorId}&&mode=VIEW`)
                .then(function (response) {
                    setAuthor(response.data.data);
                });
        }
    }

    useEffect(() => {
        loadData();
    }, []);

    return (
        <>
            {author && <CategoryForm initData={author} />}
        </>
    )
}

