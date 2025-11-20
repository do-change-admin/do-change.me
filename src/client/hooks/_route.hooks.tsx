"use client";

import {useState, useCallback, ReactNode} from "react";
import { useRouter } from "next/navigation";
import {FaChartLine, FaCog, FaGavel, FaTag} from "react-icons/fa";

type SubLink = {
    label: string;
    href: string;
    dataTestId: string;
};

type NavLink = {
    label: string;
    href: string;
    dataTestId: string;
    icon: ReactNode;
    sub?: SubLink[];
};

export const NAV_LINK: NavLink[] = [
    { label: "Reports", dataTestId: "reports", href: "/", icon: <FaChartLine /> },
    {
        label: "Auctions",
        href: "/auctions",
        dataTestId: "auctions",
        icon: <FaGavel />,
        sub: [
            { label: "Dealer Auctions", dataTestId: "dealerAuctions", href: "/auctions/dealer" },
            { label: "insurance Auctions", dataTestId: "insuranceAuctions", href: "/auctions/insurance" },
        ],
    },
    { label: "Sell", dataTestId: "sell", href: "/sdk", icon: <FaTag /> },
    { label: "Settings", dataTestId: "settings", href: "/settings", icon: <FaCog /> },
];

export function useNavMenu(handleOpenMenu: () => void) {
    const router = useRouter();
    const [subLinks, setSubLinks] = useState<SubLink[]>([]);
    const [ currentLink, setCurrentLink] = useState('');
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
            setCurrentLink(link.href);
        },
        [router, handleOpenMenu]
    );

    return {
        navLinks: NAV_LINK,
        subLinks,
        collapsed,
        setCollapsed,
        handleClick,
        currentLink
    };
}
