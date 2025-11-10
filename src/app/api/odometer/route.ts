import { NextResponse } from 'next/server'

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url)
    const vin = searchParams.get('vin')

    if (!vin) {
        return NextResponse.json({ error: 'VIN parameter is required' }, { status: 400 })
    }

    try {
        const params = new URLSearchParams({
            api_key: process.env.ODOMETER_API_KEY_03 || '',
            fields: 'id,price,miles,seller_name,city,state,last_seen_at_date,first_seen_at_date',
        })

        const response = await fetch(`${process.env.ODOMETER_API}/${vin}?${params.toString()}`, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
            },
            next: { revalidate: 0 }, // не кэшировать
        })

        if (!response.ok) {
            console.error('MarketCheck API error:', await response.text())
            return NextResponse.json(
                { error: 'Failed to fetch vehicle history' },
                { status: response.status }
            )
        }

        const data = await response.json()
        return NextResponse.json(data)
    } catch (error) {
        console.error('Unexpected error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
