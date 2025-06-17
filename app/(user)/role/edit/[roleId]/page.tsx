'use client'
import axiosInterceptorInstance from '@/axiosInterceptorInstance';
import React, { useEffect, useState } from 'react'
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import RoleForm from '../../components/role-form';

const RoleEdit = ({ params }: {
  params: { roleId: string }
}) => {

  const { roleId } = params;
  const [role, setRole] = useState();
  const MySwal = withReactContent(Swal)

  useEffect(() => {
    async function loadData() {
      if (roleId) {
          try {
              const response = await axiosInterceptorInstance.get(`role/get/${roleId}`);
              if (response?.data?.data) {
                  setRole(response.data.data);
              }
          }
          catch (exception: any) {
              //const isAuthError = ResponseUtils.isAuthError(exception);
              MySwal.fire({
                  title: "Error!",
                  text: exception.response?.data?.message,
                  //html: isAuthError ? <Link className='underline hover:text-blue-800' href="/logout" >Log out</Link> : '',
                  html: exception?.response,
                  icon: "error",
                  // showConfirmButton: !isAuthError
              })
          }
      }
  }
  if(role==null){
    loadData();
  }
}, []);

  return (
    <>{role && <RoleForm initData={role}/>}</>
  )
}

export default RoleEdit
