
// export function trigggerMySwalCountDown(form:any,callBack:any){
//     const MySwal = withReactContent(Swal);
//     let timerInterval: any;
//     MySwal.fire({
//         title: title,
//         html: "You will logout in <b></b> milliseconds.",
//         timer: 3000,
//         timerProgressBar: true,
//         didOpen: () => {
//             MySwal.showLoading(null);
//             const timer = MySwal.getPopup()?.querySelector("b");
//             timerInterval = setInterval(() => {
//                 if (timer)
//                     timer.textContent = `${MySwal.getTimerLeft()}`;
//             }, 100);
//         },
//         willClose: () => {
//             clearInterval(timerInterval);
//         }
//     }).then(() => {
//         callBack();
//     });
// }


'use client'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import axiosInterceptorInstance from '@/axiosInterceptorInstance';
import Link from 'next/link';
import { UseFormReturn } from 'react-hook-form';

export async function commonDataTableFetch(action: string, cbFail: any | undefined) {
    console.log("commonDataTableFetch.......");
    const MySwal = withReactContent(Swal);
    try {
        const resp = await axiosInterceptorInstance.get(action);
        console.log(resp.data.data);
        return resp.data.data;
    }
    catch (e: any) {
        console.error(e.response);
        if (isAuthError(e)) {
            let timerInterval: any;
            MySwal.fire({
                title: e.response?.data?.detail,
                html: "You will logout in <b></b> milliseconds.",
                timer: 3000,
                timerProgressBar: true,
                didOpen: () => {
                    MySwal.showLoading(null);
                    const timer = MySwal.getPopup()?.querySelector("b");
                    timerInterval = setInterval(() => {
                        if (timer)
                            timer.textContent = `${MySwal.getTimerLeft()}`;
                    }, 100);
                },
                willClose: () => {
                    clearInterval(timerInterval);
                }
            }).then((result) => {
                if (cbFail) {
                    cbFail();
                }
                /* Read more about handling dismissals below */
                if (result.dismiss === MySwal.DismissReason.timer) {
                    console.log("I was closed by the timer");
                }
            });
        }
        else {
            MySwal.fire({
                title: e.response.data.title ?? "Error!",
                text: "Delete operation failed",
                //html: isAuthError ? <Link className='underline hover:text-blue-800' href="/logout" >Log out</Link> : '',
                html: e.response.data.detail ?? "",
                icon: "error",
                // showConfirmButton: !isAuthError
            })
        }
    }
    return [];
}


export function isAuthError(errResp: any) {
    const responseStaus: number = errResp?.status;
    return responseStaus == 401;
}


export async function handleFormError(errResp: any, form: UseFormReturn<any, any, any>) {
    const callBack = (err: any) => {
        err?.response?.data?.problemDetails?.map((err: any) => {
            form.setError((err.fieldName && form.control._names.mount.has(err.fieldName)) ? err.fieldName : "root", { type: "custom", message: err.detail });
        })

    };
    handleAuthError(errResp, callBack);
}

export async function handleAuthError(errResp: any, callBack: any) {
    const responseStaus: number = errResp?.status;
    console.error(errResp?.response?.data);
    if (responseStaus == 401 || responseStaus == 403) {
        const MySwal = withReactContent(Swal);
        MySwal.fire({
            title: "Access denied!",
            html: true ? <Link className='underline hover:text-blue-800' href="/logout" >Log out</Link> : '',
            icon: "error",
        })
    }
    else {
        callBack(errResp);
    }
}