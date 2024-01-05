import classNames from 'classnames';
import { ReactNode } from 'react';

export default function PageWrapper({ children, toggleCollapse }: { children: ReactNode, toggleCollapse: boolean }) {

    const bodyStyle = classNames("bg-slate-50 flex-grow text-black p-2 mt-16",
        {
            ["sm:pl-[20.4rem]"]: !toggleCollapse,
            ["sm:pl-[5.8rem]"]: toggleCollapse,
        });

    return (        
            <div className={bodyStyle}>
                {children}
            </div>
    );
}