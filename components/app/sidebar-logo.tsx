import { THEME_ITEMS } from "@/constants/menu_constants";
import { useTheme } from "next-themes";
import Image from "next/image"

export const SideBarLogo = () => {
    const { theme } = useTheme();
    const logo = THEME_ITEMS.find(item => item.theme === theme)?.icon || "DZ-logos_black.png";
    return <Image width={35} alt="" className="w-12 mx-3.5 min-h-fit"
        height={35} src={`/${logo}`} />
}