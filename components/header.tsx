
'use client';
import classNames from "classnames";

import { Dispatch, SetStateAction } from "react";
import { BsList } from "react-icons/bs"

export default function Header({ toggleCollapse, setToggleCollapse }: { toggleCollapse: boolean, setToggleCollapse: Dispatch<SetStateAction<boolean>> }) {

    const sidebarToggle = () => {
        setToggleCollapse(!toggleCollapse);
    }
    const headerStyle = classNames("bg-[#31353d] fixed w-full z-0 px-4 shadow-sm shadow-slate-500/40",
        {
            ["sm:pl-[20rem]"]: !toggleCollapse,
            ["sm:pl-[5.6rem]"]: toggleCollapse,
        });
    return (
        <header className={headerStyle}>
            <div className="h-16 flex items-center justify-between">
                <button onClick={sidebarToggle} className="order-2 sm:order-1 shrink-btn float-right bg-[#3a3f48] light:bg:[#efefef] text-[#6e768e] light:text-[#6e768e] light:hover:bg-black hover:bg-white light:hover:text-white  hover:text-black ml-3 rounded-md w-[30px] h-[30px] flex items-center justify-center shadow-md shadow-black/10  transition duration-300 ease-in-out">
                    <BsList />
                </button>
                <div className="sm:order-2 order-1 h-10 w-10 rounded-full light:bg:[#efefef] bg-[#3a3f48] flex items-center justify-center text-center">
                    <span className="font-semibold text-sm">HQ</span>             
                </div>
            </div>
        </header>
    )
}