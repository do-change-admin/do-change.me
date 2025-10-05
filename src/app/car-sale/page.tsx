'use client'

import { CarSaleStatus } from "@/entities"
import { useCarsForSaleUserList } from "@/hooks/_car-sale.user.hooks"
import { Button, Select } from "@mantine/core"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function () {
    const router = useRouter()
    const [status, setStatus] = useState<CarSaleStatus | 'all'>()
    const { data, isFetching } = useCarsForSaleUserList({ pageSize: 100, zeroBasedIndex: 0 }, status === 'all' ? undefined : status)

    return <div>
        <Select
            onChange={(x) => {
                setStatus(x as CarSaleStatus || 'all')
            }}
            value={status}
            data={['all', 'active', 'draft', 'pending publisher', 'pending sales', 'sold'] as (CarSaleStatus | 'all')[]}
        />

        {isFetching ? <>Loading...</> : data?.items?.length ? <table>
            <thead>
                <tr>
                    <td>Licence plate</td>
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
                                <td>{x.status}</td>
                                <td>
                                    <Button onClick={() => {
                                        router.push('/car-sale/details?id=' + x.id)
                                    }}>See details</Button>
                                </td>
                            </tr>
                        )
                    })
                }
            </tbody>
        </table> : <div>
            You don't have any cars posted. Try to change status or <Button onClick={() => {
                router.push('/car-sale/post')
            }}>Post your first car!</Button></div>}
        {data?.items?.length ? <Button onClick={() => {
            router.push('/car-sale/post')
        }}>Post another car</Button> : <></>}
    </div>
}