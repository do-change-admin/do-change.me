import { load } from 'cheerio'
import presetHTML from './presetHTML';

export interface BasicInfo {
    [key: string]: string; // динамические поля (Body Style, Made In, и т.д.)
}

export interface SummaryRecord {
    [recordType: string]: string; // например "Accident Records" -> "None"
}

export interface AccidentRecord {
    date: string;
    source: string;
    details: string;
}

export interface SalvageAuctionRecord {
    date: string;
    reportingSource: string;
    details: string;
}

export interface SalesRecord {
    date: string;
    seller: string;
    details: string;
}

export interface ParseResult {
    basic: BasicInfo;
    summary: SummaryRecord;
    floodData: AccidentRecord[];
    imageUrls: string[];
    salvageAuctions: SalvageAuctionRecord[];
    salesRecords: SalesRecord[];
}

export const parse = (html?: string): ParseResult => {
    const basic: BasicInfo = {};
    const $ = load(html ?? presetHTML)

    $('table.table-bordered tbody tr').each((_, tr) => {
        const key = $(tr).find('td').eq(1).clone().children('b').remove().end().text().trim().replace(/:$/, '');
        const value = $(tr).find('td b').text().trim();
        if (key) {
            basic[key] = value;
        }
    });

    const summary: SummaryRecord = {}

    $('h3').each((_, h3) => {
        const text = $(h3).text().trim();
        if (text.includes('VINCheck.info - Overall Summary Records')) {
            const table = $(h3).closest('.vin-inner-title').nextAll('.panel-body').find('table');

            table.find('tbody tr').each((_, row) => {
                const tds = $(row).find('td');

                const type = $(tds[0]).text().trim();

                const recordTd = $(tds[1]).clone();
                recordTd.find('i').remove();
                const records = recordTd.text().trim();

                summary[type] = records
            });
        }
    });

    const floodData: AccidentRecord[] = []

    $('h3').each((_, h3) => {
        const text = $(h3).text().trim();
        if (text.includes('Accident Records')) {
            const table = $(h3).closest('.vin-inner-title').nextAll('.panel-body').find('table');

            table.find('tbody tr').each((_, row) => {
                const tds = $(row).find('td');

                const date = $(tds[0]).text().trim();

                const entity = $(tds[1]).clone();
                entity.find('i').remove();
                const records = entity.text().trim();

                const details = $(tds[2]).clone();
                details.find('i').remove();
                const det = details.text().trim();

                floodData.push({ date, source: records, details: det })
            });
        }
    });

    const imageUrls: string[] = [];
    $('.carousel-inner .item img').each((_, img) => {
        const src = $(img).attr('src');
        if (src) imageUrls.push(src);
    });

    const salvageAuctions: SalvageAuctionRecord[] = []
    $('h3').each((_, h3) => {
        const text = $(h3).text().trim();
        if (text.includes('Salvage Auction Records')) {
            const table = $(h3).closest('.vin-inner-title').nextAll('.panel-body').find('table');

            table.find('tbody tr').each((_, row) => {
                const tds = $(row).find('td');

                const date = $(tds[0]).text().trim();

                const entity = $(tds[1]).clone();
                entity.find('i').remove();
                const records = entity.text().trim();

                const details = $(tds[2]).clone();
                details.find('i').remove();
                const det = details.text().trim();

                salvageAuctions.push({ date, reportingSource: records, details: det })
            });
        }
    });

    const salesRecords: SalesRecord[] = []
    $('h3').each((_, h3) => {
        const text = $(h3).text().trim();
        if (text.includes('Sales Records')) {
            const table = $(h3).closest('.vin-inner-title').nextAll('.panel-body').find('table');

            table.find('tbody tr').each((_, row) => {
                const tds = $(row).find('td');

                const date = $(tds[0]).text().trim();

                const seller = $(tds[1]).clone();
                seller.find('i').remove();
                const records = seller.text().trim();

                const details = $(tds[2]).clone();
                details.find('i').remove();
                const det = details.text().trim();

                salesRecords.push({ date, seller: records, details: det })
            });
        }
    });

    return {
        basic,
        summary,
        floodData: floodData.filter(x => x.source || x.details),
        imageUrls,
        salvageAuctions: salvageAuctions.filter(x => x.reportingSource || x.details),
        salesRecords: salesRecords.filter(x => x.seller || x.details)
    }
}
