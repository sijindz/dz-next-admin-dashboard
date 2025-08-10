import { Dispatch, SetStateAction, useEffect, useState } from "react";
import SearchableSelect from "../ui/custom/searchable-select";
import { SelectboxModal } from "@/types/type";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import { PulseLoader } from "react-spinners";
import axiosInterceptorInstance from "@/axiosInterceptorInstance";

export const CommonSearchableSelect = ({ url, filters, activeItem, setActiveItem }: { url: string, filters: any[], activeItem: SelectboxModal | undefined, setActiveItem: Dispatch<SetStateAction<SelectboxModal>> }) => {

    const MySwal = withReactContent(Swal);


    const [entries, setEntries] = useState();

    async function loadEntries() {
       // await new Promise(res => setTimeout(res, 2000))
        const result = axiosInterceptorInstance.post(url, filters);

        result.then(function (response: any) {
            if (response && response.data && response.data.status === true) {
                setEntries(response.data.data);
            }
            else {
                console.log(response.data.errors);
                response.data.errors?.map((err: any) => {
                    MySwal.fire({
                        title: "Error!",
                        text: err?.message,
                        icon: "error"
                    });
                })
            }
        })
            .catch(function (error: any) {
                console.error(error.message);
                MySwal.fire({
                    title: "Error!",
                    text: error?.message,
                    icon: "error"
                });
            });


    }

    useEffect(() => {
        loadEntries();
    }, []);

    return (
        <>
            {entries ? <SearchableSelect entries={entries} activeItem={activeItem} setActiveItem={setActiveItem} /> : <div className="w-full items-center justify-center flex"><PulseLoader /></div>}
        </>
    )

}