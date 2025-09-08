"use client";
import {useState, useCallback, ReactNode} from "react";
import { useRouter } from "next/navigation";
import {FaChartLine, FaCog, FaGavel, FaTag} from "react-icons/fa";

type SubLink = {
    label: string;
    href: string;
};

type NavLink = {
    label: string;
    href: string;
    icon: ReactNode;
    sub?: SubLink[];
};

export const NAV_LINK: NavLink[] = [
    { label: "Reports", href: "/", icon: <FaChartLine /> },
    {
        label: "Auctions",
        href: "/auctions",
        icon: <FaGavel />,
        sub: [
            { label: "Dealer Auctions", href: "/auctions/dealer" },
            { label: "insurance Auctions", href: "/auctions/insurance" },
        ],
    },
    { label: "Sell", href: "/marketplace", icon: <FaTag /> },
    { label: "Settings", href: "/settings", icon: <FaCog /> },
];

export function useNavMenu(handleOpenMenu: () => void) {
    const router = useRouter();
    const [subLinks, setSubLinks] = useState<SubLink[]>([]);
    const [collapsed, setCollapsed] = useState(false);

    const handleClick = useCallback(
        (link: NavLink) => {
            if (link.sub) {
                setSubLinks(link.sub);
                setCollapsed((prev) => !prev);
                handleOpenMenu();
                return;
            }
            setCollapsed(false);
            router.push(link.href);
        },
        [router, handleOpenMenu]
    );

    return {
        navLinks: NAV_LINK,
        subLinks,
        collapsed,
        setCollapsed,
        handleClick,
    };
}
