import { NextResponse } from 'next/server';

export async function POST(req:any) {
    try {
        const body = await req.json(); // ✅ получаем объект
        const url = body.url;
        console.log(`POST URL: ${url}`);
        // 1. Получаем данные из входящего запроса (если вы передаете их с фронтенда)
        // В данном примере мы используем значения из вашего curl-запроса
        const rapidApiKey = 'f83a8c6d84msh27789c1167c85b6p1eec1ajsn9b2abef80aca';
        const rapidApiHost = 'cars-image-background-removal.p.rapidapi.com';

        // Создаем новый FormData для отправки во внешний API
        const formData = new FormData();
        formData.append('url', url);
        formData.append('url-bg', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ64wczMGBKRKHJAw_TU4sfaElwJtW6gb1sMQ&s');

        // Если вам нужно передать файл "image-bg", его нужно сначала получить из request.formData()
        // В этом примере оставим текстовые поля для простоты

        const response = await fetch(
            'https://cars-image-background-removal.p.rapidapi.com/v1/results?mode=fg-image-shadow',
            {
                method: 'POST',
                headers: {
                    'x-rapidapi-host': rapidApiHost,
                    'x-rapidapi-key': rapidApiKey,
                },
                body: formData,
            }
        );

        if (!response.ok) {
            const errorData = await response.text();
            return NextResponse.json({ error: errorData }, { status: response.status });
        }
        const data = await response.json();
        const base64Image = `data:image/png;base64,${data?.results?.[0]?.entities?.[0]?.image}`;
        return NextResponse.json({ image: base64Image });

    } catch (error) {
        console.error('Ошибка при обработке изображения:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}