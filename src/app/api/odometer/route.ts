import { NextResponse } from 'next/server';

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const vin = searchParams.get('vin');

    if (!vin) {
        return NextResponse.json({ error: 'VIN parameter is required' }, { status: 400 });
    }
    const keys = [
        process.env.ODOMETER_API_KEY_03,
        process.env.ODOMETER_API_KEY_04,
        process.env.ODOMETER_API_KEY_05,
        process.env.ODOMETER_API_KEY_06,
        process.env.ODOMETER_API_KEY_07,
        process.env.ODOMETER_API_KEY_08,
        process.env.ODOMETER_API_KEY_09
    ];

    try {
        let responseData: Response | {} = {};
        let keyIndex = 0;
        // @ts-expect-error
        while (!responseData.ok) {
            const currentKey = keys[keyIndex];

            if (!currentKey) {
                return NextResponse.json({ error: 'Failed to fetch vehicle history' }, { status: 500 });
            }
            const params = new URLSearchParams({
                api_key: keys[keyIndex] || '',
                fields: 'id,price,miles,seller_name,city,state,last_seen_at_date,first_seen_at_date'
            });

            responseData = await fetch(`${process.env.ODOMETER_API}/${vin}?${params.toString()}`, {
                method: 'GET',
                headers: {
                    Accept: 'application/json'
                },
                next: { revalidate: 0 }
            });

            // @ts-expect-error
            if (responseData.ok) {
                // @ts-expect-error
                const data = await responseData.json();
                return NextResponse.json(data);
            }

            keyIndex += 1;
        }

        return NextResponse.json({ error: 'Failed to fetch vehicle history' }, { status: 500 });
    } catch (error) {
        console.error('Unexpected error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
