"use client";
import { useSideBarToggle } from '@/hooks/use-sidebar-toggle';
import { SideNavItem } from '@/types/type';
import classNames from 'classnames';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useState } from 'react'
import { BsChevronRight } from 'react-icons/bs';

export const SideBarMenuItem = ({ item }: { item: SideNavItem }) => {

    const { toggleCollapse } = useSideBarToggle();

    const pathname = usePathname();

    const [subMenuOpen, setSubMenuOpen] = useState(false);

    const toggleSubMenu = () => {
        setSubMenuOpen(!subMenuOpen);
    };

    const inactiveLink = classNames("flex items-center min-h-[40px] h-full text-[#6e768e] light:text-[#6e768e] py-2 px-4 light:hover:text-black hover:text-white  light:hover:bg-[#efefef] hover:bg-[#3a3f48] rounded-md transition duration-200"
    );

    const activeLink = classNames("rounded-md active text-white light:text-black light:bg-[#efefef] bg-[#3a3f48]");

    const navMenuDropdownItem = "text-[#6e768e] light:text-[#6e768e] py-2 px-4 light:hover:text-black hover:text-white transition duration-200"

    const dropdownMenuHeaderLink = classNames(inactiveLink,
        {
            ["light:bg-[#efefef] bg-[#3a3f48]"]: subMenuOpen
        }
    );
    return (
        <>
            {item.submenu ? (
                <div className="rounded-md min-w-[18px]">
                    <a className={`${dropdownMenuHeaderLink} ${pathname.includes(item.path) ? activeLink : ''}`}
                        onClick={toggleSubMenu}>
                        {item.icon}
                        {!toggleCollapse && <>
                            <span className='ml-3 text-base leading-6 font-semibold'>{item.title}</span>
                            <BsChevronRight className={`${subMenuOpen ? 'rotate-90' : ''} ml-auto stroke-2 text-xs`} />
                        </>
                        }
                    </a>
                    {subMenuOpen && !toggleCollapse && (
                        <div className='light:bg-[#efefef] bg-[#3a3f48] border-l-4'>
                            <div className='grid gap-y-2 px-10 leading-5 py-3'>
                                {item.subMenuItems?.map((subItem, idx) => {
                                    return (
                                        <Link
                                            key={idx}
                                            href={subItem.path}
                                            className={`${navMenuDropdownItem} ${subItem.path === pathname ? 'text-white light:text-black ' : ''}`}
                                        >
                                            <span>{subItem.title}</span>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>)
                    }
                </div>
            ) :
                (<Link href={item.path} className={`${inactiveLink} ${item.path === pathname ? activeLink : ''}`}>
                    {item.icon}
                    {!toggleCollapse && (<span className="ml-3 leading-6 font-semibold">{item.title}</span>)}
                </Link>)}
        </>
    );
};