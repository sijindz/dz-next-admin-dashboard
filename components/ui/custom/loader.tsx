"use client";

import { ClipLoader } from "react-spinners";

const override = {
  display: 'block',
  margin: '100px auto'
}

const Loader = ({ loading}: { loading ?: boolean }) => {
  return (
    <div className="flex h-lvh w-full items-center justify-center">
      <ClipLoader loading={loading} color="#31353d" size={180} cssOverride={override}/>
    </div>
  )
};


export default Loader;