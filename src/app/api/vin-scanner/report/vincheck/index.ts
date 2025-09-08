import puppeteer from 'puppeteer';
import { parse } from './parser'

export const getDataFromVinCheck = async (vin: string) => {
    if (vin === '11111111111111111') {
        return parse()
    }

    try {
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });

        const page = await browser.newPage();
        await page.goto('https://vincheck.info', {
            waitUntil: 'networkidle2',
        });

        await page.type('#vin', vin)
        await Promise.all([
            page.waitForNavigation({ waitUntil: 'networkidle2' }),
            page.click('input.btn[value="Continue"]'),
        ]);

        await page.waitForNavigation({ waitUntil: 'networkidle2' })

        const html = await page.content();

        await browser.close();
        return parse(html);
    }

    catch (e) {
        console.error(e)
        return undefined
    }
}
