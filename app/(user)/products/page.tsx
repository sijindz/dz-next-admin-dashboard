'use client'
import Loader from '@/components/ui/custom/loader';
import React, { useEffect, useState } from 'react'


const ProductsPage = () => {

    const [loading, setLoading] = useState(true);
    function waitSeconds(ms: number) {
        console.log(`Waiting for ${(ms/1000)} seconds....`);
        return new Promise(resolve => {
            setTimeout(() => {
                resolve(`Done waiting for ${(ms/1000)} seconds!`);
            }, ms);
        });
    }
    
    useEffect(() => {
        setLoading(true);
        async function wait() {
            await waitSeconds(2000);
            setLoading(false);
            console.log("Waiting completed...");
        }            
        wait();

    }, []);

    return (
        <>
            {(loading) ? <Loader /> : <div className="text-2xl font-bold"> Products Page</div>}
        </>
    )
}

export default ProductsPage