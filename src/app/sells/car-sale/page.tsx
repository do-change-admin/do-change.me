'use client'

import { useCarsForSaleAdminList } from "@/hooks"
import { Button } from "@mantine/core"
import { useRouter } from "next/navigation"

export default function () {
    const { data } = useCarsForSaleAdminList({ pageSize: 1000, zeroBasedIndex: 0 })
    const router = useRouter()

    return <div>
        <table>
            <thead>
                <tr>
                    <td>Licence plate</td>
                    <td>User email</td>
                    <td>Status</td>
                    <td>Actions</td>
                </tr>
            </thead>
            <tbody>
                {
                    data?.items.map((x) => {
                        return (
                            <tr key={x.id}>
                                <td>{x.licencePlate}</td>
                                <td>{x.userMail}</td>
                                <td>{x.status}</td>
                                <td>
                                    <Button onClick={() => {
                                        router.push(`/sells/car-sale/details?id=${x.id}&userId=${x.userId}`)
                                    }}>See details</Button>
                                </td>
                            </tr>
                        )
                    })
                }
            </tbody>
        </table>
    </div >
}