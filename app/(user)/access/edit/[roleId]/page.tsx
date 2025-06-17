'use client'
import axiosInterceptorInstance from '@/axiosInterceptorInstance';
import React, { useEffect, useState } from 'react'
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import AccessForm from '../../components/access-form';

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
              const response = await axiosInterceptorInstance.get(`access/get/${roleId}`);
              if (response?.data?.data) {
                  setRole(response.data.data);
              }
          }
          catch (exception: any) {
              MySwal.fire({
                  title: "Error!",
                  text: exception.response?.data?.message,
                  html: exception?.response,
                  icon: "error",
              })
          }
      }
  }
  if(role==null){
    loadData();
  }
}, []);

  return (
    <>{role && <AccessForm initData={role}/>}</>
  )
}

export default RoleEdit
