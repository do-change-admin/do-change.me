'use client'

import { useCarForSaleUserDetail } from "@/hooks/_car-sale.user.hooks"
import { Button } from "@mantine/core"
import { useRouter, useSearchParams } from "next/navigation"

export default function () {
    const searchParams = useSearchParams()
    const { data, isFetching } = useCarForSaleUserDetail(searchParams.get('id') || '')
    const router = useRouter()

    if (isFetching) {
        return <>Loading...</>
    }

    if (!data) {
        return <>No according car for sale was found</>
    }

    return <table>
        <tbody>
            <tr>
                <td>Licence plate</td>
                <td>{data.licencePlate}</td>
            </tr>
            <tr>
                <td>Mileage</td>
                <td>{data.mileage}</td>
            </tr>
            <tr>
                <td>Status</td>
                <td>{data.status}</td>
            </tr>

            <tr>
                <td>Photo</td>
                <td><img src={data.photoLink} /></td>
            </tr>
        </tbody>
        <Button onClick={() => {
            router.push('/car-sale')
        }}>
            Go to your cars list
        </Button>
    </table>
}