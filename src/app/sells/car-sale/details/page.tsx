'use client'

import { CarSaleStatus } from "@/entities"
import { useCarForSaleAdminDetail, useCarSaleStatusChange } from "@/hooks"
import { Button, Select } from "@mantine/core"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

export default function () {
    const searchParams = useSearchParams()
    const router = useRouter()
    const id = searchParams.get('id')
    const userId = searchParams.get('userId')
    const [status, setStatus] = useState<CarSaleStatus>('active')
    const { mutate: changeStatus, isPending } = useCarSaleStatusChange()

    const { data, isFetching, isFetched } = useCarForSaleAdminDetail(id!, userId!)

    useEffect(() => {
        if (isFetched && data) {
            setStatus(data.status)
        }
    }, [isFetched])

    useEffect(() => {
        if (!data) {
            return
        }

        if (status !== data.status) {
            changeStatus({
                body: {
                    carId: data.id,
                    userId: data.userId,
                    payload: {
                        status
                    }
                }
            })
        }
    }, [status, data])


    if (isFetching) {
        return <>Thinking...</>
    }

    if (!data) {
        return <>No according car for sale was found</>
    }

    return <div>
        <table>
            <tbody>
                <tr>
                    <td>VIN</td>
                    <td>{data.vin}</td>
                </tr>
                <tr>
                    <td>Mileage</td>
                    <td>{data.mileage}</td>
                </tr>
                <tr>
                    <td>Status</td>
                    <td>
                        <Select
                            disabled={isPending}
                            value={status}
                            data={['active', 'pending publisher', 'pending sales', 'sold'] as CarSaleStatus[]}
                            onChange={(x) => {
                                if (!x) {
                                    return;
                                }

                                setStatus(x as CarSaleStatus)
                            }}
                        />
                    </td>
                </tr>
                <tr>
                    <td>User</td>
                    <td>{data.userMail}</td>
                </tr>
                <tr>
                    <td>Photo</td>
                    <td><img src={data.photoLinks[0]} /></td>
                </tr>
            </tbody>
        </table>
        <Button onClick={() => {
            router.push('/sells/car-sale')
        }}>Go to list</Button>
    </div>
}