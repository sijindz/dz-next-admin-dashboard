'use client'
import React, { use, useEffect, useState } from 'react'
import MemberForm from '../../components/member-form';
import axiosInterceptorInstance from '@/axiosInterceptorInstance';

export default function EditMemberPage({ params }: {
 params: Promise<{ memberId: string }>
}) {

  const { memberId } = use(params);
  const [member, setMember] = useState();

  async function loadData() {
    if (memberId) {
      axiosInterceptorInstance.get(`/member/find-one?id=${memberId}&&mode=VIEW`)
        .then(function (response) {
          setMember(response.data.data);
          console.log(response.data.data);
        });
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  return (
    <>
      {member && <MemberForm initData={member} />}
    </>
  )
}

