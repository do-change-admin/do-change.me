import puppeteer from 'puppeteer';
import { parse } from './parser'
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const getDataFromISeeCars = async (vin: string) => {
    if (vin === '11111111111111111') {
        return parse()
    }
    try {
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });

        const page = await browser.newPage();
        await page.goto('https://www.iseecars.com/vin', { waitUntil: 'networkidle2' });

        await page.waitForSelector('#vin-field');
        await page.type('#vin-field', vin);

        await Promise.all([
            page.click('#vin-submit-button'),
            page.waitForNavigation({ waitUntil: 'networkidle2' }),
        ]);


        let counter = 0;
        while (!await page.$('.summary-text')) {
            if (counter > 5) {
                return undefined
            }
            await sleep(1000)
            await Promise.all([
                page.click('#vin-submit-button'),
                page.waitForNavigation({ waitUntil: 'networkidle2' }),
            ]);
            counter++
        }
        try {
            await page.waitForSelector('#f_loading_results', { hidden: true, timeout: 5000 });
        }
        catch {

        }
        const html = await page.content();
        await browser.close();

        return parse(html)
    } catch (err) {
        console.error(err)
        return undefined
    }

}

