import Header from "@/components/app/header";
import PageWrapper from "@/components/app/pagewrapper";
import { SideBar } from "@/components/app/sidebar";

export default function UserLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <SideBar />
            <div className="flex flex-col h-full w-full">
                <Header />
                <PageWrapper children={children} />
            </div>
        </>
    )
}