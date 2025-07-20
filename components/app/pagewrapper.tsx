'use client'
import { useSideBarToggle } from '@/hooks/use-sidebar-toggle';
import classNames from 'classnames';
import { ReactNode, Suspense } from 'react';
import Loader from '../ui/custom/loader';

export default function PageWrapper({ children }: { children: ReactNode }) {

    const { toggleCollapse } = useSideBarToggle();
    const bodyStyle = classNames("bg-background flex flex-col mt-16 py-4 p-4 h-full overflow-y-auto",
        {
            ["sm:pl-[21rem]"]: !toggleCollapse,
            ["sm:pl-[6.4rem]"]: toggleCollapse,
        });

    return (
        <div className={bodyStyle}>
            <Suspense fallback={<Loader />}>
                {children}
            </Suspense>
        </div>
    );
}