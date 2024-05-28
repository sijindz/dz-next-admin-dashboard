import Header from "@/components/header";
import PageWrapper from "@/components/pagewrapper";
import { SideBar } from "@/components/sidebar";

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