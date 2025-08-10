'use client'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import axiosInterceptorInstance from '@/axiosInterceptorInstance';
import { FilterCondition } from '@/types/type';

export async function commonDataTableFetch(action: string, filterConditions: FilterCondition[], cbFail: any|undefined) {
    console.log("commonDataTableFetch.......");
    const MySwal = withReactContent(Swal);
    try {
        const resp = await axiosInterceptorInstance.post(action, { customFields: [], filterConditions: filterConditions });
        console.log(resp.data.data);
        return resp.data.data;
    }
    catch (e: any) {        
        console.log(e);
        let timerInterval: any;
        MySwal.fire({
            title: e.response?.data?.message,
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
           if (cbFail){
            cbFail();            
           }           
            /* Read more about handling dismissals below */
            if (result.dismiss === MySwal.DismissReason.timer) {
                console.log("I was closed by the timer");
            }
        });

    }
    return [];
}