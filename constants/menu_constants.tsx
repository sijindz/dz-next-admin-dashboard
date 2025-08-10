import { SideNavItemGroup, ThemeItem } from "@/types/type";
import { BsArrowReturnLeft, BsBook, BsClockHistory, BsCurrencyRupee, BsEnvelope, BsGear, BsHouseDoor, BsKanban, BsListUl, BsQuestionCircle } from "react-icons/bs";


export const THEME_ITEMS: ThemeItem[] = [
    { name: "Dark", theme: "dark", icon: "DZ-logos_white.png" },
    { name: "Custom", theme: "custom", icon: "DZ-logos_white.png" },
    { name: "Light", theme: "light", icon: "DZ-logos_black.png" },
    { name: "Dark Teal", theme: "dark-teal", icon: "DZ-logos_white.png" },
    { name: "Black", theme: "black", icon: "DZ-logos_white.png" },
    { name: "Dark Blue", theme: "dark-blue", icon: "DZ-logos_white.png" },
    { name: "Sunlit", theme: "sunlit", icon: "DZ-logos_black.png" },
    { name: "Mint", theme: "mint", icon: "DZ-logos_black.png" }
]

export const SIDENAV_ITEMS: SideNavItemGroup[] = [
    {
        title: "Dashboards",

        menuList: [{
            title: 'Dashboard',
            path: '/',
            icon: <BsHouseDoor size={20} />,
        }]
    },
    {
        title: 'Menu',
        menuList: [
            {
                title: 'Manage',
                path: '/products',
                icon: <BsKanban size={20} />,
                submenu: true,
                subMenuItems: [
                    { title: 'Author', path: '/author' },
                    { title: 'Member', path: '/member' },
                    { title: 'Membership', path: '/membership' },
                    { title: 'Category', path: '/category' },
                    { title: 'Language', path: '/language' },
                    { title: 'Books', path: '/book' },
                    { title: 'Book Entry', path: '/bookEntry' },
                    { title: 'Publisher', path: '/publisher' }
                ],
            }
        ]
    },
    {
        title: 'Transactions',
        menuList: [{
            title: 'Issue Book',
            path: '/issue-book',
            icon: <BsBook size={20} />,
        },
        {
            title: 'Return Book',
            path: '/return-book',
            icon: <BsArrowReturnLeft size={20} />,
        },
        {
            title: 'Renew Membership',
            path: '/renew-membership',
            icon: <BsCurrencyRupee size={20} />,
        }]
    },
    {
        title: "Reports",
        menuList: [
            {
                title: 'Issue History',
                path: '/issue-history',
                icon: <BsClockHistory size={20} />,
            }
        ]
    }
]