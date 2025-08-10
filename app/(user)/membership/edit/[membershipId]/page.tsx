'use client'

import { use, useEffect, useState } from "react";
import MembershipForm from "../../components/membership-form";
import axiosInterceptorInstance from "@/axiosInterceptorInstance";
import Loader from "@/components/ui/custom/loader";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import ResponseUtils from "@/lib/respone-utils";
import Link from "next/link";

export default function EditMembership({ params }: {
 params: Promise<{ membershipId: string }>
}) {

  const { membershipId } = use(params);
  const [membership, setMembership] = useState();
  const MySwal = withReactContent(Swal);
  async function loadData() {
    if (membershipId) {
      try {
        const response = await axiosInterceptorInstance.get(`membership/find-one?id=${membershipId}&&mode=VIEW`);
        if (response?.data?.status == true) {
          setMembership(response?.data?.data);
        }
        console.log(response.data);
      } catch (exception: any) {
        const isAuthError = ResponseUtils.isAuthError(exception);
        MySwal.fire({
          title: isAuthError ? 'Authentication failed' : 'Error!',
          text: exception.response?.data?.message,
          html: isAuthError ? <Link className='underline hover:text-blue-800' href="/logout" >Log in</Link> : '',
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
      {membership ? <MembershipForm initData={membership} /> : <Loader loading={true} />}
    </>
  );
}
