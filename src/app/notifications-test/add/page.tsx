'use client'


import { NotificationAdding } from "@/client/features/notification-adding";
import { NotificationsAdminList } from "@/client/features/notifications-admin-list";

export default function () {
    return <>
        <NotificationsAdminList />
        <NotificationAdding />
    </>
}