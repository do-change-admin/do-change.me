'use client'

import { useCarForSaleSellsDetail } from "@/hooks"
import { Button } from "@mantine/core"
import { useRouter, useSearchParams } from "next/navigation"

export default function () {
    const searchParams = useSearchParams()
    const router = useRouter()
    const id = searchParams.get('id')
    const userId = searchParams.get('userId')

    const { data } = useCarForSaleSellsDetail(id!, userId!)

    return <div>
        {JSON.stringify(data)}
        <Button onClick={() => {
            router.push('/sells/car-sale')
        }}>Go to list</Button>
    </div>
}