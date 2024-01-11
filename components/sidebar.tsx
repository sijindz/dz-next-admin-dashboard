'use client'
import { SIDENAV_ITEMS } from '@/app/menu_constants';
import classNames from 'classnames';
import Image from 'next/image';
import React, { useEffect, useState } from 'react'
import { useSideBarToggle } from '@/hooks/use-sidebar-toggle';
import SideBarMenuGroup from './sidebar-menu-group';
import { useTheme } from 'next-themes';


export const SideBar = () => {
    const [mounted, setMounted] = useState(false);
    const { toggleCollapse } = useSideBarToggle();
    const { theme } = useTheme();
    const asideStyle = classNames("sidebar overflow-y-auto overflow-x-auto fixed bg-sidebar h-full shadow-sm shadow-slate-500/40 transition duration-300 ease-in-out z-[99999]",
        {
            ["w-[20rem]"]: !toggleCollapse,
            ["sm:w-[5.4rem] sm:left-0 left-[-100%]"]: toggleCollapse,
        });

    useEffect(() => setMounted(true), []);

    return (
        <aside className={asideStyle}>
            <div className="sidebar-top relative flex items-center px-3.5 py-5">

                {mounted &&
                    <Image width={35} alt="" className="w-12 mx-3.5 min-h-fit"
                        height={35} src={theme === 'dark' || theme === 'custom' ? '/DZ-logos_white.png' : '/DZ-logos_black.png'}/>
                }

                <h3 className={classNames("pl-2 font-bold text-2xl min-w-max text-sidebar-foreground",
                    { hidden: toggleCollapse })}>
                    DZ Dashboard</h3>
            </div>
            <nav className="flex flex-col gap-2 transition duration-300 ease-in-out">
                <div className="flex flex-col gap-2 px-4">
                    {SIDENAV_ITEMS.map((item, idx) => {
                        return <SideBarMenuGroup key={idx} menuGroup={item} />;
                    })}
                </div>
            </nav>
        </aside>
    )
}
