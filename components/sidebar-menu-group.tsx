import { useSideBarToggle } from '@/hooks/use-sidebar-toggle'
import { SideNavItemGroup } from '@/types/type'
import React from 'react'
import { SideBarMenuItem } from './sidebar-menu-item';
import classNames from 'classnames';

const SideBarMenuGroup = ({ menuGroup }: { menuGroup: SideNavItemGroup }) => {

    const { toggleCollapse } = useSideBarToggle();

    const menuGroupTitleSyle = classNames('py-4 tracking-[.1rem] font-medium uppercase text-sm text-sidebar-foreground',
        {
            'text-center': toggleCollapse
        }
    )
    return (
        <>
            <h3 className={menuGroupTitleSyle}>{!toggleCollapse ? menuGroup.title : '...'}</h3>
            {
                menuGroup.menuList?.map((item, index) => {
                    return <SideBarMenuItem key={index} item={item} />
                })
            }
        </>
    )
}

export default SideBarMenuGroup