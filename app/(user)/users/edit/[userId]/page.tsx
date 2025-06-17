'use client'
import axiosInterceptorInstance from '@/axiosInterceptorInstance';
import React, { useEffect, useState } from 'react'
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import UserForm from '../../components/user-form';

const UserEdit = ({ params }: {
  params: { userId: string }
}) => {

  const { userId: userId } = params;
  const [user, setUser] = useState();
  const MySwal = withReactContent(Swal)

  useEffect(() => {
    async function loadData() {
       console.log(userId);
      if (userId) {
          try {
              const response = await axiosInterceptorInstance.get(`user/get/${userId}`);
              console.log(response);
              if (response?.data?.data) {
                  setUser(response.data.data);
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
  if(user===undefined || user===null) {
    loadData();
  }
}, []);

  return (
    <>{user && <UserForm initData={user}/>}</>
  )
}

export default UserEdit
