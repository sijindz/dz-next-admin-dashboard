import { useEffect, useState } from "react";

import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import { PulseLoader } from "react-spinners";
import SearchableSelectFormItem from "../ui/custom/searchable-select-form-item";
import { Control } from "react-hook-form";
import axiosInterceptorInstance from "@/axiosInterceptorInstance";

export const CommonSearchableSelectFormItem = ({ fieldName, fieldLabel, url, filters, control, onSelect, disabled = false }: { fieldName: string, fieldLabel: string, url: string, filters: any[], control: Control<any, any>, onSelect: any, disabled?: boolean }) => {

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
            {entries ? <SearchableSelectFormItem fieldLabel={fieldLabel} fieldName={fieldName} entries={entries} control={control} onSelect={onSelect} disabled={disabled} /> : <div className="w-full items-center justify-center flex"><PulseLoader /></div>}
        </>
    )

}