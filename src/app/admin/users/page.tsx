'use client'

import { useAdminUsersInfo } from "@/hooks/_admin-users.hooks";

export default function () {
    const { data, isFetching } = useAdminUsersInfo()

    if (isFetching) {
        return <>Loading...</>
    }

    if (!data?.users.length) {
        return <>No reports usage was detected</>
    }

    return <div>
        {data.users.map((x) => {
            return (
                <div>
                    {x.id} {x.subscription ? `(подписка - ${x.subscription.type} - ${x.subscription.isActive ? 'Активна' : 'Не активна'})` : ''}({x.email}) - {x.downloadedReports} reports
                </div>
            )
        })}
    </div>
}