'use client'
import { useSideBarToggle } from '@/hooks/use-sidebar-toggle';
import classNames from 'classnames';
import { ReactNode } from 'react';

export default function PageWrapper({ children }: { children: ReactNode }) {

    const { toggleCollapse } = useSideBarToggle();
    const bodyStyle = classNames("bg-background flex-grow mt-16 px-4",
        {
            ["sm:pl-[21rem]"]: !toggleCollapse,
            ["sm:pl-[6.4rem]"]: toggleCollapse,
        });

    return (
        <div className={bodyStyle}>
            {children}
        </div>
    );
}