import presetHTML from './presetHTML';
import { load } from 'cheerio';

export const parse = (html?: string) => {
    const result: Record<string, string> = {};

    const $ = load(html || presetHTML);
    $('.vin-summary-wrapper .vin-anchor-link').each((_, el) => {
        const span = $(el).find('.summary-text').first();
        const title = span.find('b').text().trim();

        const descriptionSpan = span.clone();
        descriptionSpan.find('b').remove();
        const description = descriptionSpan.text().trim().replace(/\s+/g, ' ');

        result[title] = description;
    });

    return result
}