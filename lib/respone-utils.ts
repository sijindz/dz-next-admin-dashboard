import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

export default class ResponseUtils {
    static isAuthError(errResp: any) {        
       const erroCode:string=errResp?.response?.data?.code;
       return erroCode.startsWith('AU00') }
}

export function trigggerMySwalCountDown(title:any,callBack:any){
    const MySwal = withReactContent(Swal);
    let timerInterval: any;
    MySwal.fire({
        title: title,
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
    }).then(() => {
        callBack();
    });
}