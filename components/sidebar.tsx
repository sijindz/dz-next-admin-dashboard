import { SIDENAV_ITEMS } from '@/app/menu_constants';
import classNames from 'classnames';
import Image from 'next/image';
import React, { Dispatch, SetStateAction } from 'react'
import { SideBarMenuItem } from './sidebar-menu-item';


export const SideBar = ({ toggleCollapse, setToggleCollapse }: { toggleCollapse: boolean, setToggleCollapse: Dispatch<SetStateAction<boolean>> }) => {
    //left-[-100%] left-0
    const asideStyle = classNames("fixed light:bg-[#fff] bg-[#31353d] text-gray-500 z-50 h-full shadow-lg shadow-gray-900/20 transition duration-300 ease-in-out",
        {
            ["w-[20rem]"]: !toggleCollapse,
            ["sm:w-[5.4rem] sm:left-0 left-[-100%]"]: toggleCollapse,
        });

    return (
        <aside className={asideStyle}>
            <div className="sidebar-top relative flex items-center px-3.5 py-5">
                <Image width={35} alt="" className="w-12 mx-3.5 min-h-fit"
                    height={35} src='/DZ-logos_white.png' id="dzIcon" />
                <h3 className={classNames("pl-2 font-bold text-2xl min-w-max text-[#e6e9ee] light:text-[#6e768e]",
                    { hidden: toggleCollapse })}>
                    DZ Dashboard</h3>
            </div>
            <nav className="flex flex-col gap-2 transition duration-300 ease-in-out">
                <div className="flex flex-col gap-2 px-4">
                {SIDENAV_ITEMS.map((item, idx) => {
                        return <SideBarMenuItem key={idx} item={item} toggleCollapse={toggleCollapse} />;
                    })}
                </div>
            </nav>
        </aside>
    )
}
