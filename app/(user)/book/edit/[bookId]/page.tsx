'use client'
import React, { use, useEffect, useState } from 'react'

import BookForm from '../../components/book-form';
import axiosInterceptorInstance from '@/axiosInterceptorInstance';

export default function EditBook({ params }: {
    params: Promise<{ bookId: string }>
}) {

    const { bookId } = use(params);
    const [book, setBook] = useState();

    async function loadData() {
        if (bookId) {
            await axiosInterceptorInstance.get(`book/find-one?id=${bookId}&&mode=VIEW`)
                .then(function (response) {
                    setBook(response.data.data);
                });
        }
    }

    useEffect(() => {
        loadData();
    }, []);

    return (
        <>
            {book && <BookForm initData={book} />}
        </>
    )
}

