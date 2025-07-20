import { useTheme } from "next-themes";
import Image from "next/image"

export const SideBarLogo=()=>
{
    const { theme } = useTheme();
return <Image width={35} alt="" className="w-12 mx-3.5 min-h-fit"
height={35} src={theme === 'dark' || theme === 'custom' ? '/DZ-logos_white.png' : '/DZ-logos_black.png'}/>
}